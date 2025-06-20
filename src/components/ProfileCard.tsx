import React from 'react';
import { MapPin, Calendar, Edit3 } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { designTokens } from '../design-system/tokens';
import { UserProfile, UserPet } from '../pages/Profile'; // Assuming these interfaces are exported from Profile.tsx
import Modal from './ui/Modal';
import { supabase } from '../utils/supabase';

interface ProfileCardProps {
  profile: UserProfile | null;
  pets: UserPet[];
  followersCount: number;
  followingCount: number;
  onEditProfile: () => void;
}

export default function ProfileCard({ profile, pets, followersCount, followingCount, onEditProfile }: ProfileCardProps) {
  const [showFollowers, setShowFollowers] = React.useState(false);
  const [showFollowing, setShowFollowing] = React.useState(false);
  const [followers, setFollowers] = React.useState<any[]>([]);
  const [following, setFollowing] = React.useState<any[]>([]);
  const [loadingFollowers, setLoadingFollowers] = React.useState(false);
  const [loadingFollowing, setLoadingFollowing] = React.useState(false);

  const fetchFollowers = async () => {
    setLoadingFollowers(true);
    const { data, error } = await supabase
      .from('user_connections')
      .select('requester_id, requester:requester_id(username, profile_picture)')
      .eq('requested_id', profile?.user_id)
      .eq('status', 'accepted')
      .eq('connection_type', 'follow');
    setFollowers(data?.map((c: any) => c.requester) || []);
    setLoadingFollowers(false);
  };

  const fetchFollowing = async () => {
    setLoadingFollowing(true);
    const { data, error } = await supabase
      .from('user_connections')
      .select('requested_id, requested:requested_id(username, profile_picture)')
      .eq('requester_id', profile?.user_id)
      .eq('status', 'accepted')
      .eq('connection_type', 'follow');
    setFollowing(data?.map((c: any) => c.requested) || []);
    setLoadingFollowing(false);
  };

  React.useEffect(() => {
    if (showFollowers) fetchFollowers();
  }, [showFollowers]);
  React.useEffect(() => {
    if (showFollowing) fetchFollowing();
  }, [showFollowing]);

  return (
    <Card style={{
      width: '100%',
      maxWidth: '500px',
      backgroundColor: '#2A2D3A',
      border: '1px solid #3A3D4A',
      borderRadius: '16px',
      padding: '32px',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: designTokens.spacing[6] }}>
        <img
          src={profile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2'}
          alt={profile?.username || 'Profile'}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${designTokens.colors.primary[500]}`, // Primary color for border
            marginBottom: designTokens.spacing[4],
          }}
        />
        <h2 style={{ margin: 0, fontSize: designTokens.typography.fontSize['3xl'], fontWeight: designTokens.typography.fontWeight.bold, color: '#fff', letterSpacing: '0.025em' }}>
          {profile?.username || 'User'}
        </h2>
        <p style={{ margin: 0, fontSize: designTokens.typography.fontSize.base, color: '#9CA3AF', fontWeight: designTokens.typography.fontWeight.medium }}>
          @{profile?.username || 'username'}
        </p>
        <div style={{ display: 'flex', gap: designTokens.spacing[8], margin: `${designTokens.spacing[4]} 0` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: designTokens.typography.fontSize.xl, fontWeight: designTokens.typography.fontWeight.bold, color: '#fff' }}>
              0
            </div>
            <div style={{ fontSize: designTokens.typography.fontSize.sm, color: '#9CA3AF', fontWeight: designTokens.typography.fontWeight.medium }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowFollowers(true)}>
            <div style={{ fontSize: designTokens.typography.fontSize.xl, fontWeight: designTokens.typography.fontWeight.bold, color: '#fff' }}>
              {followersCount}
            </div>
            <div style={{ fontSize: designTokens.typography.fontSize.sm, color: '#9CA3AF', fontWeight: designTokens.typography.fontWeight.medium }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setShowFollowing(true)}>
            <div style={{ fontSize: designTokens.typography.fontSize.xl, fontWeight: designTokens.typography.fontWeight.bold, color: '#fff' }}>
              {followingCount}
            </div>
            <div style={{ fontSize: designTokens.typography.fontSize.sm, color: '#9CA3AF', fontWeight: designTokens.typography.fontWeight.medium }}>Following</div>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: designTokens.typography.fontSize.base, color: '#E5E7EB', textAlign: 'center', lineHeight: designTokens.typography.lineHeight.relaxed }}>
          {profile?.bio || 'Pet lover sharing amazing moments with my furry friends! 🐕🐱'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[4], fontSize: designTokens.typography.fontSize.sm, color: '#9CA3AF', margin: `${designTokens.spacing[2]} 0` }}>
          {profile?.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}><MapPin size={16} />{profile.location}</span>
          )}
          {profile?.created_at && (
            <span style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}><Calendar size={16} />Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          )}
        </div>
        {pets.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: designTokens.spacing[2], marginTop: designTokens.spacing[4] }}>
            {pets.map(pet => (
              <span key={pet.id} style={{
                backgroundColor: designTokens.colors.tertiary[500],
                color: designTokens.colors.tertiary[900],
                padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`, // Smaller padding
                borderRadius: designTokens.borderRadius.full,
                fontSize: designTokens.typography.fontSize.xs,
                fontWeight: designTokens.typography.fontWeight.medium,
              }}>
                {pet.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={showFollowers} onClose={() => setShowFollowers(false)} title="Followers" size="sm">
        {loadingFollowers ? <div>Loading...</div> : (
          followers.length === 0 ? <div>No followers yet.</div> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {followers.map((user, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={user.profile_picture || 'https://ui-avatars.com/api/?name=' + user.username} alt={user.username} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </Modal>
      <Modal isOpen={showFollowing} onClose={() => setShowFollowing(false)} title="Following" size="sm">
        {loadingFollowing ? <div>Loading...</div> : (
          following.length === 0 ? <div>Not following anyone yet.</div> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {following.map((user, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src={user.profile_picture || 'https://ui-avatars.com/api/?name=' + user.username} alt={user.username} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </Modal>
    </Card>
  );
} 