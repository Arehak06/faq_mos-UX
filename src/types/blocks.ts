export type TextBlock = {
  id: string;
  type: 'text';
  text: string;
};

export type CardBlock = {
  id: string;
  type: 'card';
  title: string;
  text: string;
};

export type ButtonBlock = {
  id: string;
  type: 'button';
  text: string;
  url: string;
};

export type ImageBlock = {
  id: string;
  type: 'image';
  url: string;
  alt?: string;
  caption?: string;
};

export type Block = TextBlock | CardBlock | ButtonBlock | ImageBlock;