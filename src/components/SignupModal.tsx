import React, { useState, useRef } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePetTypeSelect = (petType: string) => {
    setSelectedPetType(petType);
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

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPets = petTypes.slice(startIndex, endIndex);

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
        maxWidth: '420px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '20px',
        position: 'relative',
        color: '#fff',
        boxSizing: 'border-box',
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        {step === 1 && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: '15px',
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              margin: '0',
            }}>
              Create your account
            </h2>
          </div>
        )}

        {/* Content based on step */}
        {step === 1 && (
          <div>
            <div style={{
              marginBottom: '8px',
              marginTop: '10px',
            }}>
              <label htmlFor="username" style={{ display: 'block', color: '#e0e0e0', marginBottom: '3px', fontSize: '12px' }}>Username</label>
              <input 
                type="text" 
                id="username" 
                placeholder="Username" 
                maxLength={50}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #363636',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ textAlign: 'right', fontSize: '10px', color: '#8e8e8e', marginTop: '3px' }}>0 / 50</div>
            </div>

            <div style={{
              marginBottom: '8px',
            }}>
              <label htmlFor="email" style={{ display: 'block', color: '#e0e0e0', marginBottom: '3px', fontSize: '12px' }}>Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Email" 
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #363636',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{
              marginBottom: '8px',
            }}>
              <label htmlFor="password" style={{ display: 'block', color: '#e0e0e0', marginBottom: '3px', fontSize: '12px' }}>Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Password" 
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #363636',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{
              marginBottom: '12px',
            }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', color: '#e0e0e0', marginBottom: '3px', fontSize: '12px' }}>Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirm Password" 
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #363636',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '10px 15px',
                backgroundColor: '#8e8e8e',
                color: '#000',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              margin: '0 0 15px 0',
              textAlign: 'center',
            }}>
              Tell us about your pet
            </h2>

            <div style={{
              border: '1px solid #363636',
              borderRadius: '8px',
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
                  padding: '5px',
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
                      boxShadow: selectedPetType === petType ? '0 0 10px rgba(0, 149, 246, 0.5)' : 'none',
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
                  padding: '5px',
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div style={{
              marginBottom: '12px',
            }}>
              <label htmlFor="petName" style={{ display: 'block', color: '#e0e0e0', marginBottom: '4px', fontSize: '12px' }}>Pet Name</label>
              <input 
                type="text" 
                id="petName" 
                placeholder="Pet's Name" 
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #363636',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
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
                  <span style={{ color: '#8e8e8e', fontSize: '10px', textAlign: 'center', padding: '5px' }}>Upload pet pic</span>
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

              <div style={{
                flexGrow: 1,
              }}>
                <label htmlFor="aboutPet" style={{ display: 'block', color: '#e0e0e0', marginBottom: '4px', fontSize: '12px' }}>About pet</label>
                <textarea 
                  id="aboutPet" 
                  placeholder="Tell us about your pet..." 
                  rows={4}
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
              onClick={onConfirm}
              style={{
                width: '100%',
                padding: '10px 15px',
                backgroundColor: '#0095f6',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupModal;