import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chrome as Home, User, Video, MessageCircle, Calendar, Settings, CircleHelp as HelpCircle, LogOut, Search, Bell, Heart, Share, MoveHorizontal as MoreHorizontal, Play, Volume2, VolumeX, Menu, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    pets: string;
    verified?: boolean;
  };
  content: {
    type: 'image' | 'video';
    url: string;
    caption: string;
    hashtags: string[];
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    liked: boolean;
  };
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Max & Luna',
      verified: true,
    },
    content: {
      type: 'video',
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Max and Luna playing together. Rare sight! 😊 #PetPals #DogAndCat',
      hashtags: ['#PetPals', '#DogAndCat'],
    },
    engagement: {
      likes: 247,
      comments: 23,
      shares: 12,
      liked: false,
    },
    timestamp: 'Jun 16',
  },
  {
    id: '2',
    user: {
      name: 'Taylor Martinez',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Blu',
      verified: false,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Blu discovered the sprinkler today! 💦 First time seeing him this excited about water!',
      hashtags: ['#GoldenRetriever', '#WaterDog', '#SummerFun'],
    },
    engagement: {
      likes: 189,
      comments: 31,
      shares: 8,
      liked: true,
    },
    timestamp: '2h',
  },
];

const sidebarItems = [
  { id: 'home', name: 'Home', icon: Home, active: true },
  { id: 'profile', name: 'Profile', icon: User, active: false },
  { id: 'zoomies', name: 'Zoomies', icon: Video, active: false },
  { id: 'messages', name: 'Messages', icon: MessageCircle, active: false },
  { id: 'book', name: 'Book Services', icon: Calendar, active: false },
];

const bottomItems = [
  { id: 'settings', name: 'Settings', icon: Settings },
  { id: 'help', name: 'Help & Support', icon: HelpCircle },
];

