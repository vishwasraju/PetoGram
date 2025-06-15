import React, { useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { registerUser, createUserProfile, createUserPets, setAuthenticationState } from '../utils/auth'
import { supabase } from '../utils/supabase'

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const petTypes = ['dog', 'cat', 'cow', 'pig', 'horse', 'tortoise', 'sheep', 'yak']
const itemsPerPage = 3

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [step, setStep] = useState(1); // 1: Account creation, 2: Pet information
  const [selectedPetType, setSelectedPetType] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // For the pet type slider
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    petName: '',
    aboutPet: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 2) {
      newErrors.username = 'Username must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedPetType) {
      newErrors.petType = 'Please select a pet type';
    }

    if (!formData.petName.trim()) {
      newErrors.petName = 'Pet name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    console.log('handleNext called, current step:', step);
    
    if (step === 1) {
      if (!validateStep1()) {
        console.log('Step 1 validation failed:', errors);
        return;
      }

      setIsLoading(true);
      setErrors({});
      
      try {
        console.log('Attempting to register user...');
        
        const { user, error } = await registerUser({
          fullName: formData.username,
          email: formData.email,
          password: formData.password
        });

        if (error || !user) {
          console.log('Registration error:', error);
          setErrors({ general: error || 'Registration failed. Please try again.' });
          setIsLoading(false);
          return;
        }

        console.log('Registration successful, user:', user.id);
        setRegisteredUserId(user.id);

        setIsLoading(false);
        
        // Move to step 2 after successful registration
        console.log('Moving to step 2...');
        setStep(2);
        
      } catch (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        setErrors({ general: 'An error occurred during registration. Please try again.' });
      }
    } else if (step === 2) {
      // This is now the actual confirmation for step 2
      handleConfirm();
    }
  };

  const handlePetTypeSelect = (petType: string) => {
    setSelectedPetType(petType);
    // Clear pet type error when user selects a pet
    if (errors.petType) {
      setErrors(prev => ({ ...prev, petType: '' }));
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(petTypes.length / itemsPerPage) - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirm = async () => {
    if (!validateStep2()) {
      console.log('Step 2 validation failed:', errors);
      return;
    }

    if (!registeredUserId) {
      setErrors({ general: 'User not registered. Please go back to Step 1.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Attempting to create user profile and pet...');

      // Create user profile
      await createUserProfile({
        user_id: registeredUserId,
        username: formData.username,
        bio: formData.bio,
        profile_picture: '',
        location: '',
        phone: '',
        website: '',
        social_media: {
          instagram: '',
          twitter: '',
          facebook: '',
        },
        interests: [],
        is_public: true,
        show_email: false,
      });

      // Create user pet
      await createUserPets(registeredUserId, [
        {
          name: formData.petName,
          type: selectedPetType || '',
          breed: '',
          age: '',
          photo: uploadedImage || '',
        },
      ]);

      // Set authentication state after successful profile and pet creation
      setAuthenticationState({
        id: registeredUserId,
        email: formData.email,
        user_metadata: {
          full_name: formData.username,
        },
      });

      setIsLoading(false);
      onConfirm();

    } catch (error) {
      console.error('Profile/Pet creation error:', error);
      setIsLoading(false);
      setErrors({ general: 'An error occurred during profile/pet creation.' });
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setStep(1);
    setSelectedPetType(null);
    setCurrentPage(0);
    setUploadedImage(null);
    setRegisteredUserId(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      petName: '',
      aboutPet: '',
      bio: '',
    });
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = petTypes.slice(startIndex, endIndex);

  console.log('Rendering SignupModal, current step:', step, 'isLoading:', isLoading);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#000',
        borderRadius: '16px',
        width: '100%',
        maxWidth: step === 1 ? '360px' : '420px', // Smaller widths
        maxHeight: '85vh', // Reduced height
        overflowY: 'auto',
        padding: '16px', // Reduced padding
        position: 'relative',
        color: '#fff',
        boxSizing: 'border-box',
        transition: 'max-width 0.3s ease',
      }}>
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 10,
          }}
        >
          <X size={18} />
        </button>
        
        {/* Step Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          marginTop: '12px',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: step >= 1 ? '#0095f6' : '#363636',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
          }}>
            1
          </div>
          <div style={{
            width: '30px',
            height: '2px',
            backgroundColor: step >= 2 ? '#0095f6' : '#363636',
          }} />
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: step >= 2 ? '#0095f6' : '#363636',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
          }}>
            2
          </div>
        </div>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            margin: '0',
          }}>
            {step === 1 ? 'Create your account' : 'Tell us about your pet'}
          </h2>
          <p style={{
            fontSize: '11px',
            color: '#8e8e8e',
            margin: '4px 0 0 0',
          }}>
            {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div style={{
            padding: '8px',
            backgroundColor: '#ff4444',
            borderRadius: '4px',
            marginBottom: '12px',
            fontSize: '11px',
            textAlign: 'center',
          }}>
            {errors.general}
          </div>
        )}

        {/* Step 1: Account Creation */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                maxLength={50}
                value={formData.username}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.username ? '#ff4444' : '#363636'}`,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.username && (
                <div style={{ color: '#ff4444', fontSize: '9px', marginTop: '2px' }}>
                  {errors.username}
                </div>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.email ? '#ff4444' : '#363636'}`,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.email && (
                <div style={{ color: '#ff4444', fontSize: '9px', marginTop: '2px' }}>
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.password ? '#ff4444' : '#363636'}`,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.password && (
                <div style={{ color: '#ff4444', fontSize: '9px', marginTop: '2px' }}>
                  {errors.password}
                </div>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.confirmPassword ? '#ff4444' : '#363636'}`,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.confirmPassword && (
                <div style={{ color: '#ff4444', fontSize: '9px', marginTop: '2px' }}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: isLoading ? '#666' : '#0095f6',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Creating Account...' : 'Next'}
            </button>
          </form>
        )}

        {/* Step 2: Pet Information */}
        {step === 2 && (
          <div>
            <div style={{
              border: '1px solid #363636',
              borderRadius: '6px',
              padding: '6px 10px',
              marginBottom: '12px',
              backgroundColor: '#1a1a1a',
            }}>
              <h3 style={{
                textAlign: 'center',
                width: '100%',
                color: '#e0e0e0',
                fontSize: '14px',
                fontWeight: 'bold',
                margin: 0,
              }}>
                Choose your pet
              </h3>
            </div>

            {/* Pet Type Error */}
            {errors.petType && (
              <div style={{
                color: '#ff4444',
                fontSize: '10px',
                textAlign: 'center',
                marginBottom: '8px',
                padding: '4px',
                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                borderRadius: '4px',
              }}>
                {errors.petType}
              </div>
            )}

            <div style={{
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <button
                onClick={handlePrevPage} 
                disabled={currentPage === 0}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  color: '#8e8e8e',
                  opacity: currentPage === 0 ? 0.5 : 1,
                  transition: 'opacity 0.2s ease',
                  padding: '4px',
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                justifyItems: 'center',
                flexGrow: 1,
                margin: '0 8px',
              }}>
                {currentPets.map((petType) => (
                  <div
                    key={petType}
                    onClick={() => handlePetTypeSelect(petType)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: selectedPetType === petType ? '#0095f6' : '#1a1a1a',
                      border: `2px solid ${selectedPetType === petType ? '#0095f6' : '#363636'}`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedPetType === petType ? '0 0 12px rgba(0, 149, 246, 0.5)' : 'none',
                    }}
                  >
                    <img 
                      src={`/images/pets/${petType}.png`}
                      alt={petType}
                      style={{
                        width: '45px',
                        height: '45px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleNextPage} 
                disabled={currentPage === Math.ceil(petTypes.length / itemsPerPage) - 1}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: currentPage === Math.ceil(petTypes.length / itemsPerPage) - 1 ? 'not-allowed' : 'pointer',
                  color: '#8e8e8e',
                  opacity: currentPage === Math.ceil(petTypes.length / itemsPerPage) - 1 ? 0.5 : 1,
                  transition: 'opacity 0.2s ease',
                  padding: '4px',
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label htmlFor="petName" style={{ display: 'block', color: '#e0e0e0', marginBottom: '4px', fontSize: '11px' }}>Pet Name</label>
              <input 
                type="text" 
                id="petName" 
                name="petName"
                placeholder="Pet's Name" 
                value={formData.petName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: `1px solid ${errors.petName ? '#ff4444' : '#363636'}`,
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.petName && (
                <div style={{ color: '#ff4444', fontSize: '9px', marginTop: '2px' }}>
                  {errors.petName}
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              alignItems: 'flex-start',
            }}>
              <div 
                style={{
                  flexShrink: 0,
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: uploadedImage ? 'transparent' : '#363636',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #8e8e8e',
                  overflow: 'hidden',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease',
                }}
                onClick={handleUploadClick}
              >
                {uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded Pet" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <span style={{ color: '#8e8e8e', fontSize: '10px', textAlign: 'center' }}>Upload pic</span>
                )}
                <input 
                  type="file" 
                  id="petAvatar" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </div>

              <div style={{ flexGrow: 1 }}>
                <label htmlFor="aboutPet" style={{ display: 'block', color: '#e0e0e0', marginBottom: '4px', fontSize: '11px' }}>About pet</label>
                <textarea 
                  id="aboutPet" 
                  name="aboutPet"
                  placeholder="Tell us about your pet..." 
                  rows={4}
                  value={formData.aboutPet}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #363636',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: isLoading ? '#666' : '#0095f6',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupModal;