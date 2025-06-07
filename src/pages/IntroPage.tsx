import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Users, Camera, Star, ArrowRight, Play } from 'lucide-react'
import Button from '../components/ui/Button'
import { designTokens } from '../design-system/tokens'

const features = [
  {
    icon: Heart,
    title: 'Share Pet Moments',
    description: 'Capture and share your pet\'s cutest moments with a community that truly understands.',
    color: designTokens.colors.error[500],
  },
  {
    icon: Users,
    title: 'Connect with Pet Lovers',
    description: 'Meet fellow pet parents, share experiences, and build lasting friendships.',
    color: designTokens.colors.primary[500],
  },
  {
    icon: Camera,
    title: 'Professional Pet Photography',
    description: 'Get tips from professional photographers and showcase your pet\'s personality.',
    color: designTokens.colors.success[500],
  },
  {
    icon: Star,
    title: 'Expert Pet Care Tips',
    description: 'Access veterinary advice, training tips, and wellness guides from certified experts.',
    color: designTokens.colors.warning[500],
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'PetoGram helped me connect with amazing pet parents in my area. My dog Max has made so many new friends!',
    pets: 'with Max & Luna',
  },
  {
    name: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'The expert tips and community support have been invaluable for training my rescue puppy. Highly recommend!',
    pets: 'with Buddy',
  },
  {
    name: 'Emma Wilson',
    avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    text: 'I love sharing my cats\' adventures here. The photography tips helped me capture their personalities perfectly!',
    pets: 'with Whiskers & Shadow',
  },
]

