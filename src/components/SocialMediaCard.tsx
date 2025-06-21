"use client"

import React, { useState } from "react";
import { designTokens } from "../design-system/tokens";

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing?: boolean;
}

interface SocialMediaCardProps {
  followingList?: User[];
  followersList?: User[];
  className?: string;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  initialTab?: "following" | "followers";
  loading: boolean;
}

const UserItem = ({ user, onFollow, onUnfollow }: { 
  user: User; 
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user.isFollowing) {
      onUnfollow?.(user.id);
    } else {
      onFollow?.(user.id);
    }
  };

  const followButtonStyle = {
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s, color 0.2s',
    ...(user.isFollowing
      ? {
          backgroundColor: isHovering ? '#EF4444' : '#374151',
          color: '#E5E7EB'
        }
      : {
          backgroundColor: designTokens.colors.primary.DEFAULT,
          color: designTokens.colors.white,
        }),
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      borderRadius: '12px',
      transition: 'background-color 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${designTokens.colors.gray[700]}`,
          }}
        />
        <div>
          <span style={{ fontWeight: 600, color: designTokens.colors.white }}>{user.name}</span>
          <span style={{ fontSize: '14px', color: designTokens.colors.gray[400], display: 'block' }}>@{user.username}</span>
        </div>
      </div>

      <button
        onClick={handleFollowClick}
        style={followButtonStyle}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {user.isFollowing ? (isHovering ? 'Unfollow' : 'Following') : 'Follow'}
      </button>
    </div>
  );
};

export function SocialMediaCard({
  followingList = [],
  followersList = [],
  className,
  onFollow = () => {},
  onUnfollow = () => {},
  initialTab = "following",
  loading,
}: SocialMediaCardProps) {
  const [activeTab, setActiveTab] = useState<"following" | "followers">(initialTab);

  const tabStyle = (tabName: "following" | "followers") => ({
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '600',
    position: 'relative',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: designTokens.colors.white,
    opacity: activeTab === tabName ? 1 : 0.7,
    borderBottom: activeTab === tabName ? `2px solid ${designTokens.colors.primary.DEFAULT}` : '2px solid transparent',
    transition: 'color 0.2s, border-bottom-color 0.2s, opacity 0.2s',
  });

  return (
    <div style={{
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto',
      backgroundColor: '#000000',
      border: `1px solid #333`,
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid #333`, backgroundColor: '#000000' }}>
        <button
          onClick={() => setActiveTab("following")}
          style={tabStyle("following")}
        >
          Following ({followingList.length})
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          style={tabStyle("followers")}
        >
          Followers ({followersList.length})
        </button>
      </div>

      {/* User Lists */}
      <div style={{ minHeight: '320px', maxHeight: '60vh', overflowY: 'auto', padding: '8px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '320px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #333',
              borderTop: `3px solid ${designTokens.colors.primary.DEFAULT}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        ) : (
          <div>
            {(activeTab === "following" ? followingList : followersList).map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
              />
            ))}
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
  );
} 