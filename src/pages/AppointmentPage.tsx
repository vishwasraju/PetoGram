import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Stethoscope, Calendar, Clock, MapPin, User, Phone, Plus, Search, Filter } from 'lucide-react'
import { designTokens } from '../design-system/tokens'

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState('book')

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
        padding: '24px',
      }}>
        {/* Appointment Tabs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid #333',
        }}>
          {['Book New', 'My Appointments', 'History'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
              style={{
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: index === 0 ? '#10B981' : '#9CA3AF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: index === 0 ? '2px solid #10B981' : '2px solid transparent',
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

        {/* Book New Appointment Tab */}
        {activeTab === 'booknew' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Appointment Types */}
            <div style={{
              backgroundColor: '#111',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #333',
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
              }}>
                Select Appointment Type
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                {appointmentTypes.map((type) => (
                  <div
                    key={type.name}
                    style={{
                      padding: '20px',
                      backgroundColor: '#222',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid #333',
                      textAlign: 'center',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#333'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.borderColor = '#10B981'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#222'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.borderColor = '#333'
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '12px',
                    }}>
                      {type.icon}
                    </div>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#fff',
                    }}>
                      {type.name}
                    </h3>
                    <span style={{
                      fontSize: '14px',
                      color: '#10B981',
                      fontWeight: '600',
                    }}>
                      {type.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Veterinarians */}
            <div style={{
              backgroundColor: '#111',
              borderRadius: '16px',
              padding: '24px',
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#333'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#222'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
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
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div style={{
              backgroundColor: '#111',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #333',
            }}>
              <h2 style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
              }}>
                Available Time Slots - Tomorrow
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
              }}>
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    disabled={!slot.available}
                    style={{
                      padding: '12px',
                      backgroundColor: slot.available ? '#222' : '#333',
                      border: slot.available ? '1px solid #10B981' : '1px solid #555',
                      borderRadius: '8px',
                      color: slot.available ? '#fff' : '#666',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (slot.available) {
                        e.currentTarget.style.backgroundColor = '#10B981'
                        e.currentTarget.style.color = '#000'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (slot.available) {
                        e.currentTarget.style.backgroundColor = '#222'
                        e.currentTarget.style.color = '#fff'
                      }
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {activeTab === 'myappointments' && (
          <div style={{
            backgroundColor: '#111',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #333',
          }}>
            <h2 style={{
              margin: '0 0 20px 0',
              fontSize: '20px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Upcoming Appointments
            </h2>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  style={{
                    padding: '20px',
                    backgroundColor: '#222',
                    borderRadius: '12px',
                    border: '1px solid #333',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 4px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#fff',
                      }}>
                        {appointment.petName} - {appointment.type}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#9CA3AF',
                      }}>
                        {appointment.petType}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      backgroundColor: appointment.status === 'confirmed' ? '#10B981' : '#F59E0B',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: '600',
                      textTransform: 'capitalize',
                    }}>
                      {appointment.status}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <User size={16} color="#9CA3AF" />
                      <span style={{
                        fontSize: '14px',
                        color: '#9CA3AF',
                      }}>
                        {appointment.veterinarian}
                      </span>
                    </div>
                    
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
                        {appointment.date} at {appointment.time}
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
                        {appointment.location}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid #333',
                  }}>
                    <button style={{
                      padding: '8px 16px',
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
                      View Details
                    </button>
                    <button style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid #555',
                      borderRadius: '8px',
                      color: '#9CA3AF',
                      fontSize: '14px',
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
                    }}>
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}