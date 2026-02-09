export function useTelegramMainButton({ text, onClick, visible = true }) {
    const tg = window.Telegram?.WebApp;
    if (!tg)
        return;
    tg.MainButton.setText(text);
    if (visible) {
        tg.MainButton.show();
    }
    else {
        tg.MainButton.hide();
    }
    tg.MainButton.offClick(onClick);
    tg.MainButton.onClick(onClick);
}
