/*
  # Complete Social Platform Schema

  1. New Tables
    - `user_connections` - Friend requests and following relationships
    - `posts` - User posts with images, videos, polls, text
    - `post_likes` - Post like interactions
    - `post_comments` - Post comments and replies
    - `conversations` - Chat conversations (direct and group)
    - `conversation_participants` - Users in conversations
    - `messages` - Chat messages with media support
    - `notifications` - User notifications system
    - `event_registrations` - Event signup tracking
    - `appointment_bookings` - Vet appointment system
    - `user_blocks` - User blocking functionality
    - `user_privacy_settings` - Privacy control settings

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for data access
    - Ensure users can only access their own data or public content

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for social media usage patterns
*/

-- User Connections (Friend Requests/Following)
CREATE TABLE IF NOT EXISTS user_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  connection_type text NOT NULL DEFAULT 'friend' CHECK (connection_type IN ('friend', 'follow')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, requested_id)
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'poll')),
  caption text DEFAULT '',
  media_urls text[] DEFAULT '{}',
  hashtags text[] DEFAULT '{}',
  location text DEFAULT '',
  privacy_level text NOT NULL DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  poll_question text,
  poll_options jsonb,
  poll_expires_at timestamptz,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Likes
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post Comments
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name text,
  description text,
  avatar_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversation Participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file')),
  media_url text,
  reply_to_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  is_edited boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'friend_request', 'message', 'event', 'appointment')),
  title text NOT NULL,
  content text NOT NULL,
  related_id uuid,
  related_type text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id text NOT NULL,
  email text NOT NULL,
  status text DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  registration_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Appointment Bookings
CREATE TABLE IF NOT EXISTS appointment_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_type text NOT NULL,
  veterinarian_name text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  pet_name text NOT NULL,
  pet_type text NOT NULL,
  notes text DEFAULT '',
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Blocks
CREATE TABLE IF NOT EXISTS user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- User Privacy Settings
CREATE TABLE IF NOT EXISTS user_privacy_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'friends', 'private')),
  allow_friend_requests boolean DEFAULT true,
  allow_messages boolean DEFAULT true,
  show_online_status boolean DEFAULT true,
  show_last_seen boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_privacy_settings ENABLE ROW LEVEL SECURITY;

-- User Connections Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_connections' AND policyname = 'Users can view their own connections'
  ) THEN
    CREATE POLICY "Users can view their own connections"
      ON user_connections FOR SELECT
      TO authenticated
      USING (auth.uid() = requester_id OR auth.uid() = requested_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_connections' AND policyname = 'Users can create connection requests'
  ) THEN
    CREATE POLICY "Users can create connection requests"
      ON user_connections FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = requester_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_connections' AND policyname = 'Users can update their connection requests'
  ) THEN
    CREATE POLICY "Users can update their connection requests"
      ON user_connections FOR UPDATE
      TO authenticated
      USING (auth.uid() = requester_id OR auth.uid() = requested_id);
  END IF;
END $$;

-- Posts Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Users can view public posts'
  ) THEN
    CREATE POLICY "Users can view public posts"
      ON posts FOR SELECT
      TO authenticated
      USING (privacy_level = 'public' OR user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Users can create their own posts'
  ) THEN
    CREATE POLICY "Users can create their own posts"
      ON posts FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Users can update their own posts'
  ) THEN
    CREATE POLICY "Users can update their own posts"
      ON posts FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'posts' AND policyname = 'Users can delete their own posts'
  ) THEN
    CREATE POLICY "Users can delete their own posts"
      ON posts FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Post Likes Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_likes' AND policyname = 'Users can view post likes'
  ) THEN
    CREATE POLICY "Users can view post likes"
      ON post_likes FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_likes' AND policyname = 'Users can like posts'
  ) THEN
    CREATE POLICY "Users can like posts"
      ON post_likes FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_likes' AND policyname = 'Users can unlike posts'
  ) THEN
    CREATE POLICY "Users can unlike posts"
      ON post_likes FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Post Comments Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can view comments'
  ) THEN
    CREATE POLICY "Users can view comments"
      ON post_comments FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can create comments'
  ) THEN
    CREATE POLICY "Users can create comments"
      ON post_comments FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can update their own comments'
  ) THEN
    CREATE POLICY "Users can update their own comments"
      ON post_comments FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'post_comments' AND policyname = 'Users can delete their own comments'
  ) THEN
    CREATE POLICY "Users can delete their own comments"
      ON post_comments FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Conversations Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'conversations' AND policyname = 'Users can view their conversations'
  ) THEN
    CREATE POLICY "Users can view their conversations"
      ON conversations FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM conversation_participants 
          WHERE conversation_id = conversations.id AND user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'conversations' AND policyname = 'Users can create conversations'
  ) THEN
    CREATE POLICY "Users can create conversations"
      ON conversations FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = created_by);
  END IF;
