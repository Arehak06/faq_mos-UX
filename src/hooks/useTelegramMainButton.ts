import { useEffect, useRef } from 'react';

type Options = {
  text: string;
  onClick: () => void;
  visible?: boolean;
  color?: string;
  textColor?: string;
  active?: boolean;
  progress?: boolean;
};

export function useTelegramMainButton({
  text,
  onClick,
  visible = true,
  color,
  textColor,
  active = true,
  progress = false,
}: Options) {
  const onClickRef = useRef(onClick);
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    const btn = tg.MainButton;

    if (color) btn.setParams({ color });
    if (textColor) btn.setParams({ text_color: textColor });
    btn.setParams({ is_active: active, is_progress_visible: progress });

    if (visible) {
      btn.setText(text);
      btn.show();
    } else {
      btn.hide();
    }

    const handler = () => onClickRef.current();
    btn.onClick(handler);

    return () => {
      btn.offClick(handler);
    };
  }, [text, visible, color, textColor, active, progress]);
}