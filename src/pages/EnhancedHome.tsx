import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Plus, Stethoscope, MessageCircle, ExternalLink, Settings, Cat, Dog, Check, AlertCircle, Loader2 } from 'lucide-react'
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
  const shouldReduceMotion = useReducedMotion()

  const cardVariants = {
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
      variants={cardVariants}
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

// PollCard component (plain React + lucide-react icons)
const PollCard = ({
  title = "What's your favorite pet?",
  options = [
    { id: 'cat', label: 'Cat', icon: <Cat size={20} />, votes: 342 },
    { id: 'dog', label: 'Dog', icon: <Dog size={20} />, votes: 458 }
  ],
  totalVotes = 800,
  hasVoted = false,
  isLoading = false,
  error = '',
  onVote = () => {},
  className = ''
}: {
  title?: string;
  options?: { id: string; label: string; icon: React.ReactNode; votes: number }[];
  totalVotes?: number;
  hasVoted?: boolean;
  isLoading?: boolean;
  error?: string;
  onVote?: (optionId: string) => void;
  className?: string;
}) => {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [animatedVotes, setAnimatedVotes] = React.useState({});
  const [showResults, setShowResults] = React.useState(hasVoted);
  const [loading, setLoading] = React.useState(false);
  const [pollError, setPollError] = React.useState('');

  // Fetch user's vote on mount
  React.useEffect(() => {
    const fetchUserVote = async () => {
      setLoading(true);
      setPollError('');
      try {
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          const { data, error } = await supabase
            .from('pet_votes')
            .select('animal')
            .eq('user_id', user.data.user.id)
            .single();
          if (data && data.animal) {
            setSelectedOption(data.animal);
            setShowResults(true);
          }
        }
      } catch (err) {
        setPollError('Could not fetch your vote.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserVote();
  }, []);

  React.useEffect(() => {
    const initialVotes = {};
    options.forEach(option => {
      initialVotes[option.id] = showResults ? option.votes : 0;
    });
    setAnimatedVotes(initialVotes);
    if (showResults) {
      const timer = setTimeout(() => {
        const finalVotes = {};
        options.forEach(option => {
          finalVotes[option.id] = option.votes;
        });
        setAnimatedVotes(finalVotes);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [options, showResults]);

  const handleVote = async (optionId) => {
    if (selectedOption || loading) return;
    setSelectedOption(optionId);
    setShowResults(true);
    setLoading(true);
    setPollError('');
    try {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        await supabase
          .from('pet_votes')
          .upsert({ user_id: user.data.user.id, animal: optionId }, { onConflict: 'user_id' });
      }
    } catch (err) {
      setPollError('Could not submit your vote.');
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      const updatedVotes = {};
      options.forEach(option => {
        updatedVotes[option.id] = option.id === optionId ? option.votes + 1 : option.votes;
      });
      setAnimatedVotes(updatedVotes);
    }, 300);
    onVote(optionId);
  };

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const handleKeyDown = (event, optionId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleVote(optionId);
    }
  };

  const catPercent = totalVotes === 0 ? 0 : Math.round((animatedVotes['cat'] / totalVotes) * 100);
  const dogPercent = totalVotes === 0 ? 0 : Math.round((animatedVotes['dog'] / totalVotes) * 100);

  return (
    <div style={{ width: 260, height: 220, margin: '24px auto 0', padding: 12, background: '#23232a', border: '1px solid #333', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', borderRadius: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>{title}</h3>
          {showResults && (
            <span style={{ fontSize: 12, color: '#a3a3a3', background: '#333', borderRadius: 8, padding: '2px 8px', marginTop: 4, display: 'inline-block' }}>{totalVotes.toLocaleString()} total votes</span>
          )}
        </div>
        {/* Error Message */}
        {error && (
          <div style={{ color: '#ef4444', background: '#2d1a1a', border: '1px solid #ef4444', borderRadius: 8, padding: 8, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={16} style={{ marginRight: 6 }} />
            <span>{error}</span>
          </div>
        )}
        {/* Poll Options */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
          {options.map((option) => {
            const votesArray = Object.values(animatedVotes) as number[];
            const percentage = getPercentage(Number(animatedVotes[option.id] || 0));
            const isSelected = selectedOption === option.id;
            const isWinning = showResults && Number(animatedVotes[option.id] || 0) === Math.max(...(votesArray.length > 0 ? votesArray : [0]));
            return (
              <div key={option.id} style={{ position: 'relative', marginBottom: 4 }}>
                {!showResults ? (
                  <button
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      border: '1px solid #444',
                      borderRadius: 8,
                      background: isSelected ? '#6366F1' : '#18181b',
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 500,
                      cursor: hasVoted || isLoading ? 'not-allowed' : 'pointer',
                      opacity: hasVoted || isLoading ? 0.5 : 1,
                      transition: 'background 0.2s',
                    }}
                    onClick={() => handleVote(option.id)}
                    onKeyDown={(e) => handleKeyDown(e, option.id)}
                    disabled={hasVoted || isLoading}
                    aria-label={`Vote for ${option.label}`}
                  >
                    {isLoading && isSelected ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <span style={{ width: 20, height: 20 }}>{option.icon}</span>
                    )}
                    <span>{option.label}</span>
                  </button>
                ) : (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: isWinning ? '2px solid #6366F1' : '1px solid #444',
                      background: isWinning ? 'rgba(99,102,241,0.08)' : '#18181b',
                      marginBottom: 2,
                      zIndex: 1,
                    }}
                  >
                    {/* Background Progress */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 8,
                      overflow: 'hidden',
                      zIndex: 0,
                    }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: isWinning ? 'rgba(99,102,241,0.15)' : '#23232a',
                          transition: 'width 1s',
                        }}
                      />
                    </div>
                    {/* Content */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isSelected && <Check size={14} color="#6366F1" />}
                        <span style={{ width: 20, height: 20 }}>{option.icon}</span>
                        <span style={{ fontWeight: 500 }}>{option.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: '#fff',
                          marginRight: 4,
                          letterSpacing: 0.5,
                          minWidth: 36,
                          textAlign: 'right',
                          textShadow: '0 1px 4px #000',
                        }}>{Number(animatedVotes[option.id] || 0).toLocaleString()}</span>
                        <span style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: isWinning ? '#6366F1' : '#a3a3a3',
                          minWidth: 40,
                          textAlign: 'center',
                          textShadow: isWinning ? '0 1px 8px #6366F1' : '0 1px 4px #000',
                          letterSpacing: 1,
                        }}>{percentage}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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

  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

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
      await supabase
        .from('pet_votes')
        .upsert({ user_id: user.id, animal: animalIdToName[animalId] }, { onConflict: 'user_id' });
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
      setLoading(true);
      const user = await getCurrentUser()
      if (user) {
        setCurrentUser(user)
        
        await Promise.all([
          (async () => {
            const { data } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
            if (data) setUserProfile(data);
          })(),
          fetchUserStats(user.id),
          fetchPosts(0, true)
        ])
      }
      setLoading(false);
    }
    initializeUserData()
  }, []) // Run once on component mount

  // Set up a real-time subscription to refresh posts
  useEffect(() => {
    if (!currentUser) return; // Don't subscribe until user is loaded

    const handleNewPost = async (payload: any) => {
      console.log('New post received!', payload);
      const newPost = payload.new;
      
      const [userProfile, userPetsData] = await Promise.all([
        getUserProfile(newPost.user_id),
        getUserPets(newPost.user_id)
      ]);

      const userName = userProfile?.username || (userProfile as any)?.email?.split('@')[0] || 'Unknown User';
      const pets = userPetsData && userPetsData.length > 0 ? userPetsData.map(pet => pet.name).join(', ') : 'No pets';

      const transformedPost: PostData = {
        id: newPost.id,
        user_id: newPost.user_id,
        user: {
          name: userName,
          avatar: userProfile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`,
          pets: pets,
          user_id: newPost.user_id,
        },
        content: {
          type: newPost.content_type || 'image',
          url: newPost.media_urls?.[0] || '',
          caption: newPost.caption || '',
          hashtags: newPost.hashtags || [],
        },
        engagement: {
          likes: newPost.likes_count || 0,
          comments: newPost.comments_count || 0,
          shares: newPost.shares_count || 0,
        },
        timestamp: newPost.created_at,
      };

      setPosts(currentPosts => [transformedPost, ...currentPosts]);
    };

    const channel = supabase
      .channel('posts-feed-subscription')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, handleNewPost)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser])

  const POSTS_PER_PAGE = 5;

  const fetchPosts = async (page = 0, initialLoad = false) => {
    if (loading && !initialLoad) return;
    setLoading(true);
    try {
      const from = page * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (postsError) throw postsError;
      
      if (!postsData || postsData.length === 0) {
        if (initialLoad) setPosts([]);
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const userIds = [...new Set(postsData.map(post => post.user_id).filter(id => id))];
      
      if (userIds.length === 0) {
        if (initialLoad) setPosts([]);
        setLoading(false);
        return;
      }
      
      const [profilesResult, petsResult] = await Promise.all([
        supabase.from('user_profiles').select('*').in('user_id', userIds),
        supabase.from('user_pets').select('*').in('user_id', userIds)
      ]);

      const { data: profilesData, error: profilesError } = profilesResult;
      const { data: petsData, error: petsError } = petsResult;

      if (profilesError) throw profilesError;
      if (petsError) throw petsError;
      
      const profilesMap = new Map((profilesData || []).map(p => [p.user_id, p]));
      const petsMap = new Map();
      (petsData || []).forEach(pet => {
        if (!petsMap.has(pet.user_id)) {
          petsMap.set(pet.user_id, []);
        }
        petsMap.get(pet.user_id).push(pet.name);
      });

      // Transform the data to match PostData interface
      const transformedPosts = postsData.map(post => {
        const userProfile = profilesMap.get(post.user_id);
        const userPets = petsMap.has(post.user_id) ? petsMap.get(post.user_id).join(', ') : 'No pets';
        const userName = userProfile?.username || (userProfile as any)?.email?.split('@')[0] || 'Unknown User';

        return {
          id: post.id,
          user_id: post.user_id,
          user: {
            name: userName,
            avatar: userProfile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`,
            pets: userPets,
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
      
      setPosts(prev => initialLoad ? transformedPosts : [...prev, ...transformedPosts]);
      
      if (postsData.length < POSTS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setCurrentPage(page);

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
      const [followersResult, followingResult, postsResult] = await Promise.all([
        supabase.from('user_connections').select('*', { count: 'exact', head: true }).eq('requested_id', userId).eq('status', 'accepted').eq('connection_type', 'follow'),
        supabase.from('user_connections').select('*', { count: 'exact', head: true }).eq('requester_id', userId).eq('status', 'accepted').eq('connection_type', 'follow'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_active', true)
      ]);

      setFollowersCount(followersResult.count || 0);
      setFollowingCount(followingResult.count || 0);
      setPostsCount(postsResult.count || 0);
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
      name: profile.username || 'Unnamed User',
      username: profile.username || 'unnamed',
      avatar: profile.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username || 'U')}&background=random`,
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
      avatar: profile.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username || 'U')}&background=random`,
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
                  src={userProfile?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.username || 'U')}&background=random`}
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
                { icon: <MessageCircle size={20} />, label: 'Messages', path: '/chat' },
                { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
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
                  {item.icon}
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
          {isMobile ? (
            <header style={{
              padding: '5px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#2A2D3A',
              position: 'sticky',
              top: 0,
              zIndex: 100,
              borderBottom: '1px solid #23232a',
            }}>
              {/* Left: PetoGram name */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', paddingLeft: 16 }}>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>PetoGram</span>
              </div>
              {/* Center: Bunny logo */}
              <div style={{ flex: 1.3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src="/bunny-logo.png" alt="PetoGram Logo" style={{ height: 42, width: 52, objectFit: 'contain' }} />
              </div>
              {/* Right: Message Button */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', paddingRight: 16 }}>
                <button onClick={() => navigate('/chat')} style={{ background: 'none', border: 'none', color: '#fff' }}>
                  <MessageCircle size={26} />
                </button>
              </div>
            </header>
          ) : (
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
          )}

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
                        loading="lazy"
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
              {hasMore && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <button 
                    onClick={() => fetchPosts(currentPage + 1)} 
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#6366F1',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Loading...' : 'Load More Posts'}
                  </button>
                </div>
              )}
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
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  style={{
                    animation: 'glow 2s infinite'
                  }}
                >
                  <MessageCircle size={24} />
                </button>
              </div>
            </div>
            {/* Upcoming Events Card */}
            <UpcomingEventsCard />
            <PollCard
              options={[
                { id: 'cat', label: 'Cat', icon: <Cat size={20} />, votes: votes['1'] || 0 },
                { id: 'dog', label: 'Dog', icon: <Dog size={20} />, votes: votes['2'] || 0 }
              ]}
              totalVotes={totalVotes}
              hasVoted={!!selectedAnimal}
              isLoading={loadingVotes}
              error={voteError || undefined}
              onVote={handleVote}
            />
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
      <style>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px 2px rgba(192, 132, 252, 0.2);
          }
          50% {
            box-shadow: 0 0 15px 5px rgba(192, 132, 252, 0.4);
          }
        }
      `}</style>
      {/* Bottom Navigation for Mobile */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          background: '#23232a',
          borderTop: '1px solid #363636',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: 56,
          zIndex: 200,
        }}>
          <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9"/><path d="M9 21V9h6v12"/></svg>
          </button>
          <button onClick={() => navigate('/events-page')} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <Calendar size={26} />
          </button>
          <button onClick={() => navigate('/create-post')} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </button>
          <button onClick={() => navigate('/appointment-page')} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <Stethoscope size={26} />
          </button>
          <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', color: '#fff' }}>
            <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2"/></svg>
          </button>
        </nav>
      )}
    </>
  )
}

export default EnhancedHome;