// src/components/common/RabbitMascot.jsx

import React from 'react';

export default function RabbitMascot({ size = 32, mood = 'happy' }) {
  const moods = {
    happy: '😊',
    determined: '😤',
    celebration: '🎉',
    sad: '😢',
    excited: '🤩'
  };

  const emoji = moods[mood] || moods.happy;

  return (
    <div 
      className="rabbit-mascot"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.8,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
        color: '#fff',
        userSelect: 'none'
      }}
    >
      {emoji}
    </div>
  );
}