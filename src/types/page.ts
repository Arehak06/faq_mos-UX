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
};