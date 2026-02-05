import { useTelegram } from '../context/TelegramContext'
import faq from '../data/faq.json'

export default function Home() {
  const { user } = useTelegram()

  return (
    <div style={{ padding: 16 }}>
      <h2>
        👋 Привет{user?.first_name ? `, ${user.first_name}` : ''}!
      </h2>

      <p>Введите ваш вопрос или выберите категорию</p>

      <input
        placeholder="Например: штраф, тройка, контролёр"
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 8,
          border: '1px solid #ccc',
          marginBottom: 20
        }}
      />

      <h3>📌 Частые вопросы</h3>

      {faq.slice(0, 5).map((q) => (
        <div
          key={q.id}
          style={{
            padding: 12,
            borderRadius: 10,
            background: '#f5f5f5',
            marginBottom: 12
          }}
        >
          <strong>{q.title}</strong>
          <p style={{ margin: '6px 0', fontSize: 14 }}>
            {q.short}
          </p>
        </div>
      ))}
    </div>
  )
}
