import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  MessageCircle, 
  Search, 
  Plus, 
  Phone, 
  Video, 
  MoreHorizontal,
  Send,
  Smile,
  Paperclip,
  Image,
  Mic
} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { designTokens } from '../design-system/tokens'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>('1')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi there!', senderName: 'Alice', isOwn: false, timestamp: '10:00 AM', type: 'text' },
    { id: 2, text: 'Hello!', senderName: 'You', isOwn: true, timestamp: '10:01 AM', type: 'text' },
  ])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'How is Max doing with his training?',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Dr. Emily Chen',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'The vaccination appointment is confirmed for tomorrow',
      timestamp: '1h ago',
      unread: 0,
      online: false
    },
    {
      id: '3',
      name: 'Pet Lovers Group',
      avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'Mike: Anyone know good pet photographers?',
      timestamp: '3h ago',
      unread: 5,
      online: true,
      isGroup: true
    },
    {
      id: '4',
      name: 'Luna\'s Groomer',
      avatar: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'Luna looks beautiful! Here are the photos',
      timestamp: '1d ago',
      unread: 0,
      online: false
    }
  ]

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: messageText,
        senderName: 'You',
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
      }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setMessageText('')
    }
  }

  const handleAttachFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes

      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Only image and video files are allowed.');
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        alert('File size exceeds 2MB limit.');
        e.target.value = '';
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';

      const newMessage = {
        id: Date.now(),
        text: '',
        senderName: 'You',
        isOwn: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: fileType,
        url: fileUrl,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      e.target.value = ''; // Clear the input after successful attachment
    }
  }

  const handleOpenEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev)
  }

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setMessageText(prevText => prevText + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const selectedConversation = conversations.find(conv => conv.id === selectedChat)

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
      display: 'flex',
    }}>
      {/* Conversations Sidebar */}
      <div style={{
        width: '350px',
        backgroundColor: '#111',
        borderRight: '1px solid #333',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link 
              to="/home" 
              style={{
                color: '#9CA3AF',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Messages
            </h1>
          </div>
          
          <button style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}>
            <Plus size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={18} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
              }}
            />
            <input
              type="text"
              placeholder="Search conversations..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '20px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                backgroundColor: selectedChat === conversation.id ? '#222' : 'transparent',
                borderLeft: selectedChat === conversation.id ? '3px solid #6366F1' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedChat !== conversation.id) {
                  e.currentTarget.style.backgroundColor = '#1a1a1a'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChat !== conversation.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={conversation.avatar}
                    alt={conversation.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  {conversation.online && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10B981',
                      borderRadius: '50%',
                      border: '2px solid #111',
                    }} />
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#fff',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {conversation.name}
                      {conversation.isGroup && (
                        <span style={{
                          marginLeft: '6px',
                          fontSize: '12px',
                          color: '#9CA3AF',
                        }}>
                          👥
                        </span>
                      )}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: '#9CA3AF',
                    }}>
                      {conversation.timestamp}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: '#9CA3AF',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {conversation.lastMessage}
                    </p>
                    
                    {conversation.unread > 0 && (
                      <div style={{
                        minWidth: '20px',
                        height: '20px',
                        backgroundColor: '#6366F1',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#fff',
                        fontWeight: '600',
                        marginLeft: '8px',
                      }}>
                        {conversation.unread > 99 ? '99+' : conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
      }}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#111',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  {selectedConversation.online && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10B981',
                      borderRadius: '50%',
                      border: '2px solid #111',
                    }} />
                  )}
                </div>
                
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#fff',
                  }}>
                    {selectedConversation.name}
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: selectedConversation.online ? '#10B981' : '#9CA3AF',
                  }}>
                    {selectedConversation.online ? 'Online' : 'Last seen 2h ago'}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }}>
                  <Phone size={20} />
                </button>
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }}>
                  <Video size={20} />
                </button>
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }}>
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: message.isOwn ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: '8px',
                  }}>
                    {!message.isOwn && (
                      <img 
                        src={selectedConversation.avatar}
                        alt={message.senderName}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    
                    <div style={{
                      padding: '12px 16px',
                      backgroundColor: message.isOwn ? '#6366F1' : '#222',
                      borderRadius: '18px',
                      borderBottomRightRadius: message.isOwn ? '4px' : '18px',
                      borderBottomLeftRadius: message.isOwn ? '18px' : '4px',
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '15px',
                        color: message.isOwn ? '#fff' : '#E5E7EB',
                        lineHeight: '1.4',
                      }}>
                        {message.text}
                      </p>
                      {message.type === 'image' && (
                        <img src={message.url} alt="attached image" style={{
                          maxWidth: '100%',
                          borderRadius: '8px',
                          marginTop: '8px',
                        }} />
                      )}
                      {message.type === 'video' && (
                        <video src={message.url} controls style={{
                          maxWidth: '100%',
                          borderRadius: '8px',
                          marginTop: '8px',
                        }} />
                      )}
                      <span style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', display: 'block', textAlign: message.isOwn ? 'right' : 'left' }}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div ref={messagesEndRef} /> {/* Scroll target */}

            {/* Message Input */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #333',
              backgroundColor: '#111',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                backgroundColor: '#222',
                borderRadius: '24px',
              }}>
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }}
                onClick={handleAttachFile}
                >
                  <Paperclip size={18} />
                </button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                />
                
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage()
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
                
                <button style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }}
                onClick={handleOpenEmojiPicker}
                >
                  <Smile size={18} />
                </button>
                
                {showEmojiPicker && (
                  <div style={{
                    position: 'absolute',
                    bottom: '70px',
                    right: '20px',
                    zIndex: 1000,
                  }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                  </div>
                )}
                
                {messageText.trim() ? (
                  <button
                    onClick={handleSendMessage}
                    style={{
                      padding: '8px',
                      backgroundColor: '#6366F1',
                      border: 'none',
                      color: '#fff',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
                  >
                    <Send size={16} />
                  </button>
                ) : (
                  <button style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#333'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#9CA3AF'
                  }}>
                    <Mic size={18} />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
          }}>
            <MessageCircle size={64} color="#333" style={{ marginBottom: '20px' }} />
            <h2 style={{
              margin: '0 0 12px 0',
              fontSize: '24px',
              fontWeight: '600',
              color: '#fff',
            }}>
              Select a conversation
            </h2>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#9CA3AF',
              lineHeight: '1.5',
            }}>
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  )
}