import React, { useState, useEffect } from 'react'
import Post from '../components/feed/Post'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { TrendingUp, Users, Calendar, MapPin, Star, Plus, Mic, Bookmark, UserPlus, X, Clock, Siren as Fire, Hash, Stethoscope, MessageCircle, ExternalLink, ImageOff, MoreVertical } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { getCurrentUser, getUserProfile, getUserPets, createPost } from '../utils/auth'
import { supabase } from '../utils/supabase'
import CommentModal from '../components/feed/CommentModal'
import { motion, useReducedMotion } from 'framer-motion'
import Modal from '../components/ui/Modal'
import { SocialMediaCard } from '../components/SocialMediaCard'

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing?: boolean;
}

interface PostData {
  id: string
  user_id: string
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
    saved?: boolean
  }
  timestamp: string
}

const mockPosts: PostData[] = [
  {
    id: '1',
    user_id: '1',
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
      saved: false,
    },
    timestamp: '2h',
  },
  {
    id: '2',
    user_id: '2',
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
      saved: true,
    },
    timestamp: '4h',
  },
  {
    id: '3',
    user_id: '3',
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
      saved: true,
    },
    timestamp: '1h',
  },
  {
    id: '4',
    user_id: '4',
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
      saved: false,
    },
    timestamp: '3h',
  },
  {
    id: '5',
    user_id: '5',
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
      saved: false,
    },
    timestamp: '6h',
  },
  {
    id: '6',
    user_id: '6',
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
    image: '/images/pets/dog.png'
  },
  {
    id: '2',
    title: 'Dog Training Workshop',
    date: 'This Weekend',
    time: '2:00 PM',
    location: 'Community Center',
    attendees: 89,
    image: '/images/pets/cat.png'
  },
  {
    id: '3',
    title: 'Cat Cafe Meetup',
    date: 'Next Monday',
    time: '6:00 PM',
    location: 'Whiskers Cafe',
    attendees: 156,
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop'
  }
]

