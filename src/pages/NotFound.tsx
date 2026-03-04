import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">🧐</div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Страница не найдена</p>
        <button className="tg-button" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    </div>
  );
}