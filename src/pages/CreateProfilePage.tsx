import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Camera, 
  Upload, 
  MapPin, 
  Calendar, 
  Heart, 
  User, 
  Phone, 
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Plus,
  X,
  CheckCircle
} from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { designTokens } from '../design-system/tokens'

const petTypes = [
  { id: 'dog', name: 'Dog', emoji: '🐕' },
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'bird', name: 'Bird', emoji: '🐦' },
  { id: 'fish', name: 'Fish', emoji: '🐠' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
  { id: 'hamster', name: 'Hamster', emoji: '🐹' },
  { id: 'reptile', name: 'Reptile', emoji: '🦎' },
  { id: 'other', name: 'Other', emoji: '🐾' },
]

const interests = [
  'Pet Photography', 'Dog Training', 'Cat Care', 'Veterinary Advice',
  'Pet Grooming', 'Animal Rescue', 'Pet Travel', 'Pet Nutrition',
  'Puppy Training', 'Senior Pet Care', 'Pet Health', 'Pet Behavior',
  'Pet Events', 'Pet Products', 'Pet Insurance', 'Pet Sitting'
]

export default function CreateProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [profileData, setProfileData] = useState({
    profilePicture: '',
    username: '',
    bio: '',
    location: '',
    birthDate: '',
    phone: '',
    website: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: '',
    },
    pets: [] as Array<{
      id: string
      name: string
      type: string
      breed: string
      age: string
      photo: string
    }>,
    interests: [] as string[],
    isPublic: true,
    allowMessages: true,
    showEmail: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialMedia: { ...prev.socialMedia, [platform]: value }
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addPet = () => {
    const newPet = {
      id: Date.now().toString(),
      name: '',
      type: '',
      breed: '',
      age: '',
      photo: ''
    }
    setProfileData(prev => ({ ...prev, pets: [...prev.pets, newPet] }))
  }

  const updatePet = (id: string, field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      pets: prev.pets.map(pet => 
        pet.id === id ? { ...pet, [field]: value } : pet
      )
    }))
  }

  const removePet = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      pets: prev.pets.filter(pet => pet.id !== id)
    }))
  }

  const toggleInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      localStorage.removeItem('tempUserData')
      navigate('/')
    }, 2000)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: designTokens.spacing[4],
      marginBottom: designTokens.spacing[8],
    }}>
      {[1, 2, 3, 4].map((step) => (
        <React.Fragment key={step}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: step <= currentStep 
              ? designTokens.colors.primary[500] 
              : designTokens.colors.gray[200],
            color: step <= currentStep 
              ? designTokens.colors.white 
              : designTokens.colors.gray[500],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: designTokens.typography.fontWeight.semibold,
            fontSize: designTokens.typography.fontSize.sm,
            transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          }}>
            {step < currentStep ? <CheckCircle size={20} /> : step}
          </div>
          {step < 4 && (
            <div style={{
              width: '60px',
              height: '2px',
              backgroundColor: step < currentStep 
                ? designTokens.colors.primary[500] 
                : designTokens.colors.gray[200],
              transition: `background-color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[8] }}>
        <h2 style={{
          margin: `0 0 ${designTokens.spacing[2]} 0`,
          fontSize: designTokens.typography.fontSize['2xl'],
          fontWeight: designTokens.typography.fontWeight.bold,
          color: designTokens.colors.gray[900],
        }}>
          Basic Information
        </h2>
        <p style={{
          margin: 0,
          fontSize: designTokens.typography.fontSize.base,
          color: designTokens.colors.gray[600],
        }}>
          Let's start with your basic profile information
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: designTokens.spacing[8],
      }}>
        <div style={{
          position: 'relative',
          marginBottom: designTokens.spacing[4],
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: designTokens.colors.gray[100],
            border: `3px solid ${designTokens.colors.primary[200]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => fileInputRef.current?.click()}>
            {profileData.profilePicture ? (
              <img 
                src={profileData.profilePicture}
                alt="Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Camera size={32} color={designTokens.colors.gray[400]} />
            )}
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: designTokens.colors.primary[500],
              color: designTokens.colors.white,
              border: `3px solid ${designTokens.colors.white}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: designTokens.boxShadow.md,
            }}
          >
            <Upload size={16} />
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        
        <p style={{
          fontSize: designTokens.typography.fontSize.sm,
          color: designTokens.colors.gray[500],
          textAlign: 'center',
        }}>
          Click to upload your profile picture
        </p>
      </div>

      {/* Form Fields */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: designTokens.spacing[6],
      }}>
        <Input
          label="Username"
          type="text"
          value={profileData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          placeholder="Choose a unique username"
          leftIcon={<User size={20} />}
          fullWidth
        />

        <Input
          label="Phone Number"
          type="tel"
          value={profileData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="Your phone number"
          leftIcon={<Phone size={20} />}
          fullWidth
        />

        <Input
          label="Location"
          type="text"
          value={profileData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="City, Country"
          leftIcon={<MapPin size={20} />}
          fullWidth
        />

        <Input
          label="Birth Date"
          type="date"
          value={profileData.birthDate}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          leftIcon={<Calendar size={20} />}
          fullWidth
        />
      </div>

      <div style={{ marginTop: designTokens.spacing[6] }}>
        <label style={{
          display: 'block',
          marginBottom: designTokens.spacing[2],
          fontSize: designTokens.typography.fontSize.sm,
          fontWeight: designTokens.typography.fontWeight.medium,
          color: designTokens.colors.gray[700],
        }}>
          Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself and your pets..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: designTokens.spacing[3],
            border: `1px solid ${designTokens.colors.gray[200]}`,
            borderRadius: designTokens.borderRadius.xl,
            fontSize: designTokens.typography.fontSize.base,
            fontFamily: designTokens.typography.fontFamily.sans.join(', '),
            resize: 'vertical',
            outline: 'none',
            transition: `border-color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = designTokens.colors.primary[500]
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = designTokens.colors.gray[200]
          }}
        />
      </div>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[8] }}>
        <h2 style={{
          margin: `0 0 ${designTokens.spacing[2]} 0`,
          fontSize: designTokens.typography.fontSize['2xl'],
          fontWeight: designTokens.typography.fontWeight.bold,
          color: designTokens.colors.gray[900],
        }}>
          Social Links
        </h2>
        <p style={{
          margin: 0,
          fontSize: designTokens.typography.fontSize.base,
          color: designTokens.colors.gray[600],
        }}>
          Connect your social media accounts (optional)
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: designTokens.spacing[6],
      }}>
        <Input
          label="Website"
          type="url"
          value={profileData.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://yourwebsite.com"
          leftIcon={<Globe size={20} />}
          fullWidth
        />

        <Input
          label="Instagram"
          type="text"
          value={profileData.socialMedia.instagram}
          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
          placeholder="@yourusername"
          leftIcon={<Instagram size={20} />}
          fullWidth
        />

        <Input
          label="Twitter"
          type="text"
          value={profileData.socialMedia.twitter}
          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
          placeholder="@yourusername"
          leftIcon={<Twitter size={20} />}
          fullWidth
        />

        <Input
          label="Facebook"
          type="text"
          value={profileData.socialMedia.facebook}
          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
          placeholder="facebook.com/yourprofile"
          leftIcon={<Facebook size={20} />}
          fullWidth
        />
      </div>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[8] }}>
        <h2 style={{
          margin: `0 0 ${designTokens.spacing[2]} 0`,
          fontSize: designTokens.typography.fontSize['2xl'],
          fontWeight: designTokens.typography.fontWeight.bold,
          color: designTokens.colors.gray[900],
        }}>
          Your Pets
        </h2>
        <p style={{
          margin: 0,
          fontSize: designTokens.typography.fontSize.base,
          color: designTokens.colors.gray[600],
        }}>
          Tell us about your furry, feathered, or scaled friends
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: designTokens.spacing[6],
      }}>
        {profileData.pets.map((pet) => (
          <Card key={pet.id} style={{ position: 'relative' }}>
            <button
              onClick={() => removePet(pet.id)}
              style={{
                position: 'absolute',
                top: designTokens.spacing[3],
                right: designTokens.spacing[3],
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: designTokens.colors.error[100],
                color: designTokens.colors.error[600],
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = designTokens.colors.error[200]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = designTokens.colors.error[100]
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: designTokens.spacing[4],
            }}>
              <Input
                label="Pet Name"
                type="text"
                value={pet.name}
                onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
                placeholder="What's your pet's name?"
                fullWidth
              />

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: designTokens.spacing[2],
                  fontSize: designTokens.typography.fontSize.sm,
                  fontWeight: designTokens.typography.fontWeight.medium,
                  color: designTokens.colors.gray[700],
                }}>
                  Pet Type
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: designTokens.spacing[2],
                }}>
                  {petTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updatePet(pet.id, 'type', type.id)}
                      style={{
                        padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                        borderRadius: designTokens.borderRadius.lg,
                        border: `1px solid ${pet.type === type.id ? designTokens.colors.primary[500] : designTokens.colors.gray[200]}`,
                        backgroundColor: pet.type === type.id ? designTokens.colors.primary[50] : designTokens.colors.white,
                        color: pet.type === type.id ? designTokens.colors.primary[700] : designTokens.colors.gray[600],
                        fontSize: designTokens.typography.fontSize.sm,
                        fontWeight: designTokens.typography.fontWeight.medium,
                        cursor: 'pointer',
                        transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: designTokens.spacing[1],
                      }}
                    >
                      <span>{type.emoji}</span>
                      <span>{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Breed"
                type="text"
                value={pet.breed}
                onChange={(e) => updatePet(pet.id, 'breed', e.target.value)}
                placeholder="What breed?"
                fullWidth
              />

              <Input
                label="Age"
                type="text"
                value={pet.age}
                onChange={(e) => updatePet(pet.id, 'age', e.target.value)}
                placeholder="How old?"
                fullWidth
              />
            </div>
          </Card>
        ))}

        <Button
          variant="secondary"
          onClick={addPet}
          style={{
            padding: designTokens.spacing[4],
            border: `2px dashed ${designTokens.colors.gray[300]}`,
            backgroundColor: 'transparent',
          }}
        >
          <Plus size={20} />
          Add Another Pet
        </Button>
      </div>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <div style={{ textAlign: 'center', marginBottom: designTokens.spacing[8] }}>
        <h2 style={{
          margin: `0 0 ${designTokens.spacing[2]} 0`,
          fontSize: designTokens.typography.fontSize['2xl'],
          fontWeight: designTokens.typography.fontWeight.bold,
          color: designTokens.colors.gray[900],
        }}>
          Interests & Privacy
        </h2>
        <p style={{
          margin: 0,
          fontSize: designTokens.typography.fontSize.base,
          color: designTokens.colors.gray[600],
        }}>
          Choose your interests and privacy settings
        </p>
      </div>

      {/* Interests */}
      <div style={{ marginBottom: designTokens.spacing[8] }}>
        <h3 style={{
          margin: `0 0 ${designTokens.spacing[4]} 0`,
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold,
          color: designTokens.colors.gray[900],
        }}>
          What are you interested in?
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: designTokens.spacing[2],
        }}>
          {interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              style={{
                padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
                borderRadius: designTokens.borderRadius.full,
                border: `1px solid ${profileData.interests.includes(interest) ? designTokens.colors.primary[500] : designTokens.colors.gray[200]}`,
                backgroundColor: profileData.interests.includes(interest) ? designTokens.colors.primary[50] : designTokens.colors.white,
                color: profileData.interests.includes(interest) ? designTokens.colors.primary[700] : designTokens.colors.gray[600],
                fontSize: designTokens.typography.fontSize.sm,
                fontWeight: designTokens.typography.fontWeight.medium,
                cursor: 'pointer',
                transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h3 style={{
          margin: `0 0 ${designTokens.spacing[4]} 0`,
          fontSize: designTokens.typography.fontSize.lg,
          fontWeight: designTokens.typography.fontWeight.semibold,
          color: designTokens.colors.gray[900],
        }}>
          Privacy Settings
        </h3>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: designTokens.spacing[4],
        }}>
          {[
            { key: 'isPublic', label: 'Make my profile public', description: 'Anyone can see your profile and posts' },
            { key: 'allowMessages', label: 'Allow messages from other users', description: 'Other users can send you direct messages' },
            { key: 'showEmail', label: 'Show my email on profile', description: 'Your email will be visible to other users' },
          ].map((setting) => (
            <label key={setting.key} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: designTokens.spacing[3],
              padding: designTokens.spacing[4],
              backgroundColor: designTokens.colors.gray[50],
              borderRadius: designTokens.borderRadius.xl,
              cursor: 'pointer',
            }}>
              <input
                type="checkbox"
                checked={profileData[setting.key as keyof typeof profileData] as boolean}
                onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: designTokens.colors.primary[500],
                  marginTop: '2px',
                }}
              />
              <div>
                <div style={{
                  fontSize: designTokens.typography.fontSize.base,
                  fontWeight: designTokens.typography.fontWeight.medium,
                  color: designTokens.colors.gray[900],
                  marginBottom: designTokens.spacing[1],
                }}>
                  {setting.label}
                </div>
                <div style={{
                  fontSize: designTokens.typography.fontSize.sm,
                  color: designTokens.colors.gray[600],
                }}>
                  {setting.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </Card>
  )

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: designTokens.colors.gray[50],
      padding: designTokens.spacing[8],
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: designTokens.spacing[12],
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${designTokens.spacing[6]}`,
            boxShadow: designTokens.boxShadow.xl,
          }}>
            <Heart size={32} color={designTokens.colors.white} fill="currentColor" />
          </div>
          
          <h1 style={{
            margin: `0 0 ${designTokens.spacing[2]} 0`,
            fontSize: designTokens.typography.fontSize['4xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
            background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Create Your Profile
          </h1>
          <p style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.lg,
            color: designTokens.colors.gray[600],
          }}>
            Let's set up your PetoGram profile to connect with other pet lovers
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div style={{ marginBottom: designTokens.spacing[8] }}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
            style={{ minWidth: '120px' }}
          >
            Previous
          </Button>

          <div style={{
            fontSize: designTokens.typography.fontSize.sm,
            color: designTokens.colors.gray[500],
            fontWeight: designTokens.typography.fontWeight.medium,
          }}>
            Step {currentStep} of 4
          </div>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={nextStep}
              style={{ minWidth: '120px' }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isLoading}
              style={{ minWidth: '120px' }}
            >
              {isLoading ? 'Creating...' : 'Complete Profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}