export default function IntroPage() {
  const navigate = useNavigate()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${designTokens.colors.primary[50]} 0%, ${designTokens.colors.white} 50%, ${designTokens.colors.success[50]} 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: `linear-gradient(45deg, ${designTokens.colors.primary[200]}, ${designTokens.colors.primary[300]})`,
        borderRadius: '50%',
        opacity: 0.3,
        animation: 'float 6s ease-in-out infinite',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: `linear-gradient(45deg, ${designTokens.colors.success[200]}, ${designTokens.colors.success[300]})`,
        borderRadius: '50%',
        opacity: 0.2,
        animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* Header */}
      <header style={{
        padding: `${designTokens.spacing[6]} ${designTokens.spacing[8]}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[3] }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
            borderRadius: designTokens.borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: designTokens.boxShadow.lg,
          }}>
            <Heart size={24} color={designTokens.colors.white} fill="currentColor" />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize['3xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
            background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            PetoGram
          </h1>
        </div>

        <div style={{ display: 'flex', gap: designTokens.spacing[3] }}>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/login')}
            style={{ minWidth: '100px' }}
          >
            Login
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/signup')}
            style={{ minWidth: '100px' }}
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        padding: `${designTokens.spacing[16]} ${designTokens.spacing[8]}`,
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            margin: `0 0 ${designTokens.spacing[6]} 0`,
            fontSize: designTokens.typography.fontSize['5xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            color: designTokens.colors.gray[900],
            lineHeight: designTokens.typography.lineHeight.tight,
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
          }}>
            Where Pet Love
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.error[500]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Comes to Life
            </span>
          </h2>

          <p style={{
            margin: `0 0 ${designTokens.spacing[8]} 0`,
            fontSize: designTokens.typography.fontSize.xl,
            color: designTokens.colors.gray[600],
            lineHeight: designTokens.typography.lineHeight.relaxed,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Join millions of pet parents sharing moments, getting expert advice, and building a community 
            that celebrates the unconditional love of our furry, feathered, and scaled friends.
          </p>

          <div style={{
            display: 'flex',
            gap: designTokens.spacing[4],
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate('/signup')}
              style={{
                padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
                fontSize: designTokens.typography.fontSize.lg,
                fontWeight: designTokens.typography.fontWeight.semibold,
                boxShadow: designTokens.boxShadow.xl,
              }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </Button>

            <Button 
              variant="ghost" 
              size="lg"
              style={{
                padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
                fontSize: designTokens.typography.fontSize.lg,
                color: designTokens.colors.gray[700],
              }}
            >
              <Play size={20} />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: designTokens.spacing[12],
            marginTop: designTokens.spacing[16],
            flexWrap: 'wrap',
          }}>
            {[
              { number: '2M+', label: 'Pet Parents' },
              { number: '50K+', label: 'Daily Posts' },
              { number: '1M+', label: 'Pet Photos' },
              { number: '24/7', label: 'Expert Support' },
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: designTokens.typography.fontSize['3xl'],
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.primary[600],
                  marginBottom: designTokens.spacing[1],
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: designTokens.typography.fontSize.sm,
                  color: designTokens.colors.gray[500],
                  fontWeight: designTokens.typography.fontWeight.medium,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section style={{
        padding: `${designTokens.spacing[20]} ${designTokens.spacing[8]}`,
        backgroundColor: designTokens.colors.white,
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[16] }}>
            <h3 style={{
              margin: `0 0 ${designTokens.spacing[4]} 0`,
              fontSize: designTokens.typography.fontSize['4xl'],
              fontWeight: designTokens.typography.fontWeight.bold,
              color: designTokens.colors.gray[900],
              fontFamily: designTokens.typography.fontFamily.display.join(', '),
            }}>
              Everything You Need for Your Pet Journey
            </h3>
            <p style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.lg,
              color: designTokens.colors.gray[600],
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              From sharing precious moments to getting expert advice, PetoGram is your complete pet companion.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: designTokens.spacing[8],
          }}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} style={{
                  padding: designTokens.spacing[8],
                  backgroundColor: designTokens.colors.white,
                  borderRadius: designTokens.borderRadius['3xl'],
                  border: `1px solid ${designTokens.colors.gray[100]}`,
                  boxShadow: designTokens.boxShadow.lg,
                  textAlign: 'center',
                  transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.boxShadow = designTokens.boxShadow.xl
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = designTokens.boxShadow.lg
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: `${feature.color}15`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: `0 auto ${designTokens.spacing[6]}`,
                  }}>
                    <IconComponent size={32} color={feature.color} />
                  </div>
                  <h4 style={{
                    margin: `0 0 ${designTokens.spacing[3]} 0`,
                    fontSize: designTokens.typography.fontSize.xl,
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: designTokens.colors.gray[900],
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: designTokens.typography.fontSize.base,
                    color: designTokens.colors.gray[600],
                    lineHeight: designTokens.typography.lineHeight.relaxed,
                  }}>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{
        padding: `${designTokens.spacing[20]} ${designTokens.spacing[8]}`,
        backgroundColor: designTokens.colors.gray[50],
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{
            margin: `0 0 ${designTokens.spacing[16]} 0`,
            fontSize: designTokens.typography.fontSize['4xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            color: designTokens.colors.gray[900],
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
          }}>
            Loved by Pet Parents Everywhere
          </h3>

          <div style={{
            backgroundColor: designTokens.colors.white,
            borderRadius: designTokens.borderRadius['3xl'],
            padding: designTokens.spacing[12],
            boxShadow: designTokens.boxShadow.xl,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{
                opacity: index === currentTestimonial ? 1 : 0,
                transform: index === currentTestimonial ? 'translateX(0)' : 'translateX(100%)',
                transition: `all ${designTokens.animation.duration.slow} ${designTokens.animation.easing.ease}`,
                position: index === currentTestimonial ? 'relative' : 'absolute',
                top: index === currentTestimonial ? 'auto' : 0,
                left: index === currentTestimonial ? 'auto' : 0,
                right: index === currentTestimonial ? 'auto' : 0,
              }}>
                <img 
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: `0 auto ${designTokens.spacing[6]}`,
                    border: `4px solid ${designTokens.colors.primary[100]}`,
                  }}
                />
                <p style={{
                  margin: `0 0 ${designTokens.spacing[6]} 0`,
                  fontSize: designTokens.typography.fontSize.xl,
                  color: designTokens.colors.gray[700],
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  fontStyle: 'italic',
                }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.lg,
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: designTokens.colors.gray[900],
                    marginBottom: designTokens.spacing[1],
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.gray[500],
                  }}>
                    {testimonial.pets}
                  </div>
                </div>
              </div>
            ))}

            {/* Testimonial Indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: designTokens.spacing[2],
              marginTop: designTokens.spacing[8],
            }}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: index === currentTestimonial 
                      ? designTokens.colors.primary[500] 
                      : designTokens.colors.gray[300],
                    cursor: 'pointer',
                    transition: `background-color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: `${designTokens.spacing[20]} ${designTokens.spacing[8]}`,
        background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
        color: designTokens.colors.white,
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{
            margin: `0 0 ${designTokens.spacing[6]} 0`,
            fontSize: designTokens.typography.fontSize['4xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
          }}>
            Ready to Join the Pack?
          </h3>
          <p style={{
            margin: `0 0 ${designTokens.spacing[8]} 0`,
            fontSize: designTokens.typography.fontSize.xl,
            opacity: 0.9,
            lineHeight: designTokens.typography.lineHeight.relaxed,
          }}>
            Start sharing your pet's story today and connect with a community that gets it.
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/signup')}
            style={{
              padding: `${designTokens.spacing[4]} ${designTokens.spacing[8]}`,
              fontSize: designTokens.typography.fontSize.lg,
              fontWeight: designTokens.typography.fontWeight.semibold,
              backgroundColor: designTokens.colors.white,
              color: designTokens.colors.primary[600],
              boxShadow: designTokens.boxShadow.xl,
            }}
          >
            Create Your Free Account
            <ArrowRight size={20} />
          </Button>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}