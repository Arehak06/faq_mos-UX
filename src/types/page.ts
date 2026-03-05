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
  featured?: boolean;            // закреплена ли страница на главной
  mainTitle?: string;            // заголовок главной страницы (только для home)
  sectionTitle?: string;         // заголовок раздела со страницами (только для home)
  footerSettings?: FooterSettings; 
  order?: number;
  maintenanceMode?: boolean;
  maintenanceImage?: string;
  accessToken?: string;   // случайный токен
  accessEnabled?: boolean; // включена ли защита
  inviteToken?: string;
};