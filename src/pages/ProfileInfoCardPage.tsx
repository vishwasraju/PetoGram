import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, MapPin, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { designTokens } from '../design-system/tokens';
import { supabase } from '../utils/supabase';
import { getCurrentUser, getUserProfile, getUserPets } from '../utils/auth';

interface UserProfile {
  id: string;
  user_id: string;
  username?: string;
  bio: string;
  profile_picture: string;
  location: string;
  birth_date?: string;
  phone: string;
  website: string;
  social_media: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  interests: string[];
  is_public: boolean;
  allow_messages: boolean;
  show_email: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function ProfileInfoCardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  const fetchCurrentUserData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/');
        return;
      }
      const userProfile = await getUserProfile(user.id);
      if (userProfile) setProfile(userProfile);
      const { data: userPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (userPosts) setPosts(userPosts);
      const { count: followers } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requested_id', user.id)
        .eq('status', 'accepted');
      const { count: following } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', user.id)
        .eq('status', 'accepted');
      setFollowersCount(followers || 0);
      setFollowingCount(following || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #333', borderTop: '4px solid #6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 500, backgroundColor: '#111', border: '1px solid #333', borderRadius: 24, padding: 32, boxShadow: '0 4px 32px #0008' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <img
            src={profile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2'}
            alt={profile?.username || 'Profile'}
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366F1', marginBottom: 16 }}
          />
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{profile?.username || 'User'}</h2>
          <p style={{ margin: 0, fontSize: 16, color: '#9CA3AF', fontWeight: 500 }}>@{profile?.username || 'username'}</p>
          <div style={{ display: 'flex', gap: 32, margin: '16px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{posts.length}</div>
              <div style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>Posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{followersCount}</div>
              <div style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{followingCount}</div>
              <div style={{ fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>Following</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 16, color: '#E5E7EB', textAlign: 'center', lineHeight: 1.5 }}>{profile?.bio || 'Pet lover sharing amazing moments with my furry friends! 🐕🐱'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 14, color: '#9CA3AF', margin: '8px 0' }}>
            {profile?.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={16} />{profile.location}</span>
            )}
            {profile?.created_at && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={16} />Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            )}
          </div>
          <Button variant="primary" size="lg" style={{ marginTop: 16, width: '100%' }} onClick={() => navigate('/edit-profile')}>
            <Edit3 size={18} />
            <span>Edit Profile</span>
          </Button>
        </div>
      </Card>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
} 