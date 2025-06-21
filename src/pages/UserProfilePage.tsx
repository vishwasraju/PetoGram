import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, UserMinus, MoreHorizontal, MapPin, Calendar, Shield, Lock, Globe, Users, Grid3X3, Heart, Share, Phone, Video, Blocks as Block, Flag, Edit3 } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'

interface UserProfile {
  id: string
  user_id: string
  username: string
  bio: string
  profile_picture: string
  location: string
  created_at: string
  is_public: boolean
}

interface Post {
  id: string
  content_type: string
  caption: string
  media_urls: string[]
  likes_count: number
  comments_count: number
  created_at: string
}

interface ConnectionStatus {
  status: 'none' | 'pending' | 'accepted' | 'blocked'
  type: 'friend' | 'follow'
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'none', type: 'friend' })
  const [loading, setLoading] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [postsCount, setPostsCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchUserProfile()
      fetchUserPosts()
      fetchConnectionStatus()
      fetchUserStats()
    }
    getCurrentUser()
  }, [userId])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
    console.log("Auth user id:", user?.id);
  }

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .limit(1)

      if (error) throw error
      
      if (data && data.length > 0) {
        setProfile(data[0])
      } else {
        setProfile(null)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
      setPostsCount(data?.length || 0)
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const fetchConnectionStatus = async () => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from('user_connections')
        .select('status, connection_type')
        .or(`and(requester_id.eq.${currentUser.id},requested_id.eq.${userId}),and(requester_id.eq.${userId},requested_id.eq.${currentUser.id})`)
        .single()

      if (data) {
        setConnectionStatus({ status: data.status, type: data.connection_type })
      }
    } catch (error) {
      console.error('Error fetching connection status:', error)
    }
  }

  const fetchUserStats = async () => {
    try {
      // Fetch followers count
      const { count: followers } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requested_id', userId)
        .eq('status', 'accepted')
        .eq('connection_type', 'follow');

      // Fetch following count
      const { count: following } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', userId)
        .eq('status', 'accepted')
        .eq('connection_type', 'follow');

      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
      setPostsCount(postsCount || 0);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setFollowersCount(0);
      setFollowingCount(0);
      setPostsCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !userId) return
    if (isFollowing) {
      // Unfollow
      await supabase
        .from('user_connections')
        .delete()
        .eq('requester_id', currentUser.id)
        .eq('requested_id', userId)
        .eq('connection_type', 'follow')
      setIsFollowing(false)
      await fetchUserStats(); // Refresh stats after unfollow
    } else {
      // Follow
      try {
        const { error } = await supabase
          .from('user_connections')
          .insert({
            requester_id: currentUser.id,
            requested_id: userId,
            status: 'accepted',
            connection_type: 'follow',
          })
        
        console.log('Insert result:', { error })
        
        if (error) {
          console.log('Error details:', error)
          // Check for various possible error codes
          if (error.code === '23505' || error.code === '409' || error.message?.includes('duplicate') || error.message?.includes('conflict')) {
            console.log('Handling duplicate/conflict error')
            // Unique constraint violation - connection already exists
            // Update the existing connection to accepted status
            const { error: updateError } = await supabase
              .from('user_connections')
              .update({ status: 'accepted' })
              .eq('requester_id', currentUser.id)
              .eq('requested_id', userId)
              .eq('connection_type', 'follow')
            
            if (updateError) {
              console.error('Error updating existing connection:', updateError)
              return
            }
          } else {
            console.error('Error following user:', error)
            return
          }
        }
        
        setIsFollowing(true)
        await fetchUserStats(); // Refresh stats after follow
      } catch (error) {
        console.error('Caught error following user:', error)
      }
    }
  }

  useEffect(() => {
    if (!currentUser || !userId) return
    const checkFollowing = async () => {
      const { data } = await supabase
        .from('user_connections')
        .select('*')
        .eq('requester_id', currentUser.id)
        .eq('requested_id', userId)
        .eq('connection_type', 'follow')
        .eq('status', 'accepted')
      setIsFollowing(!!data && data.length > 0)
    }
    checkFollowing()
  }, [currentUser, userId])

  const handleBlockUser = async () => {
    if (!currentUser || !userId) return

    try {
      const { error } = await supabase
        .from('user_blocks')
        .insert({
          blocker_id: currentUser.id,
          blocked_id: userId
        })

      if (error) throw error

      // Remove any existing connections
      await supabase
        .from('user_connections')
        .delete()
        .or(`and(requester_id.eq.${userId},requested_id.eq.${currentUser.id}),and(requester_id.eq.${currentUser.id},requested_id.eq.${userId})`)

      setConnectionStatus({ status: 'blocked', type: 'friend' })
    } catch (error) {
      console.error('Error blocking user:', error)
    }
  }

  const getConnectionButton = () => {
    if (!currentUser || currentUser.id === userId) return null

    switch (connectionStatus.status) {
      case 'none':
        return (
          <button
            onClick={handleFollowToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#6366F1',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
          >
            <UserPlus size={16} />
            Follow
          </button>
        )
      case 'pending':
        return (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#9CA3AF',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'not-allowed',
            }}
            disabled
          >
            <UserPlus size={16} />
            Request Sent
          </button>
        )
      case 'accepted':
        return (
          <button
            onClick={handleFollowToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#EF4444',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
          >
            <UserMinus size={16} />
            Unfollow
          </button>
        )
      case 'blocked':
        return (
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#6B7280',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'not-allowed',
            }}
            disabled
          >
            <Block size={16} />
            Blocked
          </button>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #333',
          borderTop: '4px solid #6366F1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>User Not Found</h1>
        <Link to="/home" style={{ color: '#6366F1', textDecoration: 'none' }}>
          Go back to home
        </Link>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        position: 'sticky',
        top: 0,
        zIndex: 100,
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
            {profile.username}
          </h1>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
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
            <MoreHorizontal size={20} />
          </button>
          
          {showMoreMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#222',
              borderRadius: '8px',
              border: '1px solid #333',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
            }}>
              <button
                onClick={handleBlockUser}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Block size={16} />
                Block User
              </button>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Flag size={16} />
                Report User
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Profile Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Profile Header */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid #333',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '24px',
          }}>
            {/* Profile Picture */}
            <div style={{ position: 'relative' }}>
              <img 
                src={profile.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=200'}
                alt={profile.username}
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #6366F1',
                }}
              />
              {!profile.is_public && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #111',
                }}>
                  <Lock size={12} color="#fff" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#fff',
                }}>
                  {profile.username}
                </h2>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: profile.is_public ? '#10B981' : '#EF4444',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {profile.is_public ? <Globe size={12} /> : <Lock size={12} />}
                  {profile.is_public ? 'Public' : 'Private'}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: '32px',
                marginBottom: '16px',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                  }}>
                    {postsCount.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    Posts
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                  }}>
                    {followersCount.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    Followers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#fff',
                  }}>
                    {followingCount.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    Following
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '16px',
                  color: '#E5E7EB',
                  lineHeight: '1.5',
                }}>
                  {profile.bio}
                </p>
              )}

              {/* Location */}
              {profile.location && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  <MapPin size={16} color="#9CA3AF" />
                  <span style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    {profile.location}
                  </span>
                </div>
              )}

              {/* Join Date */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Calendar size={16} color="#9CA3AF" />
                <span style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                }}>
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}>
            {currentUser && currentUser.id !== userId && (
              <>
                <button
                  onClick={handleFollowToggle}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: isFollowing ? '#9CA3AF' : '#6366F1',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = isFollowing ? '#6B7280' : '#4F46E5'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = isFollowing ? '#9CA3AF' : '#6366F1'}
                >
                  <UserPlus size={16} />
                  {isFollowing ? 'Followed' : 'Follow'}
                </button>
              </>
            )}
            {currentUser && currentUser.id === userId && (
              <Link to="/edit-profile">Edit Profile</Link>
            )}
          </div>
        </div>

        {/* Posts Section */}
        {(profile.is_public || connectionStatus.status === 'accepted') ? (
          <div style={{
            backgroundColor: '#111',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #333',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}>
              <Grid3X3 size={24} color="#6366F1" />
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
              }}>
                Posts
              </h3>
            </div>

            {posts.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <img 
                        src={post.media_urls[0]}
                        alt="Post"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#222',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9CA3AF',
                      }}>
                        <Grid3X3 size={32} />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                        <Heart size={16} fill="currentColor" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#fff',
                        fontWeight: '600',
                      }}>
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#9CA3AF',
              }}>
                <Grid3X3 size={48} style={{ marginBottom: '16px' }} />
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#fff',
                }}>
                  No posts yet
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                }}>
                  {profile.username} hasn't shared any posts yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#111',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #333',
            textAlign: 'center',
          }}>
            <Lock size={48} color="#9CA3AF" style={{ marginBottom: '16px' }} />
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#fff',
            }}>
              This Account is Private
            </h3>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#9CA3AF',
            }}>
              Follow {profile.username} to see their posts and content.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}