// New EventCard component using inline styles and framer-motion
const EventCard = ({
  title = "React & AI Workshop",
  date = new Date(Date.now() + 7 * 24 * 3600 * 1000),
  location = "Tech Hub, San Francisco",
  className,
  onClick,
}: {
  title?: string;
  date?: Date;
  location?: string;
  className?: React.CSSProperties;
  onClick?: () => void;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30, staggerChildren: 0.1 },
    },
  };
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12,
        border: '1px solid #23232a', background: '#23232a', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', marginBottom: 8,
        ...className,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <motion.div variants={childVariants} style={{ marginBottom: 6 }}>
          <h3 style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2, color: '#fff' }}>{title}</h3>
        </motion.div>
        <motion.div variants={childVariants} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9ca3af' }}>
            <Calendar size={14} style={{ marginRight: 0 }} />
            <span>{date.toLocaleDateString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9ca3af' }}>
            <MapPin size={14} style={{ marginRight: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Demo card using upcomingEvents data
const UpcomingEventsCard = () => {
  const events = upcomingEvents.slice(0, 2);
  const fallbackDates = [
    new Date('2025-06-28'),
    new Date('2025-06-24'),
  ];
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', background: '#18181b', border: '1px solid #23232a', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)', marginTop: 8, marginBottom: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Upcoming Events</h2>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Discover exciting events</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {events.map((event, idx) => {
          let eventDate = new Date(event.date + ' ' + (event.time || ''));
          if (isNaN(eventDate.getTime())) {
            eventDate = fallbackDates[idx] || new Date();
          }
          return (
            <EventCard
              key={event.id}
              title={event.title}
              date={eventDate}
              location={event.location}
              onClick={() => navigate('/events-page')}
            />
          );
        })}
      </div>
      <div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          style={{ width: '100%', padding: '10px 0', background: '#6366F1', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', transition: 'background 0.2s' }}
          onClick={() => navigate('/events-page')}
        >
          Explore More Events
          <ExternalLink size={14} />
        </motion.button>
      </div>
    </div>
  );
};

function EnhancedHome() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('Popular')
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
  const [showSocialCard, setShowSocialCard] = useState(false);
  const [socialCardTab, setSocialCardTab] = useState<'following' | 'followers'>('following');
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [socialCardLoading, setSocialCardLoading] = useState(false);

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
          .limit(1);
        
        if (!error && data && data.length > 0 && data[0].animal) {
          setSelectedAnimal(animalNameToId[data[0].animal]);
        }
      } catch (err) {
        console.error("Error fetching user's vote:", err);
      }
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
        fetchPosts(user) // Assuming fetchPosts needs userId now
      }
    }
    initializeUserData()
  }, []) // Run once on component mount

  // Set up polling to refresh posts every 5 seconds
  useEffect(() => {
    if (!currentUser) return; // Don't start polling until user is loaded
    const pollInterval = setInterval(() => {
      fetchPosts(currentUser)
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [currentUser]) // Depend on currentUser to start polling

  const fetchPosts = async (user?: any) => {
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

  const fetchFollowers = async (userId: string) => {
    // Get IDs of people the current user is following to check for "following back" status
    const { data: followingConnections } = await supabase
      .from('user_connections')
      .select('requested_id')
      .eq('requester_id', userId)
      .eq('status', 'accepted')
      .eq('connection_type', 'follow');

    const followingIds = new Set((followingConnections || []).map(c => c.requested_id));

    // 1. Get IDs of users who are following the current user
    const { data: followerConnections, error: followersError } = await supabase
      .from('user_connections')
      .select('requester_id')
      .eq('requested_id', userId)
      .eq('status', 'accepted')
      .eq('connection_type', 'follow');

    if (followersError) {
      console.error("Error fetching follower connections:", followersError);
      return [];
    }

    if (!followerConnections || followerConnections.length === 0) {
      return [];
    }
    
    const followerIds = followerConnections.map(c => c.requester_id);

    // 2. Get profiles for those follower ids
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, username, profile_picture')
      .in('user_id', followerIds);
    
    if (profilesError) {
      console.error("Error fetching follower profiles:", profilesError);
      return [];
    }

    return (profiles || []).map(profile => ({
      id: profile.user_id,
      name: profile.username,
      username: profile.username,
      avatar: profile.profile_picture || 'https://i.pravatar.cc/150',
      isFollowing: followingIds.has(profile.user_id),
    })) as User[];
  };

  const fetchFollowing = async (userId: string) => {
    // 1. Get the user_ids of people the user is following
    const { data: connections, error: connectionsError } = await supabase
      .from('user_connections')
      .select('requested_id')
      .eq('requester_id', userId)
      .eq('status', 'accepted')
      .eq('connection_type', 'follow');

    if (connectionsError) {
      console.error("Error fetching following connections:", connectionsError);
      return [];
    }

    if (!connections || connections.length === 0) {
      return [];
    }

    const followingIds = connections.map(c => c.requested_id);

    // 2. Get the profiles for those user_ids
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, username, profile_picture')
      .in('user_id', followingIds);

    if (profilesError) {
      console.error("Error fetching following profiles:", profilesError);
      return [];
    }

    return (profiles || []).map(profile => ({
      id: profile.user_id,
      name: profile.username,
      username: profile.username,
      avatar: profile.profile_picture || 'https://i.pravatar.cc/150',
      isFollowing: true,
    })) as User[];
  };
  
  const handleOpenSocialModal = async (initialTab: 'followers' | 'following') => {
    if (!currentUser) return;
    setSocialCardTab(initialTab);
    setShowSocialCard(true);
    setSocialCardLoading(true);
    try {
      const [followers, following] = await Promise.all([
        fetchFollowers(currentUser.id),
        fetchFollowing(currentUser.id)
      ]);
      setFollowersList(followers);
      setFollowingList(following);
    } catch (error) {
      console.error("Error fetching social lists:", error);
      setFollowersList([]);
      setFollowingList([]);
    } finally {
      setSocialCardLoading(false);
    }
  };
  
  const handleFollow = async (userIdToFollow: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from('user_connections').insert({
      requester_id: currentUser.id,
      requested_id: userIdToFollow,
      status: 'accepted',
      connection_type: 'follow',
    });
    if (!error) {
      setSocialCardLoading(true);
      const [followers, following] = await Promise.all([
        fetchFollowers(currentUser.id),
        fetchFollowing(currentUser.id)
      ]);
      setFollowersList(followers);
      setFollowingList(following);
      setSocialCardLoading(false);
    }
  };

  const handleUnfollow = async (userIdToUnfollow: string) => {
    if (!currentUser) return;
    const { error } = await supabase.from('user_connections').delete()
      .eq('requester_id', currentUser.id)
      .eq('requested_id', userIdToUnfollow)
      .eq('connection_type', 'follow');
    if (!error) {
      setSocialCardLoading(true);
      const [followers, following] = await Promise.all([
        fetchFollowers(currentUser.id),
        fetchFollowing(currentUser.id)
      ]);
      setFollowersList(followers);
      setFollowingList(following);
      setSocialCardLoading(false);
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
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div>
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
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{(postsCount || 0).toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Posts</div>
                </div>
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleOpenSocialModal('followers')}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{(followersCount || 0).toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => handleOpenSocialModal('following')}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>{(followingCount || 0).toLocaleString()}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Following</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/create-post')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                marginBottom: '24px',
                backgroundColor: '#6366F1',
                border: 'none',
                borderRadius: '12px',
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

            {/* Navigation */}
            <nav style={{ marginBottom: '4px' }}>
              {[ 
                { icon: <Calendar size={20} />, label: 'Events', path: '/events-page' },
                { icon: <Stethoscope size={20} />, label: 'Appointment', path: '/appointment-page' },
                { icon: '⚙️', label: 'Settings', path: '/settings' },
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
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3A3D4A'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#9CA3AF'
                }}>
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div style={{
            marginTop: 'auto',
            paddingTop: '24px',
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
            </div>
          </header>

          {/* Content */}
          <div style={{
            padding: '0 24px 24px',
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%',
          }}>
            {/* Feeds Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '24px' }}>
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
            padding: '24px',
            overflowY: 'auto',
          }}>
            {/* Requests */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                justifyContent: 'center',
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
              </div>
            </div>
            {/* Upcoming Events Card */}
            <UpcomingEventsCard />
          </div>
        )}
      </div>

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
      <Modal isOpen={showSocialCard} onClose={() => setShowSocialCard(false)} bare>
        <SocialMediaCard
          initialTab={socialCardTab}
          followersList={followersList}
          followingList={followingList}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          loading={socialCardLoading}
        />
      </Modal>
    </>
  )
}

export default EnhancedHome;