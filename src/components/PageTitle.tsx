import React from 'react';
import { ShareButton } from './ShareButton';

interface Props {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: Props) {
  return (
    <div className="page-header">
      <h1 className="page-title">{title}</h1>
      <ShareButton title={title} />
      {subtitle && <div className="page-subtitle">{subtitle}</div>}
    </div>
  );
}