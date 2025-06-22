import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Calendar, 
  MoreHorizontal,
  Grid3X3,
  Heart,
  Share,
  Bookmark,
  UserPlus,
  Camera,
  Edit3,
  Shield,
  Star,
  Award,
  Users,
  Image as ImageIcon,
  Video,
  Tag,
  X,
  Trash2
} from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProfileCard from '../components/ProfileCard'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'
import { getCurrentUser, getUserProfile, getUserPets } from '../utils/auth'

export interface UserProfile {
  id: string
  user_id: string
  username?: string
  bio: string
  profile_picture: string
  location: string
  birth_date?: string
  phone: string
  social_media: {
    instagram: string
    twitter: string
    facebook: string
  }
  interests: string[]
  is_public: boolean
  show_email: boolean
  created_at?: string
  updated_at?: string
}

interface Post {
  id: string
  user_id: string
  content_type: string
  caption: string
  media_urls: string[]
  hashtags?: string[]
  location?: string
  privacy_level?: string
  likes_count: number
  comments_count: number
  shares_count?: number
  is_active?: boolean
  created_at: string
  username?: string
  profile_picture?: string
  pets_info?: string
  is_saved?: boolean
  user: {
    name: string
    avatar: string
    pets: string
  }
}

export interface UserPet {
  id: string
  name: string
  type: string
  breed: string
  age: string
  photo: string
}

const profilePosts = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 234,
    comments: 12,
  },
  {
    id: '2',
    type: 'video',
    url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 189,
    comments: 8,
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 156,
    comments: 5,
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 298,
    comments: 15,
  },
  {
    id: '5',
    type: 'video',
    url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 167,
    comments: 9,
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 203,
    comments: 7,
  },
]

