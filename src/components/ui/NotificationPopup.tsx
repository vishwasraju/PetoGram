import React, { useState, useEffect } from 'react'
import { X, Heart, MessageCircle, UserPlus, Calendar, Bell, Check } from 'lucide-react'
import { designTokens } from '../../design-system/tokens'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'event' | 'general'
  title: string
  message: string
  timestamp: string
  read: boolean
  avatar?: string
  actionUrl?: string
}

interface NotificationPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'Sarah Johnson liked your post',
      message: 'Your photo of Max got a new like!',
      timestamp: '2 minutes ago',
      read: false,
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
    },
    {
      id: '2',
      type: 'comment',
      title: 'Mike Chen commented on your post',
      message: '"Such a beautiful dog! What breed is he?"',
      timestamp: '15 minutes ago',
      read: false,
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
    },
    {
      id: '3',
      type: 'follow',
      title: 'Emma Wilson started following you',
      message: 'You have a new follower!',
      timestamp: '1 hour ago',
      read: false,
      avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
    },
    {
      id: '4',
      type: 'event',
      title: 'Pet Adoption Fair Tomorrow',
      message: 'Don\'t forget about the event you\'re attending!',
      timestamp: '2 hours ago',
      read: true
    },
    {
      id: '5',
      type: 'general',
      title: 'Weekly Pet Care Tips',
      message: 'Check out this week\'s featured tips for pet health',
      timestamp: '1 day ago',
      read: true
    }
  ])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} color="#EF4444" fill="#EF4444" />
      case 'comment':
        return <MessageCircle size={20} color="#6366F1" />
      case 'follow':
        return <UserPlus size={20} color="#10B981" />
      case 'event':
        return <Calendar size={20} color="#F59E0B" />
      default:
        return <Bell size={20} color="#9CA3AF" />
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      {/* The following div was removed to prevent the black overlay when the notification popup is active. */}
      {/*
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      */}
      
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
          {notifications.length === 0 ? (
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
                      {notification.message}
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
                    e.currentTarget.parentElement!.style.opacity = '1'
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
            <button style={{
              color: '#6366F1',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}>
              View all notifications
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
        
        .notification-item:hover .delete-button {
          opacity: 1;
        }
      `}</style>
    </>
  )
}