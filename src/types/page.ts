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
  createdAt?: string;      // ISO дата создания
  updatedAt?: string;      // ISO дата последнего изменения
  createdBy?: string;      // имя пользователя (или id) создателя
  updatedBy?: string;      // имя пользователя (или id) последнего редактора
  description?: string;    // подзаголовок для главного меню
  emoji?: string;          // эмодзи для отображения в меню
};