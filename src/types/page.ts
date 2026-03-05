import type { Block } from './blocks';

export type PageMainButton = {
  text: string;
  action: {
    type: 'link' | 'route';
    value: string;
  };
};

export type FooterLink = {
  text: string;
  url: string;
};

export type FooterSettings = {
  enabled: boolean;
  copyrightText: string;
  links: FooterLink[];
};


export type PageData = {
  id: string;
  title: string;
  blocks: Block[];
  mainButton?: PageMainButton;
  hidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  description?: string;
  emoji?: string;
  parentId?: string;
  featured?: boolean;
  mainTitle?: string;
  sectionTitle?: string;
  footerSettings?: FooterSettings;
  order?: number;
  maintenanceMode?: boolean;
  maintenanceImage?: string;   // активные приглашения
  inviteToken?: string;             // для обратной совместимости (если нужно)
};