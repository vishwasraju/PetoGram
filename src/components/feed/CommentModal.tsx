import React, { useState, useEffect } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { getUserProfile } from '../../utils/auth';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { designTokens } from '../../design-system/tokens';

interface CommentModalProps {
  postId: string;
  onClose: () => void;
  currentUser: any;
  userProfile: any;
  onCommentPosted: (postId: string, newCommentCount: number) => void;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes_count: number;
  username: string;
  profile_picture: string;
  is_liked_by_current_user?: boolean;
}

export default function CommentModal({ postId, onClose, currentUser, userProfile, onCommentPosted }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*, user_id')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const commentsWithUserData: Comment[] = await Promise.all(
        (data || []).map(async (comment: any) => {
          const commentUserProfile = await getUserProfile(comment.user_id);
          const isLiked = await checkCommentLikedStatus(comment.id, currentUser?.id);
          return {
            ...comment,
            username: commentUserProfile?.username || commentUserProfile?.email?.split('@')[0] || 'Unknown User',
            profile_picture: commentUserProfile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2',
            is_liked_by_current_user: isLiked,
          };
        })
      );
      setComments(commentsWithUserData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCommentLikedStatus = async (commentId: string, userId: string | undefined) => {
    if (!userId) return false;
    const { data, error } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();
    return !!data;
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    if (!currentUser) {
      alert('Please log in to post comments.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: currentUser.id,
          content: newCommentText.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      // Increment comments_count using RPC
      const { error: rpcError } = await supabase.rpc('increment_comments_count', { post_id_param: postId });
      if (rpcError) throw rpcError;

      setNewCommentText('');
      await fetchComments(); // Refresh comments after posting
      
      // Fetch the updated comments_count from the posts table
      const { data: updatedPostData, error: fetchCountError } = await supabase
        .from('posts')
        .select('comments_count')
        .eq('id', postId)
        .single();

      if (fetchCountError) throw fetchCountError;

      // Call the callback to update the parent component's state with the actual updated count
      if (updatedPostData) {
        onCommentPosted(postId, updatedPostData.comments_count);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('An error occurred while posting your comment. Please try again.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) {
      alert('Please log in to like comments.');
      return;
    }

    const commentToLike = comments.find(c => c.id === commentId);
    if (!commentToLike) return;

    try {
      if (commentToLike.is_liked_by_current_user) {
        // Unlike comment
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', currentUser.id);

        if (error) throw error;

        // Decrement likes_count in post_comments table
        const { error: updateError } = await supabase
          .from('post_comments')
          .update({ likes_count: commentToLike.likes_count - 1 })
          .eq('id', commentId);

        if (updateError) throw updateError;

        setComments(currentComments =>
          currentComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes_count: comment.likes_count - 1, is_liked_by_current_user: false }
              : comment
          )
        );
      } else {
        // Like comment
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: currentUser.id,
          });

        if (error) throw error;

        // Increment likes_count in post_comments table
        const { error: updateError } = await supabase
          .from('post_comments')
          .update({ likes_count: commentToLike.likes_count + 1 })
          .eq('id', commentId);

        if (updateError) throw updateError;

        setComments(currentComments =>
          currentComments.map(comment =>
            comment.id === commentId
              ? { ...comment, likes_count: comment.likes_count + 1, is_liked_by_current_user: true }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error);
      alert('An error occurred while liking/unliking the comment. Please try again.');
    }
  };

  return (
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
      zIndex: designTokens.zIndex.modal + 1,
    }}>
      <Card style={{
        width: '90%',
        maxWidth: '600px',
        backgroundColor: '#2A2D3A',
        border: '1px solid #3A3D4A',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90%',
      }}>
        <button
          onClick={onClose}
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
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#FFFFFF',
          textAlign: 'center',
        }}>
          Comments
        </h2>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '24px',
          paddingRight: '10px', // For scrollbar
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading comments...</div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9CA3AF' }}>No comments yet. Be the first to comment!</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid #3A3D4A',
              }}>
                <img
                  src={comment.profile_picture}
                  alt={comment.username}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                    }}>
                      {comment.username}
                      <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '400', marginLeft: '8px' }}>
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: comment.is_liked_by_current_user ? '#EF4444' : '#9CA3AF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Heart size={16} fill={comment.is_liked_by_current_user ? 'currentColor' : 'none'} />
                      <span style={{ fontSize: '12px' }}>{comment.likes_count}</span>
                    </button>
                  </div>
                  <p style={{
                    margin: '4px 0 0 0',
                    fontSize: '14px',
                    color: '#E5E7EB',
                    lineHeight: '1.4',
                  }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #3A3D4A',
        }}>
          <img
            src={userProfile?.profile_picture || "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2"}
            alt={userProfile?.username || "User"}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePostComment();
              }
            }}
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: '#374151',
              border: '1px solid #4B5563',
              borderRadius: '24px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <Button onClick={handlePostComment} variant="primary" size="sm">
            <Send size={20} />
          </Button>
        </div>
      </Card>
    </div>
  );
} 