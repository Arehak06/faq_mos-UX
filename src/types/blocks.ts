export type TextBlock = {
  id: string;
  type: 'text';
  text: string;      // исходный YFM
  html?: string;     // сгенерированный HTML (заполняется сервером)
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
  icon?: string;
  backgroundImage?: string;
  description?: string;
};

export type ImageBlock = {
  id: string;
  type: 'image';
  url: string;
  alt?: string;
  caption?: string;
};

export type AlertBlock = {
  id: string;
  type: 'alert';
  text: string;
  severity: 'info' | 'warning' | 'important'; // тип уведомления
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
};

export type Block = TextBlock | CardBlock | ButtonBlock | ImageBlock | AlertBlock;