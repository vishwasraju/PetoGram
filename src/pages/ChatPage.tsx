import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../utils/supabase';

function getOtherUserProfile(chat, myId) {
  return chat.user1.user_id === myId ? chat.user2 : chat.user1;
}

async function handleLike(postId, userId, liked) {
  if (liked) {
    // Unlike
    await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
    await supabase.from('posts').update({ likes_count: supabase.raw('likes_count - 1') }).eq('id', postId);
  } else {
    // Like
    await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
    await supabase.from('posts').update({ likes_count: supabase.raw('likes_count + 1') }).eq('id', postId);
  }
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

export default function ChatPage() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // 7. Render
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f7f8fa' }}>
      {/* Sidebar */}
      <div style={{ width: 270, background: '#fff', borderRight: '1px solid #e5e7eb', padding: 16, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', marginBottom: 8 }}
          />
          {searchResults.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, maxHeight: 200, overflowY: 'auto', position: 'absolute', zIndex: 10, width: 240 }}>
              {searchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => startChat(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 8,
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  <img src={user.profile_picture || 'https://ui-avatars.com/api/?name=' + user.username} alt={user.username} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {contacts.map(chat => {
            const otherUser = getOtherUserProfile(chat, currentUser.user_id);
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
                  background: selectedChat && selectedChat.id === chat.id ? '#7c6cf7' : 'transparent',
                  color: selectedChat && selectedChat.id === chat.id ? '#fff' : '#222',
                  cursor: 'pointer',
                  marginBottom: 8,
                }}
              >
                <img src={otherUser.profile_picture || 'https://ui-avatars.com/api/?name=' + otherUser.username} alt={otherUser.username} style={{ width: 44, height: 44, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{otherUser.username}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f7f8fa' }}>
        <div style={{ flex: 1, padding: 32, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {selectedChat ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender_id === currentUser.id ? 'flex-end' : 'flex-start',
                  maxWidth: '60%',
                  background: msg.sender_id === currentUser.id ? 'linear-gradient(135deg, #7c6cf7, #5a50e6)' : '#fff',
                  color: msg.sender_id === currentUser.id ? '#fff' : '#222',
                  borderRadius: 12,
                  padding: '18px 22px',
                  fontSize: 18,
                  boxShadow: msg.sender_id === currentUser.id ? '0 2px 8px #7c6cf71a' : '0 2px 8px #e5e7eb1a',
                  marginBottom: 4,
                  position: 'relative',
                }}
              >
                {msg.content}
                <div style={{ fontSize: 13, opacity: 0.7, marginTop: 8, textAlign: msg.sender_id === currentUser.id ? 'right' : 'left' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#888', textAlign: 'center', marginTop: 100 }}>Select a chat or search for a user to start chatting.</div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        {selectedChat && (
          <div style={{ padding: 24, background: '#fff', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="text"
              placeholder="Type a message..."
              style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 16 }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              onClick={handleSend}
              style={{ background: 'linear-gradient(135deg, #7c6cf7, #5a50e6)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
            >
              <span role="img" aria-label="send">➤</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 