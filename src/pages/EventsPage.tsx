import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Plus, Filter, Search, Star } from 'lucide-react'
import { designTokens } from '../design-system/tokens'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')

  const upcomingEvents = [
    {
      id: '1',
      title: 'Pet Adoption Fair',
      date: 'Tomorrow',
      time: '10:00 AM - 4:00 PM',
      location: 'Central Park, New York',
      attendees: 234,
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Adoption',
      price: 'Free',
      organizer: 'NYC Pet Rescue'
    },
    {
      id: '2',
      title: 'Dog Training Workshop',
      date: 'This Weekend',
      time: '2:00 PM - 5:00 PM',
      location: 'Community Center, Brooklyn',
      attendees: 89,
      image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Training',
      price: '$25',
      organizer: 'Pawsome Training'
    },
    {
      id: '3',
      title: 'Cat Cafe Meetup',
      date: 'Next Monday',
      time: '6:00 PM - 8:00 PM',
      location: 'Whiskers Cafe, Manhattan',
      attendees: 156,
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Social',
      price: '$15',
      organizer: 'Cat Lovers NYC'
    },
    {
      id: '4',
      title: 'Pet Photography Session',
      date: 'Next Friday',
      time: '11:00 AM - 3:00 PM',
      location: 'Prospect Park, Brooklyn',
      attendees: 67,
      image: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Photography',
      price: '$40',
      organizer: 'Pet Photo Pro'
    },
    {
      id: '5',
      title: 'Veterinary Health Seminar',
      date: 'Next Saturday',
      time: '9:00 AM - 12:00 PM',
      location: 'Animal Hospital, Queens',
      attendees: 123,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Health',
      price: 'Free',
      organizer: 'Queens Vet Clinic'
    },
    {
      id: '6',
      title: 'Pet Costume Contest',
      date: 'Next Sunday',
      time: '1:00 PM - 4:00 PM',
      location: 'Washington Square Park',
      attendees: 298,
      image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Contest',
      price: '$10',
      organizer: 'NYC Pet Events'
    }
  ]

  const eventCategories = [
    { name: 'All', icon: '🌟', active: true },
    { name: 'Adoption', icon: '🏠', active: false },
    { name: 'Training', icon: '🎾', active: false },
    { name: 'Social', icon: '👥', active: false },
    { name: 'Health', icon: '🏥', active: false },
    { name: 'Contest', icon: '🏆', active: false }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/home" 
            style={{
              color: '#9CA3AF',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <ArrowLeft size={24} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Calendar size={24} color="#F59E0B" />
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Events
            </h1>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}>
            <Search size={20} />
          </button>
          <button style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}>
            <Filter size={20} />
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#F59E0B',
            border: 'none',
            borderRadius: '20px',
            color: '#000',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D97706'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}>
            <Plus size={16} />
            Create Event
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Event Tabs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid #333',
        }}>
          {['Upcoming', 'My Events', 'Past Events'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
              style={{
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: index === 0 ? '#F59E0B' : '#9CA3AF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: index === 0 ? '2px solid #F59E0B' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (index !== 0) e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                if (index !== 0) e.currentTarget.style.color = '#9CA3AF'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {eventCategories.map((category) => (
            <button
              key={category.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: category.active ? '#F59E0B' : '#222',
                border: 'none',
                borderRadius: '20px',
                color: category.active ? '#000' : '#9CA3AF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!category.active) {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={(e) => {
                if (!category.active) {
                  e.currentTarget.style.backgroundColor = '#222'
                  e.currentTarget.style.color = '#9CA3AF'
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px',
        }}>
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              style={{
                backgroundColor: '#111',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #333',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img 
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 8px',
                  backgroundColor: '#F59E0B',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#000',
                  fontWeight: '600',
                }}>
                  {event.category}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                  fontWeight: '600',
                }}>
                  {event.price}
                </div>
              </div>
              
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#fff',
                  lineHeight: '1.4',
                }}>
                  {event.title}
                </h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Calendar size={16} color="#9CA3AF" />
                    <span style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                    }}>
                      {event.date} • {event.time}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <MapPin size={16} color="#9CA3AF" />
                    <span style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                    }}>
                      {event.location}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Users size={16} color="#9CA3AF" />
                    <span style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                    }}>
                      {event.attendees} attending
                    </span>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #333',
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    by {event.organizer}
                  </span>
                  
                  <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#F59E0B',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#000',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D97706'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}>
                    Join Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}