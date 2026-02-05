import { createContext, useContext } from 'react'

export const TelegramContext = createContext<any>(null)
export const useTelegram = () => useContext(TelegramContext)
