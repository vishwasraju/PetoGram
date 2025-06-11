import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { designTokens } from '../design-system/tokens';
import Button from '../components/ui/Button';

export default function PasswordSecurityPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    // TODO: Integrate with backend password change logic
    setTimeout(() => {
      setLoading(false);
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleChangePassword} style={{ backgroundColor: '#111', borderRadius: 16, padding: 32, minWidth: 400, boxShadow: '0 4px 32px #0008', border: '1px solid #333' }}>
        <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 700, color: '#fff' }}>Change Password</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#9CA3AF' }}>Current Password</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#9CA3AF' }}>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: 16 }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, color: '#9CA3AF' }}>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: 16 }} />
        </div>
        {error && <div style={{ color: '#EF4444', marginBottom: 16 }}>{error}</div>}
        {success && <div style={{ color: '#10B981', marginBottom: 16 }}>{success}</div>}
        <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
        <Button type="button" variant="secondary" size="lg" style={{ width: '100%', marginTop: 12 }} onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </form>
    </div>
  );
} 