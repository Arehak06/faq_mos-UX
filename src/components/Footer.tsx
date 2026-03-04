import React from 'react';
import { Link } from 'react-router-dom';
import { PageData } from '../types/page';

interface FooterProps {
  pages: Record<string, PageData> | null;
}

export function Footer({ pages }: FooterProps) {
  const homePage = pages?.['home'];
  const settings = homePage?.footerSettings;

  // Если подвал отключён, не показываем ничего
  if (settings && !settings.enabled) return null;

  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} Транспорт Москвы. Все права защищены.`;
  const copyright = settings?.copyrightText || defaultCopyright;
  const links = settings?.links || [];

  return (
    <footer className="footer">
      <div className="footer-content">
        {links.length > 0 && (
          <div className="footer-links">
            {links.map((link, idx) => (
              <Link key={idx} to={link.url}>
                {link.text}
              </Link>
            ))}
          </div>
        )}
        <div className="footer-copyright">{copyright}</div>
      </div>
    </footer>
  );
}