CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- e.g., 'direct', 'group'
    name TEXT, -- For group chats
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- e.g., 'member', 'admin'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_read_message_id UUID, -- To track read status
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text', -- e.g., 'text', 'image', 'video'
    media_url TEXT,
    reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_conversations_updated_at ON conversations (updated_at DESC);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants (user_id);
CREATE INDEX idx_messages_conversation_id ON messages (conversation_id);
CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_created_at ON messages (created_at DESC);

-- RLS for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for participants" ON conversations
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = conversations.id AND user_id = auth.uid()));

CREATE POLICY "Enable insert for authenticated users" ON conversations
FOR INSERT TO authenticated
WITH CHECK (TRUE);

-- RLS for conversation_participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for participants" ON conversation_participants
FOR ALL TO authenticated
USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM conversation_participants cp JOIN conversations c ON cp.conversation_id = c.id WHERE cp.conversation_id = conversation_participants.conversation_id AND cp.user_id = auth.uid() AND c.type = 'group' AND cp.role = 'admin'));

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for participants" ON messages
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())); 