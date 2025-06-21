import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Plus, Filter, Search, Star } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import Modal from '../components/ui/Modal'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' })
  const [contactError, setContactError] = useState('')
  const [contactSuccess, setContactSuccess] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [votes, setVotes] = useState({})
  const [totalVotes, setTotalVotes] = useState(0)

  const handleEventCardClick = () => {
    setShowContactModal(true)
    setContactInfo({ email: '', phone: '' })
    setContactError('')
    setContactSuccess(false)
  }

  const handleContactInputChange = (field, value) => {
    setContactInfo(prev => ({ ...prev, [field]: value }))
    setContactError('')
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    if (!contactInfo.email || !contactInfo.phone) {
      setContactError('Please enter both Gmail and phone number.')
      return
    }
    if (!contactInfo.email.endsWith('@gmail.com')) {
      setContactError('Please enter a valid Gmail address.')
      return
    }
    setContactSuccess(true)
    setTimeout(() => setShowContactModal(false), 1500)
  }

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
    }
  ]

  const animalOptions = [
    { id: '1', name: 'Cat', img: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', name: 'Dog', img: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400' },
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
        {/* Event List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                minHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
              onClick={handleEventCardClick}
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
              <div style={{ marginTop: '16px', color: '#F59E0B', fontSize: '13px', fontWeight: 500 }}>
                Note: These are dummy events for demo purposes.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for contact info */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Contact Information" size="sm">
        {contactSuccess ? (
          <div style={{ textAlign: 'center', color: '#10B981', fontWeight: 600, fontSize: 18 }}>
            Thanks! We will assist you soon.
          </div>
        ) : (
          <form onSubmit={handleContactSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#9CA3AF', fontWeight: 600 }}>Gmail</label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={e => handleContactInputChange('email', e.target.value)}
                placeholder="yourname@gmail.com"
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: 16, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#9CA3AF', fontWeight: 600 }}>Phone Number</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={e => handleContactInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #333', background: '#222', color: '#fff', fontSize: 16, marginTop: 4 }}
              />
            </div>
            {contactError && <div style={{ color: '#EF4444', marginBottom: 12 }}>{contactError}</div>}
            <button type="submit" style={{
              width: '100%',
              padding: '16px',
              marginTop: '18px',
              backgroundColor: '#10B981',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16,185,129,0.15)',
              letterSpacing: '0.5px',
              display: 'block',
            }}>
              Send
            </button>
          </form>
        )}
      </Modal>

      {showResults && (
        <div id="pollResults">
          {animalOptions.map((animal) => {
            const count = votes[animal.id] || 0;
            const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <div key={animal.id} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={animal.img} alt={animal.name} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 10 }} />
                    {animal.name}
                  </span>
                  <span>{count} vote{count !== 1 ? 's' : ''} ({percent}%)</span>
                </div>
                <div style={{ height: 10, background: '#e0e7ff', borderRadius: 5, marginTop: 6, marginBottom: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${percent}%`, height: 10, background: '#6366F1', borderRadius: 5, transition: 'width 0.4s' }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 18, color: '#6366F1', fontWeight: 600, textAlign: 'center' }}>
            Total votes: {totalVotes}
          </div>
        </div>
      )}
    </div>
  )
}