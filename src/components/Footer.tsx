import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/privacy">Политика конфиденциальности</Link>
          <Link to="/terms">Пользовательское соглашение</Link>
        </div>
        <div className="footer-copyright">
          © {currentYear} Транспорт Москвы. Все права защищены.
        </div>
      </div>
    </footer>
  );
}