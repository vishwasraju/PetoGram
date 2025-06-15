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
  X
} from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import ProfileCard from '../components/ProfileCard'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'
import { getCurrentUser, getUserProfile, getUserPets, getSavedPostIds, unsavePost, savePost } from '../utils/auth'

export interface UserProfile {
  id: string
  user_id: string
  username?: string
  bio: string
  profile_picture: string
  location: string
  birth_date?: string
  phone: string
  website: string
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
  const [savedPosts, setSavedPosts] = useState<Post[]>([])
  const [pets, setPets] = useState<UserPet[]>([])
  const [loading, setLoading] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const isOwnProfile = currentUser && profile && currentUser.id === profile.user_id
  const [showProfileCard, setShowProfileCard] = useState(false)

  useEffect(() => {
    if (profileId) {
      fetchCurrentUserData(profileId)
      fetchPosts(profileId)
      fetchSavedPosts(profileId)
      fetchFollowData(profileId)
    } else if (currentUser) {
      fetchCurrentUserData(currentUser.id)
      fetchPosts(currentUser.id)
      fetchSavedPosts(currentUser.id)
      fetchFollowData(currentUser.id)
    } else {
      setLoading(false);
    }
  }, [profileId, currentUser]);

  const fetchPosts = async (targetUserId: string) => {
    if (!targetUserId) return;
    setLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_active', true)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;

      const savedPostIds = await getSavedPostIds(currentUser?.id || '');

      const uniqueUserIdsInPosts = [...new Set((postsData || []).map(post => post.user_id))];
      const userProfilesMap = new Map<string, UserProfile>();
      const userPetsMap = new Map<string, string>();

      await Promise.all(uniqueUserIdsInPosts.map(async (userId) => {
        const profileData = await getUserProfile(userId);
        if (profileData) {
          userProfilesMap.set(userId, profileData);
        }
        const petsData = await getUserPets(userId);
        if (petsData && petsData.length > 0) {
          userPetsMap.set(userId, petsData.map(pet => pet.name).join(', '));
        }
      }));

      const postsWithUserData = (postsData || []).map(post => {
        const profile = userProfilesMap.get(post.user_id);
        const petsInfo = userPetsMap.get(post.user_id);

        return {
          ...post,
          is_saved: savedPostIds.includes(post.id),
          user: {
            name: profile?.username || (post.user_id === currentUser?.id ? currentUser.email?.split('@')[0] || 'You' : 'Unknown User'),
            avatar: profile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2',
            pets: petsInfo || 'No pets',
          },
        };
      });

      setPosts(postsWithUserData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPosts = async (targetUserId: string) => {
    if (!currentUser || !targetUserId) return;
    setLoading(true);
    try {
      const savedPostIds = await getSavedPostIds(currentUser.id);
      if (savedPostIds.length === 0) {
        setSavedPosts([]);
        setLoading(false);
        return;
      }

      const { data: fetchedSavedPosts, error: savedPostsError } = await supabase
        .from('posts')
        .select('*')
        .in('id', savedPostIds)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (savedPostsError) throw savedPostsError;
      
      const uniqueUserIdsInSavedPosts = [...new Set((fetchedSavedPosts || []).map(post => post.user_id))];
      const userProfilesMap = new Map<string, UserProfile>();
      const userPetsMap = new Map<string, string>();

      await Promise.all(uniqueUserIdsInSavedPosts.map(async (userId) => {
        const profileData = await getUserProfile(userId);
        if (profileData) {
          userProfilesMap.set(userId, profileData);
        }
        const petsData = await getUserPets(userId);
        if (petsData && petsData.length > 0) {
          userPetsMap.set(userId, petsData.map(pet => pet.name).join(', '));
        }
      }));

      const savedPostsWithUserData = (fetchedSavedPosts || []).map(post => {
        const profile = userProfilesMap.get(post.user_id);
        const petsInfo = userPetsMap.get(post.user_id);

        return {
          ...post,
          is_saved: true,
          user: {
            name: profile?.username || (post.user_id === currentUser.id ? currentUser.email?.split('@')[0] || 'You' : 'Unknown User'),
            avatar: profile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2',
            pets: petsInfo || 'No pets',
          },
        };
      });

      setSavedPosts(savedPostsWithUserData);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsavePost = async (postId: string) => {
    if (!currentUser) {
      alert('Please log in to unsave posts.');
      return;
    }

    try {
      const success = await unsavePost(currentUser.id, postId);
      if (success) {
        // Remove from savedPosts state
        setSavedPosts(prevSavedPosts => prevSavedPosts.filter(post => post.id !== postId));
        // Update the original posts array if this post is also in it
        setPosts(prevPosts => 
          prevPosts.map(post =>
            post.id === postId ? { ...post, is_saved: false } : post
          )
        );
      } else {
        alert('Failed to unsave post. Please try again.');
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
      alert('An error occurred while unsaving the post.');
    }
  };

  const handleSave = async (postId: string) => {
    if (!currentUser) {
      alert('Please log in to save posts.');
      return;
    }

    const postToToggle = posts.find(p => p.id === postId) || savedPosts.find(p => p.id === postId);
    if (!postToToggle) return;

    try {
      if (postToToggle.is_saved) {
        // If currently saved, unsave it
        const success = await unsavePost(currentUser.id, postId);
        if (success) {
          setPosts(currentPosts =>
            currentPosts.map(post =>
              post.id === postId
                ? {
                    ...post,
                    is_saved: false,
                  }
                : post
            )
          );
          setSavedPosts(currentSavedPosts =>
            currentSavedPosts.filter(post => post.id !== postId)
          );
        } else {
          alert('Failed to unsave post. Please try again.');
        }
      } else {
        // If not saved, save it
        const success = await savePost(currentUser.id, postId);
        if (success) {
          setPosts(currentPosts =>
            currentPosts.map(post =>
              post.id === postId
                ? {
                    ...post,
                    is_saved: true,
                  }
                : post
            )
          );
          // No need to add to savedPosts here, fetchSavedPosts will handle it on tab switch/refresh
        } else {
          alert('Failed to save post. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
      alert('An error occurred while saving/unsaving the post.');
    }
  };

  const fetchCurrentUserData = async (targetUserId?: string) => {
    setLoading(true);
    try {
      let userToFetchId = targetUserId;
      if (!userToFetchId) {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          userToFetchId = user.id;
        } else {
          navigate('/');
          return;
        }
      }

      if (!userToFetchId) {
        setLoading(false);
        return;
      }

      const profileData = await getUserProfile(userToFetchId);
      if (profileData) {
        setProfile(profileData);
        // Fetch pets for the displayed profile
        const petsData = await getUserPets(userToFetchId);
        if (petsData) {
          setPets(petsData);
        }
      } else {
        setProfile(null);
      }

      // No longer fetching followers/following here, handled by fetchFollowData

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
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
    } else {
      await supabase
        .from('user_connections')
        .insert({
          requester_id: currentUser.id,
          requested_id: profile.user_id,
          status: 'accepted',
          connection_type: 'follow',
        });
      setIsFollowing(true);
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

  // Initial fetch of current user for isOwnProfile
  useEffect(() => {
    const fetchInitialCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchInitialCurrentUser();
  }, []);

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
    {
      id: 'saved',
      name: 'Saved',
      icon: Bookmark,
      count: savedPosts.length,
    },
    {
      id: 'tagged',
      name: 'Tagged',
      icon: Tag,
      count: 0,
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#111',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[4] }}>
            <Link 
              to="/home" 
              style={{
                color: '#9CA3AF',
                transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize['2xl'],
                fontWeight: designTokens.typography.fontWeight.bold,
                color: '#fff',
                fontFamily: designTokens.typography.fontFamily.display.join(', '),
              }}>
                {profile?.username || 'My Profile'}
              </h1>
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                color: '#9CA3AF',
              }}>
                @{profile?.username || (currentUser?.email ? currentUser.email.split('@')[0] : 'username')}
              </p>
              
              {/* Pets Display */}
              {pets.length > 0 && (
                <p style={{
                  margin: '0 0 16px 0',
                  fontSize: '14px',
                  color: '#E5E7EB',
                  lineHeight: '1.5',
                }}>
                  Pets: {pets.map(pet => pet.name).join(', ')}
                </p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[2] }}>
            <Button variant="ghost" size="sm">
              <Share size={20} />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: designTokens.spacing[6],
      }}>
        {/* Profile Header Section */}
        <Card style={{ marginBottom: designTokens.spacing[6], backgroundColor: '#111', border: '1px solid #333' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: designTokens.spacing[8],
            alignItems: 'start',
          }}>
            {/* Profile Picture */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '150px',
                height: '150px',
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
                    width: '142px',
                    height: '142px',
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
            <div style={{ flex: 1 }}>
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
                    fontSize: designTokens.typography.fontSize['3xl'],
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
                {isOwnProfile && (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    style={{ marginLeft: designTokens.spacing[6] }}
                    onClick={() => navigate('/edit-profile')}
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: designTokens.spacing[8],
                marginBottom: designTokens.spacing[4],
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                  }}>
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
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                  }}>
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
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                  }}>
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

              {/* Bio */}
              <div style={{ marginBottom: designTokens.spacing[4] }}>
                <p style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.base,
                  color: '#E5E7EB',
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  marginBottom: designTokens.spacing[2],
                }}>
                  {profile?.bio || 'Pet lover sharing amazing moments with my furry friends! 🐕🐱'}
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing[4],
                  fontSize: designTokens.typography.fontSize.sm,
                  color: '#9CA3AF',
                }}>
                  {profile?.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}>
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}>
                    <Calendar size={16} />
                    <span>Joined {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: designTokens.spacing[3],
              minWidth: '200px',
            }}>
              {isOwnProfile ? (
                <Button 
                  variant="primary" 
                  size="lg" 
                  style={{ width: '100%' }}
                  onClick={() => navigate('/edit-profile')}
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
                    {post.content_type === 'image' && (
                      <img
                        src={post.media_urls[0]}
                        alt="Post"
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Heart size={20} fill="currentColor" />
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

            {activeTab === 'saved' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {savedPosts.length > 0 ? (savedPosts.map((post) => (
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
                    {post.content_type === 'image' && (
                      <img
                        src={post.media_urls[0]}
                        alt="Post"
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
                    {/* Overlay for likes/comments and save button */}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Heart size={20} fill="currentColor" /> {post.likes_count}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave(post.id);
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: post.is_saved ? designTokens.colors.primary[500] : '#9CA3AF',
                          cursor: 'pointer',
                        }}
                      >
                        <Bookmark size={20} fill={post.is_saved ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                ))) : (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: '#111',
                    borderRadius: '16px',
                    border: '1px solid #333',
                  }}>
                    <Bookmark size={48} color="#9CA3AF" style={{ marginBottom: '20px' }} />
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#fff' }}>No saved posts yet</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#9CA3AF' }}>Save posts from your feed to view them here!</p>
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