END $$;

-- Conversation Participants Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'conversation_participants' AND policyname = 'Users can view conversation participants'
  ) THEN
    CREATE POLICY "Users can view conversation participants"
      ON conversation_participants FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM conversation_participants cp 
          WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'conversation_participants' AND policyname = 'Users can join conversations'
  ) THEN
    CREATE POLICY "Users can join conversations"
      ON conversation_participants FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Messages Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' AND policyname = 'Users can view messages in their conversations'
  ) THEN
    CREATE POLICY "Users can view messages in their conversations"
      ON messages FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM conversation_participants 
          WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' AND policyname = 'Users can send messages'
  ) THEN
    CREATE POLICY "Users can send messages"
      ON messages FOR INSERT
      TO authenticated
      WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
          SELECT 1 FROM conversation_participants 
          WHERE conversation_id = messages.conversation_id AND user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Notifications Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can view their own notifications'
  ) THEN
    CREATE POLICY "Users can view their own notifications"
      ON notifications FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'System can create notifications'
  ) THEN
    CREATE POLICY "System can create notifications"
      ON notifications FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' AND policyname = 'Users can update their own notifications'
  ) THEN
    CREATE POLICY "Users can update their own notifications"
      ON notifications FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Event Registrations Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'event_registrations' AND policyname = 'Users can view their own event registrations'
  ) THEN
    CREATE POLICY "Users can view their own event registrations"
      ON event_registrations FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'event_registrations' AND policyname = 'Users can create event registrations'
  ) THEN
    CREATE POLICY "Users can create event registrations"
      ON event_registrations FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Appointment Bookings Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointment_bookings' AND policyname = 'Users can view their own appointments'
  ) THEN
    CREATE POLICY "Users can view their own appointments"
      ON appointment_bookings FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointment_bookings' AND policyname = 'Users can create appointments'
  ) THEN
    CREATE POLICY "Users can create appointments"
      ON appointment_bookings FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointment_bookings' AND policyname = 'Users can update their own appointments'
  ) THEN
    CREATE POLICY "Users can update their own appointments"
      ON appointment_bookings FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- User Blocks Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_blocks' AND policyname = 'Users can view their own blocks'
  ) THEN
    CREATE POLICY "Users can view their own blocks"
      ON user_blocks FOR SELECT
      TO authenticated
      USING (auth.uid() = blocker_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_blocks' AND policyname = 'Users can block others'
  ) THEN
    CREATE POLICY "Users can block others"
      ON user_blocks FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = blocker_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_blocks' AND policyname = 'Users can unblock others'
  ) THEN
    CREATE POLICY "Users can unblock others"
      ON user_blocks FOR DELETE
      TO authenticated
      USING (auth.uid() = blocker_id);
  END IF;
END $$;

-- User Privacy Settings Policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_privacy_settings' AND policyname = 'Users can view their own privacy settings'
  ) THEN
    CREATE POLICY "Users can view their own privacy settings"
      ON user_privacy_settings FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_privacy_settings' AND policyname = 'Users can create their privacy settings'
  ) THEN
    CREATE POLICY "Users can create their privacy settings"
      ON user_privacy_settings FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_privacy_settings' AND policyname = 'Users can update their privacy settings'
  ) THEN
    CREATE POLICY "Users can update their privacy settings"
      ON user_privacy_settings FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_requested ON user_connections(requested_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON user_connections(status);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_privacy ON posts(privacy_level);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create or replace the updated_at function (safe to run multiple times)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps (only for new tables)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_connections_updated_at'
  ) THEN
    CREATE TRIGGER update_user_connections_updated_at 
      BEFORE UPDATE ON user_connections 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_posts_updated_at'
  ) THEN
    CREATE TRIGGER update_posts_updated_at 
      BEFORE UPDATE ON posts 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_post_comments_updated_at'
  ) THEN
    CREATE TRIGGER update_post_comments_updated_at 
      BEFORE UPDATE ON post_comments 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_conversations_updated_at'
  ) THEN
    CREATE TRIGGER update_conversations_updated_at 
      BEFORE UPDATE ON conversations 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_messages_updated_at'
  ) THEN
    CREATE TRIGGER update_messages_updated_at 
      BEFORE UPDATE ON messages 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_appointment_bookings_updated_at'
  ) THEN
    CREATE TRIGGER update_appointment_bookings_updated_at 
      BEFORE UPDATE ON appointment_bookings 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_privacy_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_user_privacy_settings_updated_at 
      BEFORE UPDATE ON user_privacy_settings 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;