export default function Profile() {
  const navigate = useNavigate()
  const { profileId } = useParams()
  const [activeTab, setActiveTab] = useState('posts')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [pets, setPets] = useState<UserPet[]>([])
  const [loading, setLoading] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const isOwnProfile = currentUser && profile && currentUser.id === profile.user_id
  const [showProfileCard, setShowProfileCard] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user && !profileId) {
        navigate('/');
        return;
      }
      
      const targetUserId = profileId || user?.id;
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      setCurrentUser(user);

      // Fetch all data in parallel
      await Promise.all([
        fetchCurrentUserData(targetUserId),
        fetchPosts(targetUserId),
        fetchFollowData(targetUserId)
      ]);

      setLoading(false);
    };

    loadProfileData();
  }, [profileId, navigate]);

  const fetchPosts = async (targetUserId: string) => {
    if (!targetUserId) return;
    
    try {
      // Fetch posts and the user's profile and pets info in parallel
      const [
        { data: postsData, error: postsError },
        profile,
        pets
      ] = await Promise.all([
        supabase
          .from('posts')
          .select('*')
          .eq('is_active', true)
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false }),
        getUserProfile(targetUserId),
        getUserPets(targetUserId)
      ]);
      
      if (postsError) throw postsError;

      const userName = profile?.username || 'Unknown User';
      const userAvatar = profile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;
      const petsInfo = pets && pets.length > 0 ? pets.map(p => p.name).join(', ') : 'No pets';

      const postsWithUserData = (postsData || []).map(post => {
        return {
          ...post,
          user: {
            name: userName,
            avatar: userAvatar,
            pets: petsInfo,
          },
        };
      });

      setPosts(postsWithUserData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCurrentUserData = async (targetUserId: string) => {
    try {
      const profileData = await getUserProfile(targetUserId);
      if (profileData) {
        setProfile(profileData);
        const petsData = await getUserPets(targetUserId);
        if (petsData) {
          setPets(petsData);
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchFollowData = async (targetUserId: string) => {
    if (!targetUserId) return;
    try {
      // Fetch followers count
      const { count: followers } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requested_id', targetUserId)
        .eq('status', 'accepted')
        .eq('connection_type', 'follow');

      // Fetch following count
      const { count: following } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', targetUserId)
        .eq('status', 'accepted')
        .eq('connection_type', 'follow');

      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetUserId)
        .eq('is_active', true);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error('Error fetching follow data:', error);
      setFollowersCount(0);
      setFollowingCount(0);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return;
    if (isFollowing) {
      await supabase
        .from('user_connections')
        .delete()
        .eq('requester_id', currentUser.id)
        .eq('requested_id', profile.user_id)
        .eq('connection_type', 'follow');
      setIsFollowing(false);
      await fetchFollowData(profile.user_id);
    } else {
      try {
        const { error } = await supabase
          .from('user_connections')
          .insert({
            requester_id: currentUser.id,
            requested_id: profile.user_id,
            status: 'accepted',
            connection_type: 'follow',
          });
        
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
              .eq('requested_id', profile.user_id)
              .eq('connection_type', 'follow');
            
            if (updateError) {
              console.error('Error updating existing connection:', updateError)
              return;
            }
          } else {
            console.error('Error following user:', error);
            return;
          }
        }
        
        setIsFollowing(true);
        await fetchFollowData(profile.user_id);
      } catch (error) {
        console.error('Caught error following user:', error);
      }
    }
  };

  useEffect(() => {
    if (!currentUser || !profile) return;
    const checkFollowing = async () => {
      const { data } = await supabase
        .from('user_connections')
        .select('*')
        .eq('requester_id', currentUser.id)
        .eq('requested_id', profile.user_id)
        .eq('connection_type', 'follow')
        .eq('status', 'accepted');
      setIsFollowing(!!data && data.length > 0);
    };
    checkFollowing();
  }, [currentUser, profile]);

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }
    
    try {
      // 1. Delete associated comments
      const { error: commentsError } = await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId);
        
      if (commentsError) throw new Error(`Failed to delete comments: ${commentsError.message}`);

      // 2. Delete the post itself
      const { error: postError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (postError) throw new Error(`Failed to delete post: ${postError.message}`);

      // 3. Update the local state to reflect the deletion
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));

      console.log(`Post ${postId} and its associated data have been deleted.`);

    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete the post. Please try again.');
    }
  };

  if (loading && !profile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#2A2D3A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#2A2D3A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: '#EF4444', fontSize: '24px', marginBottom: '20px' }}>User Not Found</h2>
        <p style={{ color: '#9CA3AF', fontSize: '16px', marginBottom: '30px' }}>The profile you are looking for does not exist or is unavailable.</p>
        <Button variant="primary" onClick={() => navigate('/home')}>Go to Home</Button>
      </div>
    );
  }

  // Ensure current user is set before rendering the profile
  if (!currentUser && !profileId && !loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#2A2D3A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  const tabs = [
    {
      id: 'posts',
      name: 'Posts',
      icon: Grid3X3,
      count: posts.length,
    },
  ]

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#000', color: '#fff', maxWidth: '100vw', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#111',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link 
          to="/home" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#9CA3AF',
            fontSize: '18px',
            textDecoration: 'none',
            transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          <ArrowLeft size={24} />
          <span>Back</span>
        </Link>
        {isMobile && isOwnProfile && (
          <button
            onClick={() => navigate('/settings')}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <Settings size={24} />
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? designTokens.spacing[2] : designTokens.spacing[6],
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Profile Header Section */}
        <Card style={{ marginBottom: designTokens.spacing[6], backgroundColor: '#111', border: '1px solid #333', width: '100%', boxSizing: 'border-box' }}>
          <div style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: 'column',
            gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr auto',
            gap: isMobile ? designTokens.spacing[4] : designTokens.spacing[8],
            alignItems: 'center',
          }}>
            {/* Profile Picture */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: isMobile ? '120px' : '150px',
                height: isMobile ? '120px' : '150px',
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={profile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2'}
                  alt={profile?.username || 'Profile'}
                  style={{
                    width: isMobile ? '112px' : '142px',
                    height: isMobile ? '112px' : '142px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid #000`,
                  }}
                />
              </div>
              
              {/* Verification Badge */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '32px',
                height: '32px',
                backgroundColor: designTokens.colors.primary[500],
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid #000`,
                boxShadow: designTokens.boxShadow.md,
              }}>
                <Shield size={16} color='#fff' />
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1, width: '100%', textAlign: isMobile ? 'center' : 'left' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: isMobile ? designTokens.typography.fontSize['2xl'] : designTokens.typography.fontSize['3xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                    fontFamily: designTokens.typography.fontFamily.display.join(', '),
                  }}>
                    {profile?.username || 'User'}
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: designTokens.typography.fontSize.base,
                    color: '#9CA3AF',
                    fontWeight: 500,
                  }}>
                    @{profile?.username || 'username'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: designTokens.spacing[6],
                marginTop: designTokens.spacing[4],
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: designTokens.typography.fontSize.lg, fontWeight: designTokens.typography.fontWeight.bold, color: '#fff' }}>
                    {posts.length.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: '#9CA3AF',
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Posts
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: designTokens.typography.fontSize.lg, fontWeight: designTokens.typography.fontWeight.bold, color: '#fff' }}>
                    {followersCount.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: '#9CA3AF',
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Followers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: designTokens.typography.fontSize.lg, fontWeight: designTokens.typography.fontWeight.bold, color: '#fff' }}>
                    {followingCount.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: '#9CA3AF',
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Following
                  </div>
                </div>
              </div>

              {/* Bio & Location/Joined Date */}
              <div style={{ marginTop: designTokens.spacing[4] }}>
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: designTokens.typography.fontSize.sm,
                  color: '#d1d5db',
                  lineHeight: 1.6,
                  fontFamily: designTokens.typography.fontFamily.sans.join(', '),
                }}>
                  {profile?.bio || 'No bio yet.'}
                </p>
                <div style={{
                  display: 'flex',
                  gap: designTokens.spacing[4],
                  color: '#9CA3AF',
                  fontSize: designTokens.typography.fontSize.sm,
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}>
                  {profile?.location && <span style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}><MapPin size={16} />{profile.location}</span>}
                  {profile?.created_at && <span style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}><Calendar size={16} />Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ justifySelf: isMobile ? 'stretch' : 'end', width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center', marginTop: isMobile ? '16px' : '0' }}>
              {isOwnProfile ? (
                <Button 
                  variant="primary" 
                  size="lg" 
                  style={{ width: '100%' }}
                  onClick={() => { 
                    console.log('Edit Profile clicked'); 
                    navigate('/edit-profile'); 
                  }}
                >
                  <Edit3 size={18} />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    style={{ width: '100%' }}
                    onClick={handleFollowToggle}
                  >
                    <UserPlus size={18} />
                    <span>{isFollowing ? 'Followed' : 'Follow'}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Card style={{ backgroundColor: '#111', border: '1px solid #333' }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid #333`,
            marginBottom: designTokens.spacing[6],
          }}>
            {tabs.filter(tab => isOwnProfile || tab.id !== 'saved').map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: designTokens.spacing[2],
                    padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: `3px solid ${isActive ? designTokens.colors.primary[500] : 'transparent'}`,
                    color: isActive ? designTokens.colors.primary[600] : '#9CA3AF',
                    fontWeight: isActive ? designTokens.typography.fontWeight.semibold : designTokens.typography.fontWeight.medium,
                    fontSize: designTokens.typography.fontSize.base,
                    cursor: 'pointer',
                    transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#E5E7EB'
                      e.currentTarget.style.backgroundColor = '#222'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#9CA3AF'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <IconComponent size={20} />
                  <span>{tab.name}</span>
                  <Badge variant={isActive ? 'primary' : 'default'} size="sm">
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          <div style={{
            maxWidth: '800px',
            margin: '24px auto',
            padding: '0 24px',
          }}>
            {activeTab === 'posts' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {posts.length > 0 ? (posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      aspectRatio: '1',
                      backgroundColor: '#222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      cursor: 'pointer',
                    }}
                  >
                    {isOwnProfile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the post click/navigation
                          handleDeletePost(post.id);
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          border: 'none',
                          borderRadius: '50%',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          zIndex: 10,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    {post.content_type === 'image' && (
                      <img
                        src={post.media_urls[0]}
                        alt="Post"
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    {post.content_type === 'video' && (
                      <video
                        src={post.media_urls[0]}
                        controls
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    {/* Overlay for likes/comments */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
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
                ))): (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: '#111',
                    borderRadius: '16px',
                    border: '1px solid #333',
                  }}>
                    <Grid3X3 size={48} color="#9CA3AF" style={{ marginBottom: '20px' }} />
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>No posts yet</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#9CA3AF' }}>Share your first post to get started!</p>
                    <Button variant="primary" size="md" onClick={() => navigate('/create-post')}>
                      <Camera size={18} style={{ marginRight: '8px' }} />
                      Create Post
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Profile Card Overlay */}
      {showProfileCard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: designTokens.zIndex.modal,
        }}>
          <Card style={{
            width: '90%',
            maxWidth: '500px',
            backgroundColor: '#2A2D3A',
            border: '1px solid #3A3D4A',
            borderRadius: '16px',
            padding: '32px',
            position: 'relative',
          }}>
            <button
              onClick={() => setShowProfileCard(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
              }}
            >
              <X size={24} />
            </button>
            <ProfileCard profile={profile} pets={pets} followersCount={followersCount} followingCount={followingCount} onEditProfile={() => navigate('/edit-profile')} />
          </Card>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}