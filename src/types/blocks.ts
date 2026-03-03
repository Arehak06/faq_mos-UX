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
  icon?: string;         // эмодзи или URL иконки
  backgroundImage?: string; // URL фонового изображения
  description?: string;  // дополнительный текст под кнопкой
};

export type ImageBlock = {
  id: string;
  type: 'image';
  url: string;
  alt?: string;
  caption?: string;
};

export type WarningBlock = {
  id: string;
  type: 'warning';
  text: string;
  icon?: string;         // эмодзи или URL иконки (по умолчанию ⚠️)
  backgroundColor?: string; // цвет фона (по умолчанию #ffebee)
  textColor?: string;    // цвет текста (по умолчанию #b71c1c)
};

export type Block = TextBlock | CardBlock | ButtonBlock | ImageBlock | WarningBlock;