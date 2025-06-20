import React, { useState, useEffect } from 'react'
import Post from '../components/feed/Post'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import NotificationPopup from '../components/ui/NotificationPopup'
import { SkeletonCard } from '../components/ui/Skeleton'
import { TrendingUp, Users, Calendar, MapPin, Star, Plus, Search, Mic, Heart, Bookmark, MoreHorizontal, UserPlus, X, Clock, Siren as Fire, Hash, Bell, Stethoscope, MessageCircle } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { clearAuthenticationState, getCurrentUser, getUserProfile, getUserPets, savePost, unsavePost, createPost } from '../utils/auth'
import { supabase } from '../utils/supabase'
import CommentModal from '../components/feed/CommentModal'

interface PostData {
  id: string
  user: {
    name: string
    avatar: string
    pets: string
    verified?: boolean
    user_id: string
  }
  content: {
    type: 'image' | 'video'
    url: string
    caption: string
    hashtags: string[]
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    liked: boolean
    saved?: boolean
  }
  timestamp: string
}

const mockPosts: PostData[] = [
  {
    id: '1',
    user: {
      name: 'Robert Fox',
      avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@alexsamdrovonzi',
      verified: true,
      user_id: '1',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'While Corfu give us the ability to shoot by the sea with amazing blue background full of light of the sky. Florina give us its gentle side. The humble atmosphere and Light of Florina which comes... read more',
      hashtags: ['#landscape', '#flora', '#nature'],
    },
    engagement: {
      likes: 1600,
      comments: 2300,
      shares: 23,
      liked: false,
      saved: false,
    },
    timestamp: '2h',
  },
  {
    id: '2',
    user: {
      name: 'Dianne Russell',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@amandadasilva',
      verified: false,
      user_id: '2',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Beautiful sunset over the mountains with amazing colors and peaceful atmosphere.',
      hashtags: ['#sunset', '#mountains', '#nature'],
    },
    engagement: {
      likes: 892,
      comments: 45,
      shares: 12,
      liked: true,
      saved: true,
    },
    timestamp: '4h',
  },
  {
    id: '3',
    user: {
      name: 'Jane Doe',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@janedoe_pets',
      verified: true,
      user_id: '3',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1741477/pexels-photo-1741477.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'My lovely cat enjoying the sun today! #catlife #sunnyday',
      hashtags: ['#catlife', '#sunnyday', '#petsofinstagram'],
    },
    engagement: {
      likes: 500,
      comments: 75,
      shares: 10,
      liked: false,
      saved: true,
    },
    timestamp: '1h',
  },
  {
    id: '4',
    user: {
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@john_pets',
      verified: false,
      user_id: '4',
    },
    content: {
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-dog-running-in-the-snow-1406-large.mp4',
      caption: 'Winter fun with my dog! He loves the snow. #dogsofinstagram #winterfun',
      hashtags: ['#dogsofinstagram', '#winterfun', '#playtime'],
    },
    engagement: {
      likes: 1200,
      comments: 150,
      shares: 20,
      liked: true,
      saved: false,
    },
    timestamp: '3h',
  },
  {
    id: '5',
    user: {
      name: 'Emily White',
      avatar: 'https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@emily_animals',
      verified: true,
      user_id: '5',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/3331505/pexels-photo-3331505.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Morning walk with my best friend! Such a beautiful day. #dogwalk #naturelover',
      hashtags: ['#dogwalk', '#naturelover', '#goldenretriever'],
    },
    engagement: {
      likes: 950,
      comments: 110,
      shares: 15,
      liked: false,
      saved: false,
    },
    timestamp: '6h',
  },
  {
    id: '6',
    user: {
      name: 'David Brown',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@david_wildlife',
      verified: false,
      user_id: '6',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1660721/pexels-photo-1660721.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Enjoying the serene view with my parrot. He loves to sit by the window. #parrotlife #birdwatching',
      hashtags: ['#parrotlife', '#birdwatching', '#exoticpets'],
    },
    engagement: {
      likes: 720,
      comments: 80,
      shares: 8,
      liked: true,
      saved: true,
    },
    timestamp: '8h',
  },
]

