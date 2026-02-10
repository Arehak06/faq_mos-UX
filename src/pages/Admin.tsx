import { useEffect, useState } from 'react'
import PageEditor from './PageEditor'
import PageView from './PageView'
import { loadPages, savePages } from '../utils/storage'
import { useTelegramMainButton } from '../hooks/useTelegramMainButton'

export default function Admin() {
  const [pages, setPages] = useState(loadPages())
  const [current, setCurrent] = useState('home')
  const [mode, setMode] = useState<'edit' | 'view'>('edit')

  const page = pages[current]

  /* автосохранение */
  useEffect(() => {
    savePages(pages)
  }, [pages])

  /* Telegram MainButton */
  useTelegramMainButton({
    text: '💾 Сохранить',
    visible: mode === 'edit',
    onClick: () => savePages(pages)
  })

  return (
    <div className="page">
      <h1 className="page-title">🛠 Админка</h1>

      {/* ===== Page selector ===== */}
      <div className="admin-card">
        <div className="admin-card-title">Страница</div>

        <select
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        >
          {Object.keys(pages).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {/* ===== Mode switch ===== */}
      <div className="admin-card">
        <div className="admin-card-title">Режим</div>

        <button
          className="tg-button"
          onClick={() =>
            setMode(mode === 'edit' ? 'view' : 'edit')
          }
        >
          {mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор'}
        </button>
      </div>

      {/* ===== Content ===== */}
      {mode === 'edit' ? (
        <PageEditor
          page={page}
          onChange={(p) =>
            setPages({ ...pages, [current]: p })
          }
        />
      ) : (
        <PageView page={page} />
      )}
    </div>
  )
}
