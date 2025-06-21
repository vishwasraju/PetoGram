import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Stethoscope, Calendar, Clock, MapPin, User, Phone, Plus, Search, Filter } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import Modal from '../components/ui/Modal'

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState('booknew')
  const [showVetQuestion, setShowVetQuestion] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '' })
  const [contactError, setContactError] = useState('')
  const [contactSuccess, setContactSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const availableSlots = [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '12:00 PM', available: true },
    { time: '1:00 PM', available: false },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: false },
    { time: '5:00 PM', available: true }
  ]

  const veterinarians = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      rating: 4.9,
      experience: '8 years',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=200',
      location: 'Manhattan Vet Clinic',
      nextAvailable: 'Tomorrow 10:00 AM'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Surgery',
      rating: 4.8,
      experience: '12 years',
      image: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200',
      location: 'Brooklyn Animal Hospital',
      nextAvailable: 'Today 3:00 PM'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.9,
      experience: '6 years',
      image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=200',
      location: 'Queens Pet Care',
      nextAvailable: 'Friday 11:00 AM'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Emergency Care',
      rating: 4.7,
      experience: '15 years',
      image: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=200',
      location: '24/7 Emergency Vet',
      nextAvailable: 'Available Now'
    }
  ]

  const upcomingAppointments = [
    {
      id: '1',
      petName: 'Max',
      petType: 'Golden Retriever',
      veterinarian: 'Dr. Sarah Johnson',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Routine Checkup',
      location: 'Manhattan Vet Clinic',
      status: 'confirmed'
    },
    {
      id: '2',
      petName: 'Luna',
      petType: 'Persian Cat',
      veterinarian: 'Dr. Emily Rodriguez',
      date: 'Friday',
      time: '2:00 PM',
      type: 'Skin Consultation',
      location: 'Queens Pet Care',
      status: 'pending'
    }
  ]

  const appointmentTypes = [
    { name: 'Routine Checkup', icon: '🩺', price: '$75' },
    { name: 'Vaccination', icon: '💉', price: '$45' },
    { name: 'Dental Cleaning', icon: '🦷', price: '$120' },
    { name: 'Surgery Consultation', icon: '🏥', price: '$150' },
    { name: 'Emergency Visit', icon: '🚨', price: '$200' },
    { name: 'Grooming', icon: '✂️', price: '$60' }
  ]

  const handleVetResponse = (isVet: boolean) => {
    if (isVet) {
      navigate('/contact-us') // or wherever your contact page is
    }
    setShowVetQuestion(false)
  }

  const handleVetCardClick = () => {
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    }}>
      {/* Floating Vet Question Card */}
      {showVetQuestion && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #333',
          zIndex: 1000,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          maxWidth: '400px',
          width: '90%',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Stethoscope size={48} color="#10B981" style={{ marginBottom: '16px' }} />
            <h2 style={{
              margin: '0 0 12px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Are you a vet?
            </h2>
            <p style={{
              margin: 0,
              fontSize: '16px',
              color: '#9CA3AF',
              lineHeight: '1.5',
            }}>
              If you're a veterinarian looking to join our platform, we'd love to hear from you!
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/contact-us')}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#6366F1',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366F1'}
            >
              Contact Us
            </button>
            <button
              onClick={() => setShowVetQuestion(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #555',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#222'
                e.currentTarget.style.color = '#10B981'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#fff'
              }}
            >
              No, I'm a pet owner
            </button>
          </div>
        </div>
      )}

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
            <Stethoscope size={24} color="#10B981" />
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Appointments
            </h1>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#10B981',
            border: 'none',
            borderRadius: '20px',
            color: '#000',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}>
            <Plus size={16} />
            Book Appointment
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '24px 0' : '24px',
      }}>
        {/* Appointment Tabs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid #333',
          padding: isMobile ? '0 16px' : '0',
        }}>
          {['Book New'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
              style={{
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#10B981',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: '2px solid #10B981',
                transition: 'all 0.2s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Book New Appointment Tab */}
        {activeTab === 'booknew' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Available Veterinarians */}
            <div style={{
              backgroundColor: '#111',
              borderRadius: isMobile ? 0 : '16px',
              padding: isMobile ? '16px' : '24px',
              border: '1px solid #333',
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
              }}>
                Choose Your Veterinarian
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {veterinarians.map((vet) => (
                  <div
                    key={vet.id}
                    style={{
                      padding: '20px',
                      backgroundColor: '#222',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid #333',
                      position: 'relative',
                      minHeight: '260px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                    onClick={handleVetCardClick}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '16px',
                    }}>
                      <img 
                        src={vet.image}
                        alt={vet.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          margin: '0 0 4px 0',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#fff',
                        }}>
                          {vet.name}
                        </h3>
                        <p style={{
                          margin: '0 0 4px 0',
                          fontSize: '14px',
                          color: '#10B981',
                          fontWeight: '600',
                        }}>
                          {vet.specialty}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <span style={{ color: '#F59E0B' }}>⭐</span>
                          <span style={{
                            fontSize: '14px',
                            color: '#9CA3AF',
                          }}>
                            {vet.rating} • {vet.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                    
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
                        <MapPin size={16} color="#9CA3AF" />
                        <span style={{
                          fontSize: '14px',
                          color: '#9CA3AF',
                        }}>
                          {vet.location}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <Clock size={16} color="#9CA3AF" />
                        <span style={{
                          fontSize: '14px',
                          color: '#9CA3AF',
                        }}>
                          Next available: {vet.nextAvailable}
                        </span>
                      </div>
                    </div>
                    
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#10B981',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10B981'}>
                      Book with {vet.name.split(' ')[1]}
                    </button>
                    <div style={{ marginTop: '16px', color: '#F59E0B', fontSize: '13px', fontWeight: 500 }}>
                      Note: These are dummy veterinarians for demo purposes.
                    </div>
                  </div>
                ))}
                {/* Vet-specific CTA card */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#222',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  border: '1px solid #333',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: '260px',
                  gap: '16px',
                }}>
                  <Stethoscope size={40} color="#10B981" />
                  <h3 style={{
                    margin: '0',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#fff',
                  }}>Are you a vet?</h3>
                  <p style={{
                    margin: 0,
                    color: '#9CA3AF',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}>
                    If you're a veterinarian looking to join our platform, we'd love to hear from you!
                  </p>
                  <button
                    onClick={handleVetCardClick}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#6366F1',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}>
                    Contact Us
                  </button>
                  <button
                    onClick={() => { /* Handle pet owner action */ }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: 'transparent',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#9CA3AF',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                     onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#333'
                      e.currentTarget.style.color = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#9CA3AF'
                    }}
                  >
                    No, I'm a pet owner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
    </div>
  )
}