const stories = [
  { id: '1', name: 'Your story', avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', isAdd: true },
  { id: '2', name: 'Sarah', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '3', name: 'Mike', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '4', name: 'Emma', avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '5', name: 'David', avatar: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '6', name: 'Lisa', avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
]

const contacts = [
  { id: '1', name: 'Julie Mendez', location: 'Memphis, TN, US', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: true },
  { id: '2', name: 'Marian Montgomery', location: 'Newark, NJ, US', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: false },
  { id: '3', name: 'Joyce Reid', location: 'Fort Worth, TX, US', avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: true },
  { id: '4', name: 'Alice Franklin', location: 'Springfield, MA, US', avatar: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: false },
  { id: '5', name: 'Domingo Flores', location: 'Honolulu, HI, US', avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: true },
]

const requests = [
  { id: '1', name: 'Lauralee Quintero', action: 'wants to add you to friends', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '2', name: 'Brittni Landom', action: 'wants to add you to friends', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Pet Adoption Fair',
    date: 'Tomorrow',
    time: '10:00 AM',
    location: 'Central Park',
    attendees: 234,
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: '2',
    title: 'Dog Training Workshop',
    date: 'This Weekend',
    time: '2:00 PM',
    location: 'Community Center',
    attendees: 89,
    image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: '3',
    title: 'Cat Cafe Meetup',
    date: 'Next Monday',
    time: '6:00 PM',
    location: 'Whiskers Cafe',
    attendees: 156,
    image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  }
]

function EnhancedHome() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('Popular')
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const navigate = useNavigate()
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [votedPet, setVotedPet] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const animalOptions = [
    { id: '1', name: 'Cat', img: '/PetoGram/assets/images/pets/cat.png' },
    { id: '2', name: 'Dog', img: '/PetoGram/assets/images/pets/dog.png' },
  ];
  const [votes, setVotes] = useState<{ [key: string]: number }>({ '1': 0, '2': 0 });
  const [loadingVotes, setLoadingVotes] = useState(true);
  const [voteError, setVoteError] = useState<string | null>(null);
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  // Map animal id to string for DB
  const animalIdToName = { '1': 'cat', '2': 'dog' };
  const animalNameToId = { 'cat': '1', 'dog': '2' };

  // Fetch vote counts from Supabase
  const fetchVotesFromDB = async () => {
    setLoadingVotes(true);
    setVoteError(null);
    try {
      const { data, error } = await supabase
        .from('pet_votes')
        .select('animal');
      if (error) throw error;
      // Count votes for each animal
      const counts = { '1': 0, '2': 0 };
      (data || []).forEach(row => {
        if (row.animal === 'cat') counts['1']++;
        if (row.animal === 'dog') counts['2']++;
      });
      setVotes(counts);
    } catch (err) {
      setVoteError('Could not fetch votes.');
    } finally {
      setLoadingVotes(false);
    }
  };

  useEffect(() => {
    const fetchVotesAndUserVote = async () => {
      await fetchVotesFromDB();
      try {
        const user = await getCurrentUser();
        if (!user) return;
        const { data, error } = await supabase
          .from('pet_votes')
          .select('animal')
          .eq('user_id', user.id)
          .single();
        if (!error && data && data.animal) {
          setSelectedAnimal(animalNameToId[data.animal]);
        }
      } catch {}
    };
    fetchVotesAndUserVote();
  }, []);

  // Voting handler
  const handleVote = async (animalId: string) => {
    if (selectedAnimal) return;
    setVoteError(null);
    setLoadingVotes(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('Not logged in');
      // Upsert vote (one per user)
      const { error } = await supabase
        .from('pet_votes')
        .upsert({ user_id: user.id, animal: animalIdToName[animalId] }, { onConflict: 'user_id' });
      if (error) throw error;
      setSelectedAnimal(animalId);
      setShowConfetti(true);
      setShowThankYou(true);
      setTimeout(() => setShowConfetti(false), 1200);
      // Refresh votes
      await fetchVotesFromDB();
    } catch (err) {
      setVoteError('Could not submit vote.');
    } finally {
      setLoadingVotes(false);
    }
  };

  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  // New useEffect to initialize user data and fetch stats
  useEffect(() => {
    const initializeUserData = async () => {
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data) {
          setUserProfile(data)
          fetchUserStats(user.id) // Call fetchUserStats with user.id
        }
        fetchPosts(user.id) // Assuming fetchPosts needs userId now
      }
    }
    initializeUserData()
  }, []) // Run once on component mount

  // Set up polling to refresh posts every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchPosts()
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [])

  const fetchPosts = async (userId?: string) => {
    setLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;

      // Fetch profiles and pets for all unique user_ids in posts
      const userIds = [...new Set((postsData || []).map(post => post.user_id) || [])];
      const profilesMap = new Map();
      const petsMap = new Map();

      for (const userId of userIds) {
        const profile = await getUserProfile(userId);
        if (profile) {
          profilesMap.set(userId, profile);
        }
        const pets = await getUserPets(userId);
        if (pets && pets.length > 0) {
          petsMap.set(userId, pets.map(pet => pet.name).join(', ')); // Join pet names
        }
      }

      // Transform the data to match PostData interface
      const transformedPosts = (postsData || []).map(post => {
        const userProfile = profilesMap.get(post.user_id);
        const userPets = petsMap.get(post.user_id);

        return {
          id: post.id,
          user_id: post.user_id,
          user: {
            name: userProfile?.username || userProfile?.email?.split('@')[0] || 'Unknown User',
            avatar: userProfile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2',
            pets: userPets || 'No pets',
            user_id: post.user_id,
          },
          content: {
            type: post.content_type || 'image',
            url: post.media_urls?.[0] || '',
            caption: post.caption || '',
            hashtags: post.hashtags || [],
          },
          engagement: {
            likes: post.likes_count || 0,
            comments: post.comments_count || 0,
            shares: post.shares_count || 0,
            liked: post.liked || false,
          },
          timestamp: post.created_at,
        };
      });
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a refresh function that can be called manually
  const refreshPosts = () => {
    fetchPosts()
  }

  const fetchUserStats = async (userId) => {
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
      const { count: posts } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_active', true);

      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
      setPostsCount(posts || 0);
      setPosts(currentPosts => currentPosts.map(post => ({
        ...post,
        user_id: userId
      })));
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setFollowersCount(0);
      setFollowingCount(0);
      setPostsCount(0);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      alert('Please log in to like posts.');
      return;
    }

    const postToLike = posts.find(p => p.id === postId);
    if (!postToLike) return;

    try {
      if (postToLike.engagement.liked) {
        // If currently liked, unlike it
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id);

        if (error) throw error;

        // Decrement likes_count in posts table
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: postToLike.engagement.likes - 1 })
          .eq('id', postId);

        if (updateError) throw updateError;

        setPosts(currentPosts =>
          currentPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    liked: false,
                    likes: post.engagement.likes - 1,
                  },
                }
              : post
          )
        );
      } else {
        // If not liked, like it
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: currentUser.id,
          });

        if (error) throw error;

        // Increment likes_count in posts table
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: postToLike.engagement.likes + 1 })
          .eq('id', postId);

        if (updateError) throw updateError;

        setPosts(currentPosts =>
          currentPosts.map(post =>
            post.id === postId
              ? {
                  ...post,
                  engagement: {
                    ...post.engagement,
                    liked: true,
                    likes: post.engagement.likes + 1,
                  },
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      alert('An error occurred while liking/unliking the post. Please try again.');
    }
  };

  const handleLogout = () => {
    clearAuthenticationState()
    navigate('/')
  }

  const handleAcceptRequest = async (requestId: string) => {
    // Handle friend request acceptance
    console.log('Accepting request:', requestId)
  }

  const handleDeclineRequest = async (requestId: string) => {
    // Handle friend request decline
    console.log('Declining request:', requestId)
  }

  const handleCreatePost = async (newPostData) => {
    // ... your logic to create a post
    await createPost(newPostData);
    fetchPosts(); // <-- This will update the posts array and the count
  };

  const handleFollowToggle = async () => {
    if (!currentUser || !userProfile.user_id) return;
    if (isFollowing) {
      await supabase
        .from('user_connections')
        .delete()
        .eq('requester_id', currentUser.id)
        .eq('requested_id', userProfile.user_id)
        .eq('connection_type', 'follow');
      setIsFollowing(false);
      await fetchUserStats(userProfile.user_id);
    } else {
      await supabase
        .from('user_connections')
        .upsert({
          requester_id: currentUser.id,
          requested_id: userProfile.user_id,
          status: 'accepted',
          connection_type: 'follow',
        });
      setIsFollowing(true);
      await fetchUserStats(userProfile.user_id);
    }
  };

  return (
    <>
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#2A2D3A',
        color: '#FFFFFF',
        fontFamily: designTokens.typography.fontFamily.sans.join(', '),
      }}>
        {/* Mobile Overlay */}
        {/* {isMobile && isSidebarOpen && (
          <div
            className="mobile-overlay active"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )} */}

        {/* Left Sidebar */}
        <div style={{
          width: isMobile ? '280px' : '280px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: designTokens.zIndex.modal,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
          backgroundColor: '#2A2D3A',
          borderRight: '1px solid #3A3D4A',
          padding: '24px',
          overflowY: 'auto',
        }}>
          {/* Profile Section */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <img 
                src={userProfile?.profile_picture || "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2"}
                alt={userProfile?.username || "User"}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #4F46E5',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '20px',
                height: '20px',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                border: '3px solid #2A2D3A',
              }} />
            </div>
            <h3 style={{
              margin: '0 0 4px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#FFFFFF',
            }}>
              {userProfile?.username || 'User'}
            </h3>
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: '#9CA3AF',
            }}>
              {userProfile?.location || 'Location'}
            </p>
            
            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              padding: '16px 0',
              borderTop: '1px dotted #4B5563',
              borderBottom: '1px dotted #4B5563',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{(postsCount || 0).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Posts</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{(followersCount || 0).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Followers</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{(followingCount || 0).toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Following</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ marginBottom: '4px' }}>
            {[ 
              { icon: <Calendar size={20} />, label: 'Events', path: '/events-page' },
              { icon: <Stethoscope size={20} />, label: 'Appointment', path: '/appointment-page' },
              { icon: '⚙️', label: 'Settings', path: '/settings-page' },
            ].map((item, index) => (
              <Link 
                to={item.path}
                key={index} 
                style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: item.active ? '#4F46E5' : 'transparent',
                color: item.active ? '#FFFFFF' : '#9CA3AF',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = '#3A3D4A'
                  e.currentTarget.style.color = '#FFFFFF'
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              color: '#EF4444',
              fontWeight: '600',
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#18181b',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#27272a'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#18181b'}
          >
            🚪 Log Out
          </button>
          <div style={{
            marginTop: '12px',
            fontSize: '12px',
            color: '#6B7280',
            lineHeight: '1.5',
          }}>
            <div style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '12px' }}>About</a>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Help Center</a>
            </div>
            <div>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy and Terms</a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          marginLeft: isMobile ? 0 : '280px',
          marginRight: isMobile ? 0 : '320px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <header style={{
            padding: '16px 24px',
            borderBottom: '1px solid #3A3D4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#2A2D3A',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}>
            {/* Left: Search Bar */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{
                position: 'relative',
                flex: 1,
                maxWidth: '250px',
              }}>
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
                  placeholder="Search..."
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 38px',
                    backgroundColor: '#18181b',
                    border: '1px solid #4B5563',
                    borderRadius: '24px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <Mic 
                  size={16} 
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>
            {/* Center: Logo */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <span style={{
                fontFamily: 'Comic Sans MS, Comic Sans, cursive',
                fontSize: '2.2rem',
                fontWeight: 400,
                color: '#fff',
                letterSpacing: '1px',
                userSelect: 'none',
              }}>
                PetoGram
              </span>
            </div>
            {/* Right: Create Post Button */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => navigate('/create-post')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 24px',
                  backgroundColor: '#6366F1',
                  border: 'none',
                  borderRadius: '24px',
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.12)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366F1'}
              >
                <Plus size={20} />
                Create new post
              </button>
            </div>
          </header>

          {/* Content */}
          <div style={{
            padding: '24px',
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%',
          }}>
            {/* Feeds Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {posts.map((post) => (
                <div key={post.id} style={{
                  backgroundColor: '#374151',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #4B5563',
                }}>
                  {/* Post Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Link to={`/user-profile/${post.user_id}`}>
                        <img 
                          src={post.user.avatar}
                          alt={post.user.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      </Link>
                      <div>
                        <Link to={`/user-profile/${post.user_id}`}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#FFFFFF',
                          }}>
                            {post.user.name}
                          </div>
                        </Link>
                        <div style={{
                          fontSize: '12px',
                          color: '#9CA3AF',
                        }}>
                          {post.user.pets}
                        </div>
                      </div>
                    </div>
                    <button style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                    }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Post Media */}
                  <div style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}>
                    {post.content.type === 'video' ? (
                      <video 
                        src={post.content.url}
                        controls
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <img 
                        src={post.content.url}
                        alt="Post content"
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>

                  {/* Post Content */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      color: '#E5E7EB',
                      lineHeight: '1.5',
                    }}>
                      {post.content.caption}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {post.content.hashtags.map((tag, index) => (
                        <span key={index} style={{
                          fontSize: '14px',
                          color: '#6366F1',
                          cursor: 'pointer',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #4B5563',
                  }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <button
                        onClick={() => handleLike(post.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: post.engagement.liked ? '#EF4444' : '#9CA3AF',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        <Heart size={18} fill={post.engagement.liked ? 'currentColor' : 'none'} />
                        {post.engagement.likes.toLocaleString()}
                      </button>
                      <button
                        onClick={() => {
                          setShowCommentModal(true);
                          setSelectedPostId(post.id);
                        }}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <MessageCircle size={24} />
                        <span className="font-medium">{post.engagement.comments}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        {!isMobile && (
          <div style={{
            width: '320px',
            height: '100vh',
            position: 'fixed',
            top: 0,
            right: 0,
            backgroundColor: '#1E1E2D',
            borderLeft: '1px solid #374151',
            padding: '24px',
            overflowY: 'auto',
          }}>
            {/* Requests */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                justifyContent: 'flex-end',
                marginBottom: '16px',
              }}>
                {/* Message Button */}
                <button
                  onClick={() => navigate('/chat')}
                  style={{
                    background: '#6366F1',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.18)',
                    position: 'relative',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  title="Messages"
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#4F46E5';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.28)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#6366F1';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.18)';
                  }}
                >
                  {/* Message Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </button>
                {/* Notification Button */}
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: '#9CA3AF', 
                    padding: 0,
                    position: 'relative',
                    transition: 'color 0.2s ease',
                  }} 
                  title="Notifications"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                  <Bell size={22} />
                  {/* Notification badge */}
                  <div style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#EF4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: '#fff',
                    fontWeight: '600',
                  }}>
                    3
                  </div>
                </button>
              </div>
            </div>
            {/* Pet Poll Card */}
            <div style={{
              margin: '0 auto 32px auto',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e0e7ff 100%)',
              borderRadius: '22px',
              boxShadow: '0 4px 32px 0 rgba(99,102,241,0.13)',
              padding: '32px 6vw',
              maxWidth: 420,
              minWidth: 0,
              color: '#23233a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
            }}>
              {/* Confetti burst */}
              {showConfetti && (
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0, top: 0, height: 0, zIndex: 10,
                  pointerEvents: 'none',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                  {[...Array(18)].map((_, i) => (
                    <span key={i} style={{
                      display: 'inline-block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: ['#6366F1','#F59E0B','#10B981','#F472B6','#F87171','#A78BFA','#FBBF24','#34D399'][i%8],
                      position: 'absolute',
                      left: `${50 + 30*Math.cos((i/18)*2*Math.PI)}%`,
                      top: `${-10 + 30*Math.sin((i/18)*2*Math.PI)}px`,
                      opacity: 0.8,
                      transform: `scale(${0.8 + 0.4*Math.random()})`,
                      animation: 'confetti-burst 1.1s cubic-bezier(.62,.28,.23,.99)',
                      animationDelay: `${i*0.03}s`,
                    }} />
                  ))}
                  <style>{`
                    @keyframes confetti-burst {
                      0% { opacity: 0; transform: scale(0.5) translateY(0); }
                      60% { opacity: 1; }
                      100% { opacity: 0; transform: scale(1.2) translateY(60px); }
                    }
                  `}</style>
                </div>
              )}
              <h3 style={{
                margin: 0,
                marginBottom: 10,
                fontSize: 24,
                fontWeight: 800,
                color: '#4F46E5',
                letterSpacing: 0.2,
                textAlign: 'center',
              }}>
                Vote for the Most Lovely Pet
              </h3>
              {loadingVotes && <div style={{ color: '#6366F1', fontWeight: 500, marginBottom: 12 }}>Loading votes...</div>}
              {voteError && <div style={{ color: '#EF4444', fontWeight: 500, marginBottom: 12 }}>{voteError}</div>}
              {animalOptions.map((animal) => {
                const count = votes[animal.id] || 0;
                const isSelected = selectedAnimal === animal.id;
                return (
                  <div
                    key={animal.id}
                    title={`Vote for ${animal.name}`}
                    style={{
                      background: isSelected ? '#f5f3ff' : '#f9fafb',
                      border: isSelected ? '3px solid #6366F1' : '2px solid #e5e7eb',
                      boxShadow: isSelected ? '0 4px 16px rgba(99,102,241,0.13)' : 'none',
                      borderRadius: 18,
                      padding: '20px 24px',
                      marginBottom: 20,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: selectedAnimal ? 'default' : 'pointer',
                      transition: 'border 0.2s, background 0.2s, box-shadow 0.2s, transform 0.18s',
                      position: 'relative',
                      minWidth: 240,
                      outline: isSelected ? '2px solid #a5b4fc' : 'none',
                      transform: selectedAnimal ? 'none' : 'scale(1)',
                    }}
                    onClick={() => handleVote(animal.id)}
                    onMouseEnter={e => {
                      if (!isSelected && !selectedAnimal) e.currentTarget.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={e => {
                      if (!isSelected && !selectedAnimal) e.currentTarget.style.transform = 'scale(1)';
                    }}
                    tabIndex={0}
                    aria-label={`Vote for ${animal.name}`}
                  >
                    {/* Custom radio with animated checkmark */}
                    <span style={{
                      display: 'inline-block',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      border: isSelected ? '7px solid #6366F1' : '2px solid #a5b4fc',
                      background: isSelected ? '#ede9fe' : '#fff',
                      marginRight: 18,
                      boxSizing: 'border-box',
                      transition: 'border 0.2s, background 0.2s',
                      position: 'relative',
                    }}>
                      {isSelected && (
                        <svg width="18" height="18" viewBox="0 0 18 18" style={{ position: 'absolute', left: 7, top: 7, opacity: 1, transition: 'opacity 0.2s' }}>
                          <polyline points="2,10 7,15 16,4" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <img src={animal.img} alt={animal.name} style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', marginRight: 18, background: '#fff', border: '2px solid #e0e7ff' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 22, color: '#23233a', marginBottom: 6 }}>{animal.name}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 20, color: isSelected ? '#6366F1' : '#23233a', marginLeft: 18, minWidth: 48, textAlign: 'right' }}>{count} vote{count === 1 ? '' : 's'}</div>
                  </div>
                );
              })}
              {showThankYou && (
                <div style={{
                  marginTop: 10,
                  color: '#10B981',
                  fontWeight: 700,
                  fontSize: 18,
                  textAlign: 'center',
                  letterSpacing: 0.2,
                  animation: 'fadein 0.7s',
                }}>
                  Thank you for voting!
                  <style>{`@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }`}</style>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Popup */}
      <NotificationPopup 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {showCommentModal && selectedPostId && (
        <CommentModal
          postId={selectedPostId}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedPostId(null);
            fetchPosts(); // Refresh posts to update comment counts
          }}
          currentUser={currentUser}
          userProfile={userProfile}
          onCommentPosted={(postId, newCommentCount) => {
            console.log(`Comment posted for post ${postId}. New count: ${newCommentCount}`);
            setPosts(currentPosts =>
              currentPosts.map(post =>
                post.id === postId
                  ? { ...post, engagement: { ...post.engagement, comments: newCommentCount } }
                  : post
              )
            );
          }}
        />
      )}
    </>
  )
}

export default EnhancedHome;