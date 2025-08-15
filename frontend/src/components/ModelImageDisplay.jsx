import React, { useState } from 'react';
import './ModelImageDisplay.css';

const ModelImageDisplay = ({ 
  imageUrl, 
  height = '80vh', 
  shadow = true, 
  rotation = true,
  className = '' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`model-image-wrapper ${className}`}>
      <div className="image-container">
        <img
          src={imageUrl}
          alt="Product Model"
          className={`product-model-image ${isLoaded ? 'loaded' : ''}`}
          style={{ height }}
          onLoad={handleImageLoad}
        />
        {shadow && <div className="floor-shadow"></div>}
      </div>
    </div>
  );
};

export default ModelImageDisplay; 