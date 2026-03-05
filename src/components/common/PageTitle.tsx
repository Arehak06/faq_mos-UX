import React from 'react';
import { ShareButton } from './ShareButton';

interface Props {
  title: string;
  subtitle?: string;
  showShare?: boolean;
}

export function PageTitle({ title, subtitle, showShare = true }: Props) {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      {showShare && <ShareButton title={title} />}
      {subtitle && <div className="page-subtitle">{subtitle}</div>}
    </div>
  );
}