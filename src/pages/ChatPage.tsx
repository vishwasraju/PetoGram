import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function getOtherUserProfile(chat, myId) {
  if (!chat || !chat.user1 || !chat.user2) {
    return null;
  }
  return chat.user1.user_id === myId ? chat.user2 : chat.user1;
}

async function handleAddComment(postId, userId, content) {
  await supabase.from('comments').insert({ post_id: postId, user_id: userId, content });
  await supabase.from('posts').update({ comments_count: supabase.raw('comments_count + 1') }).eq('id', postId);
}

export function TrendingHashtags() {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    async function fetchHashtags() {
      const { data } = await supabase
        .from('hashtags')
        .select('tag, usage_count')
        .gt('usage_count', 0)
        .order('usage_count', { ascending: false })
        .limit(10);
      setHashtags(data || []);
    }
    fetchHashtags();
  }, []);

  return (
    <div>
      <h3>Trending</h3>
      <ul>
        {hashtags.map(h => (
          <li key={h.tag}>
            #{h.tag} ({h.usage_count} Posts)
          </li>
        ))}
      </ul>
    </div>
  );
}

function useRealtimeMessages(roomId: string, onNewMessage: (msg: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log('New message!', payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, onNewMessage]);
}

export default function ChatPage() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 1. Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user profile using user_id
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setCurrentUser(data);
        setPageLoading(false);
      }
    };
    getUser();
  }, []);

  // 2. Search users
  useEffect(() => {
    if (search.length < 2 || !currentUser) {
      setSearchResults([]);
      return;
    }
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, user_id, username, profile_picture')
        .ilike('username', `%${search}%`)
        .neq('user_id', currentUser.user_id)
        .eq('allow_messages', true)
        .limit(10);
      setSearchResults(data || []);
    };
    fetchUsers();
  }, [search, currentUser]);

  // 3. Fetch contacts (chats)
  useEffect(() => {
    if (!currentUser) return;
    const fetchChats = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*, user1:user1_id(id, user_id, username, profile_picture), user2:user2_id(id, user_id, username, profile_picture)')
        .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });
      setContacts(data || []);
    };
    fetchChats();
  }, [currentUser, selectedChat]);

  // 4. Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', selectedChat.id)
        .order('created_at', { ascending: true });
      setMessages(data || []);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };
    fetchMessages();
    // Real-time subscription
    const sub = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${selectedChat.id}` }, payload => {
        setMessages(msgs => [...msgs, payload.new]);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [selectedChat]);

  // 5. Start or continue chat
  const startChat = async (user) => {
    if (!currentUser) return;
    // Check if chat exists
    const { data: existing, error } = await supabase
      .from('chats')
      .select('*')
      .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${user.id}),and(user1_id.eq.${user.id},user2_id.eq.${currentUser.id})`)
      .maybeSingle();
    let chat = existing;
    if (!chat) {
      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert([{ user1_id: currentUser.id, user2_id: user.id }])
        .select()
        .single();
      chat = newChat;
    }
    setSelectedChat(chat);
    setSearch('');
    setSearchResults([]);
  };

  // 6. Send message
  const handleSend = async () => {
    if (!input.trim() || !selectedChat || !currentUser) return;
    await supabase.from('messages').insert({
      chat_id: selectedChat.id,
      sender_id: currentUser.id,
      content: input.trim(),
    });
    setInput('');
  };

  if (pageLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#18181b', justifyContent: 'center', alignItems: 'center' }}>
        {/* You can use a more sophisticated loader/spinner component here */}
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </div>
    );
  }

  // 7. Render
  return (
    isMobile ? (
      !selectedChat ? (
        // Mobile: Only sidebar
        <div style={{ width: '100vw', height: '100vh', background: '#212121', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <Link to="/home" style={{ color: '#e5e7eb' }}>
                <ArrowLeft size={24} />
              </Link>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Chats</h2>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
            />
            {searchResults.length > 0 && (
              <div style={{ background: '#2a2a2a', border: '1px solid #444', borderRadius: 8, maxHeight: 200, overflowY: 'auto', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10 }}>
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    onClick={() => startChat(user)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      cursor: 'pointer',
                      borderBottom: '1px solid #444'
                    }}
                  >
                    <img src={user?.profile_picture || 'https://ui-avatars.com/api/?name=' + user.username} alt={user.username} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600 }}>{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {contacts.map(chat => {
              const otherUser = getOtherUserProfile(chat, currentUser?.user_id);
              if (!otherUser) return null;
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 10,
                    background: selectedChat && selectedChat.id === chat.id ? '#6366F1' : 'transparent',
                    color: selectedChat && selectedChat.id === chat.id ? '#fff' : '#e5e7eb',
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  <img src={otherUser?.profile_picture || 'https://ui-avatars.com/api/?name=' + otherUser?.username} alt={otherUser?.username} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{otherUser?.username}</span>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0, marginTop: 4 }}>Last message snippet...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Mobile: Only chat area
        <div style={{ width: '100vw', height: '100vh', background: '#18181b', display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <div style={{ padding: '12px 24px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 16, background: '#212121' }}>
            <button onClick={() => setSelectedChat(null)} style={{ background: 'none', border: 'none', color: '#fff', marginRight: 8 }}>
              <ArrowLeft size={24} />
            </button>
            <img
              src={getOtherUserProfile(selectedChat, currentUser.user_id)?.profile_picture || 'https://ui-avatars.com/api/?name=' + getOtherUserProfile(selectedChat, currentUser.user_id)?.username}
              alt={getOtherUserProfile(selectedChat, currentUser.user_id)?.username}
              style={{ width: 48, height: 48, borderRadius: '50%' }}
            />
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                {getOtherUserProfile(selectedChat, currentUser.user_id)?.username}
              </h3>
              <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Online</p>
            </div>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
                maxWidth: '65%',
                marginBottom: 12,
                marginRight: msg.sender_id === currentUser.id ? 24 : 0,
                marginLeft: msg.sender_id !== currentUser.id ? 24 : 0,
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 20,
                  background: msg.sender_id === currentUser.id ? '#6366F1' : '#374151',
                  color: '#fff',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, display: 'block', textAlign: msg.sender_id === currentUser.id ? 'right' : 'left' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Bar */}
          <div style={{ borderTop: '2px solid #fff', padding: 16, background: '#18181b', display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 9999, border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
            />
            <button
              onClick={handleSend}
              style={{
                background: '#6366F1',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      )
    ) : (
      // Desktop: Sidebar + divider + chat area
      <div style={{ display: 'flex', height: '100vh', background: '#18181b' }}>
        {/* Sidebar */}
        <div style={{
          width: 300,
          background: '#212121',
          borderRight: '2px solid #fff',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}>
          {/* Contacts list and search here */}
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <Link to="/home" style={{ color: '#e5e7eb' }}>
                <ArrowLeft size={24} />
              </Link>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Chats</h2>
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
            />
            {searchResults.length > 0 && (
              <div style={{ background: '#2a2a2a', border: '1px solid #444', borderRadius: 8, maxHeight: 200, overflowY: 'auto', position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10 }}>
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    onClick={() => startChat(user)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      cursor: 'pointer',
                      borderBottom: '1px solid #444'
                    }}
                  >
                    <img src={user?.profile_picture || 'https://ui-avatars.com/api/?name=' + user.username} alt={user.username} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                    <span style={{ fontWeight: 600 }}>{user.username}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {contacts.map(chat => {
              const otherUser = getOtherUserProfile(chat, currentUser?.user_id);
              if (!otherUser) return null;
              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 10,
                    background: selectedChat && selectedChat.id === chat.id ? '#6366F1' : 'transparent',
                    color: selectedChat && selectedChat.id === chat.id ? '#fff' : '#e5e7eb',
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  <img src={otherUser?.profile_picture || 'https://ui-avatars.com/api/?name=' + otherUser?.username} alt={otherUser?.username} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600 }}>{otherUser?.username}</span>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0, marginTop: 4 }}>Last message snippet...</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: '#18181b' }}>
          {/* Chat Header */}
          {selectedChat && currentUser && (
            <div style={{ padding: '12px 24px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 16, background: '#212121' }}>
              {isMobile && (
                <button onClick={() => setSelectedChat(null)} style={{ background: 'none', border: 'none', color: '#fff', marginRight: 8 }}>
                  <ArrowLeft size={24} />
                </button>
              )}
              <img
                src={getOtherUserProfile(selectedChat, currentUser.user_id)?.profile_picture || 'https://ui-avatars.com/api/?name=' + getOtherUserProfile(selectedChat, currentUser.user_id)?.username}
                alt={getOtherUserProfile(selectedChat, currentUser.user_id)?.username}
                style={{ width: 48, height: 48, borderRadius: '50%' }}
              />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                  {getOtherUserProfile(selectedChat, currentUser.user_id)?.username}
                </h3>
                <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Online</p>
              </div>
            </div>
          )}
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column' }}>
            {selectedChat && currentUser ? (
              <>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    alignSelf: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
                    maxWidth: '65%',
                    marginBottom: 12,
                    marginRight: msg.sender_id === currentUser.id ? 24 : 0,
                    marginLeft: msg.sender_id !== currentUser.id ? 24 : 0,
                  }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: 20,
                      background: msg.sender_id === currentUser.id ? '#6366F1' : '#374151',
                      color: '#fff',
                      wordBreak: 'break-word',
                    }}>
                      {msg.content}
                    </div>
                    <span style={{ fontSize: 12, color: '#9ca3af', marginTop: 4, display: 'block', textAlign: msg.sender_id === currentUser.id ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4a4a4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#e5e7eb' }}>Select a chat to start messaging</h2>
                <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 300, textAlign: 'center' }}>
                  Choose from your existing conversations or search for a new user to begin.
                </p>
              </div>
            )}
          </div>
          {/* Input Bar */}
          {selectedChat && currentUser && (
            <div style={{ borderTop: '2px solid #fff', padding: 16, background: '#18181b', display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                style={{ flex: 1, padding: '12px 16px', borderRadius: 9999, border: '1px solid #444', background: '#2a2a2a', color: '#fff' }}
              />
              <button
                onClick={handleSend}
                style={{
                  background: '#6366F1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
} 