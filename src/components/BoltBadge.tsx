import React, { useState, useEffect } from 'react';

const BoltBadge: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const badgeSize = isMobile ? 40 : 45;
  const topPosition = isMobile ? 80 : 70;

  return (
    <a 
      href="https://bolt.new" 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        top: topPosition,
        right: 16,
        zIndex: 9999,
        width: badgeSize,
        height: badgeSize,
        transition: 'width 0.3s ease, height 0.3s ease, top 0.3s ease',
      }}
    >
      <img 
        src="/white_circle_360x360.png" 
        alt="Powered by Bolt.New"
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </a>
  );
};

export default BoltBadge; 