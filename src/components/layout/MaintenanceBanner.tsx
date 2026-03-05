import React from 'react';

interface Props {
  imageUrl?: string;
}

export function MaintenanceBanner({ imageUrl }: Props) {
  return (
    <div className="maintenance-banner">
      <div className="maintenance-content">
        {imageUrl ? (
          <img src={imageUrl} alt="Технические работы" className="maintenance-image" />
        ) : (
          <>
            <span className="maintenance-icon">🛠️</span>
            <span className="maintenance-text">Ведутся технические работы</span>
          </>
        )}
      </div>
    </div>
  );
}