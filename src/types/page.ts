import type { Block } from './blocks';

export type PageMainButton = {
  text: string;
  action: {
    type: 'link' | 'route';
    value: string;
  };
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
  parentId?: string; // ключ родительской страницы (опционально)
};