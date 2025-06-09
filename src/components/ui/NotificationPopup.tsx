import React, { useState, useEffect } from 'react'
import { X, Heart, MessageCircle, UserPlus, Calendar, Bell, Check } from 'lucide-react'
import { designTokens } from '../../design-system/tokens'
import { supabase } from '../../utils/supabase'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'event' | 'appointment' | 'general'
  title: string
  content: string
  timestamp: string
  read: boolean
  avatar?: string
  actionUrl?: string
  related_id?: string
  related_type?: string
}

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Transform to our notification format
      const formattedNotifications = data.map(notification => ({
        id: notification.id,
        type: notification.type as any,
        title: notification.title,
        content: notification.content,
        timestamp: formatTimestamp(notification.created_at),
        read: notification.is_read,
        related_id: notification.related_id,
        related_type: notification.related_type
      }))

      setNotifications(formattedNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} color="#EF4444" fill="#EF4444" />
      case 'comment':
        return <MessageCircle size={20} color="#6366F1" />
      case 'follow':
      case 'friend_request':
        return <UserPlus size={20} color="#10B981" />
      case 'event':
      case 'appointment':
        return <Calendar size={20} color="#F59E0B" />
      default:
        return <Bell size={20} color="#9CA3AF" />
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (error) throw error

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <>
      {/* Notification Popup */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          width: '280px',
          height: '350px',
          backgroundColor: '#111',
          borderRadius: '16px',
          border: '1px solid #333',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
          zIndex: 1002,
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={24} color="#6366F1" />
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <div style={{
                minWidth: '24px',
                height: '24px',
                backgroundColor: '#EF4444',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#fff',
                fontWeight: '600',
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: '1px solid #9CA3AF',
                borderRadius: '8px',
                color: '#9CA3AF',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
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
            >
              Cancel
            </button>
            
            <button
              onClick={onClose}
              style={{
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
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{
          maxHeight: '500px',
          overflowY: 'auto',
        }}>
          {loading ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #333',
                borderTop: '3px solid #6366F1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
              }} />
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#9CA3AF',
              }}>
                Loading notifications...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
            }}>
              <Bell size={48} color="#333" style={{ marginBottom: '16px' }} />
              <h3 style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
              }}>
                No notifications
              </h3>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: '#9CA3AF',
              }}>
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #222',
                  cursor: 'pointer',
                  backgroundColor: notification.read ? 'transparent' : '#1a1a2e',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? '#1a1a1a' : '#252545'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : '#1a1a2e'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  {/* Avatar or Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: notification.avatar ? 'transparent' : '#333',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    {notification.avatar ? (
                      <img 
                        src={notification.avatar}
                        alt="Avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      getNotificationIcon(notification.type)
                    )}
                  </div>
                  
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#fff',
                      lineHeight: '1.4',
                    }}>
                      {notification.title}
                    </h4>
                    <p style={{
                      margin: '0 0 6px 0',
                      fontSize: '12px',
                      color: '#9CA3AF',
                      lineHeight: '1.4',
                    }}>
                      {notification.content}
                    </p>
                    <span style={{
                      fontSize: '12px',
                      color: '#6B7280',
                    }}>
                      {notification.timestamp}
                    </span>
                  </div>
                  
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#6366F1',
                      borderRadius: '50%',
                      flexShrink: 0,
                      marginTop: '6px',
                    }} />
                  )}
                </div>
                
                {/* Delete button (appears on hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notification.id)
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#EF4444'
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#9CA3AF'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #333',
            textAlign: 'center',
          }}>
            <button 
              onClick={markAllAsRead}
              style={{
                color: '#6366F1',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .notification-item:hover .delete-button {
          opacity: 1;
        }
      `}</style>
    </>
  )
}