import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  Star, 
  Phone,
  MessageCircle,
  ChevronRight,
  Filter,
  Heart
} from 'lucide-react-native';

interface Service {
  id: string;
  name: string;
  provider: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  priceUnit: string;
  location: string;
  availability: string;
  hours: string;
  description: string;
  image: string;
  verified: boolean;
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Happy Paws Veterinary Clinic',
    provider: 'Dr. Sarah Johnson',
    category: 'vet',
    rating: 4.8,
    reviews: 127,
    price: 50,
    priceUnit: '/session',
    location: 'New York, NY',
    availability: 'Available 5 days/week',
    hours: '09:00 - 17:00, 09:00 - 17:00, 09:00 - 17:00, 09:00 - 17:00, 09:00 - 17:00',
    description: 'Full-service veterinary care for all your pets. Specializing in preventative care, dental health, and emergency services.',
    image: 'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
  },
  {
    id: '2',
    name: 'Paws & Play Dog Walking',
    provider: 'Mike Wilson',
    category: 'walking',
    rating: 4.9,
    reviews: 89,
    price: 25,
    priceUnit: '/walk',
    location: 'Brooklyn, NY',
    availability: 'Available 7 days/week',
    hours: '07:00 - 19:00',
    description: 'Professional dog walking services with GPS tracking and photo updates. Licensed and insured.',
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: false,
  },
  {
    id: '3',
    name: 'Fluffy Friends Grooming',
    provider: 'Lisa Chen',
    category: 'grooming',
    rating: 4.7,
    reviews: 156,
    price: 45,
    priceUnit: '/session',
    location: 'Manhattan, NY',
    availability: 'Available 6 days/week',
    hours: '08:00 - 18:00',
    description: 'Professional pet grooming services including baths, haircuts, nail trimming, and spa treatments.',
    image: 'https://images.pexels.com/photos/6568460/pexels-photo-6568460.jpeg?auto=compress&cs=tinysrgb&w=400',
    verified: true,
  },
];

const categories = [
  { id: 'all', name: 'All', color: '#8B5CF6' },
  { id: 'vet', name: 'Veterinary', color: '#EF4444' },
  { id: 'grooming', name: 'Grooming', color: '#F59E0B' },
  { id: 'walking', name: 'Walking', color: '#10B981' },
  { id: 'boarding', name: 'Boarding', color: '#6366F1' },
  { id: 'training', name: 'Training', color: '#EC4899' },
];

export default function PetServiceBooking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState(mockServices);
  const [favoriteServices, setFavoriteServices] = useState<Set<string>>(new Set());

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (serviceId: string) => {
    setFavoriteServices(current => {
      const newSet = new Set(current);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const handleBookService = (service: Service) => {
    Alert.alert(
      'Book Service',
      `Would you like to book ${service.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => Alert.alert('Success!', 'Your booking request has been sent!') 
        }
      ]
    );
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#8B5CF6';
  };

  const renderServiceCard = (service: Service) => (
    <View key={service.id} style={styles.serviceCard}>
      <Image source={{ uri: service.image }} style={styles.serviceImage} />
      
      <View style={styles.serviceContent}>
        {/* Header */}
        <View style={styles.serviceHeader}>
          <View style={styles.serviceNameContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.verified && (
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(service.category) }]}>
                <Text style={styles.categoryText}>{service.category}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(service.id)}
          >
            <Heart 
              size={20} 
              color={favoriteServices.has(service.id) ? "#EF4444" : "#9CA3AF"}
              fill={favoriteServices.has(service.id) ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        {/* Provider */}
        <Text style={styles.serviceProvider}>by {service.provider}</Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Star size={16} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.rating}>{service.rating}</Text>
          <Text style={styles.reviewCount}>• {service.reviews} reviews</Text>
        </View>

        {/* Description */}
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.description}
        </Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.infoText}>{service.location}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.infoText}>{service.availability}</Text>
          </View>
        </View>

        {/* Price and Actions */}
        <View style={styles.serviceFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${service.price}</Text>
            <Text style={styles.priceUnit}>{service.priceUnit}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.contactButton}>
              
              <MessageCircle size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton}>
              <Phone size={16} color="#6B7280" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => handleBookService(service)}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Pet Services</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services, providers, or locations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && { 
                backgroundColor: category.color + '20',
                borderColor: category.color 
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && { color: category.color },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <ScrollView 
        style={styles.servicesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.servicesContent}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map(renderServiceCard)
        ) : (
          <View style={styles.emptyState}>
            <Search size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Services Found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your search or category filters
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  servicesList: {
    flex: 1,
  },
  servicesContent: {
    padding: 16,
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  serviceImage: {
    width: '100%',
    height: 160,
  },
  serviceContent: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  serviceNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    padding: 4,
  },
  serviceProvider: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  priceUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
});