export default function HomeScreen() {
  const [posts, setPosts] = useState(mockPosts);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(width < 768);
    };
    
    updateLayout();
    
    if (Platform.OS === 'web') {
      const handleResize = () => updateLayout();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleLike = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                liked: !post.engagement.liked,
                likes: post.engagement.liked 
                  ? post.engagement.likes - 1 
                  : post.engagement.likes + 1,
              },
            }
          : post
      )
    );
  };

  const toggleMute = (postId: string) => {
    setMutedVideos(current => {
      const newSet = new Set(current);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const renderSidebar = () => (
    <View style={[styles.sidebar, isMobile && styles.mobileSidebar, isMobile && !sidebarOpen && styles.hiddenSidebar]}>
      {/* User Profile Section */}
      <View style={styles.userSection}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }} 
          style={styles.userAvatar} 
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userHandle}>@johndoe</Text>
        </View>
      </View>

      {/* Navigation Items */}
      <View style={styles.navSection}>
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, item.active && styles.activeNavItem]}
            >
              <IconComponent 
                size={20} 
                color={item.active ? '#8B5CF6' : '#6B7280'} 
                strokeWidth={2}
              />
              <Text style={[styles.navText, item.active && styles.activeNavText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity key={item.id} style={styles.navItem}>
              <IconComponent size={20} color="#6B7280" strokeWidth={2} />
              <Text style={styles.navText}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
        
        <TouchableOpacity style={styles.logoutItem}>
          <LogOut size={20} color="#EF4444" strokeWidth={2} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {isMobile && (
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} color="#111827" />
        </TouchableOpacity>
      )}
      
      <Text style={styles.logo}>PetoGram</Text>
      
      <View style={styles.headerActions}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <MessageCircle size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton}>
          <Bell size={20} color="#6B7280" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userButton}>
          <Text style={styles.userButtonText}>John</Text>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }} 
            style={styles.headerAvatar} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreatePost = () => (
    <View style={styles.createPostContainer}>
      <Image 
        source={{ uri: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }} 
        style={styles.createPostAvatar} 
      />
      <TextInput
        style={styles.createPostInput}
        placeholder="What's new with your pets?"
        placeholderTextColor="#9CA3AF"
        multiline
      />
    </View>
  );

  const renderPostActions = () => (
    <View style={styles.postActionsContainer}>
      <TouchableOpacity style={styles.postActionButton}>
        <Text style={styles.postActionText}>📸 Post</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postActionButton}>
        <Text style={styles.postActionText}>🎬 Zoomies</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.postActionButton}>
        <Text style={styles.postActionText}>📹 Video</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPost = (post: Post) => (
    <View key={post.id} style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.user.avatar }} style={styles.postAvatar} />
        <View style={styles.postUserInfo}>
          <View style={styles.postUserNameRow}>
            <Text style={styles.postUserName}>{post.user.name}</Text>
            {post.user.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.postUserPets}>{post.user.pets} • {post.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.postMoreButton}>
          <MoreHorizontal size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Post Caption */}
      <Text style={styles.postCaption}>{post.content.caption}</Text>
      
      {/* Hashtags */}
      <View style={styles.hashtagContainer}>
        {post.content.hashtags.map((tag, index) => (
          <Text key={index} style={styles.hashtag}>{tag} </Text>
        ))}
      </View>

      {/* Post Content */}
      <View style={styles.postContentContainer}>
        <Image 
          source={{ uri: post.content.url }} 
          style={styles.postImage}
          resizeMode="cover"
        />
        {post.content.type === 'video' && (
          <View style={styles.videoOverlay}>
            <TouchableOpacity style={styles.playButton}>
              <Play size={24} color="#ffffff" fill="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.muteButton}
              onPress={() => toggleMute(post.id)}
            >
              {mutedVideos.has(post.id) ? (
                <VolumeX size={16} color="#ffffff" />
              ) : (
                <Volume2 size={16} color="#ffffff" />
              )}
            </TouchableOpacity>
            <View style={styles.videoProgress}>
              <Text style={styles.videoTime}>0:00</Text>
            </View>
          </View>
        )}
      </View>

      {/* Engagement Stats */}
      <Text style={styles.likesCount}>{post.engagement.likes} likes</Text>

      {/* Engagement Bar */}
      <View style={styles.engagementBar}>
        <TouchableOpacity 
          style={styles.engagementButton}
          onPress={() => handleLike(post.id)}
        >
          <Heart 
            size={20} 
            color={post.engagement.liked ? "#EF4444" : "#6B7280"}
            fill={post.engagement.liked ? "#EF4444" : "transparent"}
          />
          <Text style={styles.engagementText}>Like</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.engagementButton}>
          <MessageCircle size={20} color="#6B7280" />
          <Text style={styles.engagementText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.engagementButton}>
          <Share size={20} color="#6B7280" />
          <Text style={styles.engagementText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }} 
          style={styles.commentAvatar} 
        />
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          placeholderTextColor="#9CA3AF"
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity style={styles.postCommentButton}>
          <Text style={styles.postCommentText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        {/* Sidebar */}
        {renderSidebar()}
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <TouchableOpacity 
            style={styles.overlay}
            onPress={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Header */}
          {renderHeader()}

          {/* Content */}
          <ScrollView 
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Create Post */}
            {renderCreatePost()}
            {renderPostActions()}

            {/* Posts Feed */}
            <View style={styles.feedContainer}>
              {posts.map(renderPost)}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#f1f1f1',
    paddingVertical: 24,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  mobileSidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  hiddenSidebar: {
    transform: [{ translateX: -280 }],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  userHandle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  navSection: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeNavItem: {
    backgroundColor: '#EDE9FE',
  },
  navText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 12,
  },
  activeNavText: {
    color: '#8B5CF6',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 16,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 12,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#ffffff',
  },
  menuButton: {
    padding: 8,
    marginRight: 16,
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#8B5CF6',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 300,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    outlineStyle: 'none',
  },
  headerButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  contentScroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    margin: 24,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  createPostAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  createPostInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    minHeight: 40,
    textAlignVertical: 'top',
    outlineStyle: 'none',
  },
  postActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  postActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  postActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  feedContainer: {
    paddingHorizontal: 24,
    gap: 24,
  },
  postContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f1f1',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postUserName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  postUserPets: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  postMoreButton: {
    padding: 8,
  },
  postCaption: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  hashtag: {
    fontSize: 16,
    color: '#8B5CF6',
    fontFamily: 'Inter-Regular',
  },
  postContentContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoProgress: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  videoTime: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  likesCount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  engagementBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    paddingVertical: 8,
    marginBottom: 12,
  },
  engagementButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  engagementText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    outlineStyle: 'none',
  },
  postCommentButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postCommentText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});