import { useState } from 'react'
import PageEditor from './PageEditor'
import PageView from './PageView'
import { loadPages, savePages } from '../utils/storage'
import { useTelegramMainButton } from '../hooks/useTelegramMainButton'


export default function Admin() {
  const [pages, setPages] = useState(loadPages())
  const [current, setCurrent] = useState('home')
  const [mode, setMode] = useState<'view' | 'edit'>('edit')
  const [saved, setSaved] = useState(true)

  const page = pages[current]

  const updatePage = (p: any) => {
    setPages({ ...pages, [current]: p })
    setSaved(false)
  }

  const save = () => {
    savePages(pages)
    setSaved(true)
  }

  useTelegramMainButton({
  text: '💾 Сохранить',
  onClick: save,
  visible: mode === 'edit'
   })

  return (
    <div className="page">
      <h1>🛠 Админка</h1>

      <div className="admin-toolbar">
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

        <button onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>
          {mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор'}
        </button>

        <button
          onClick={save}
          disabled={saved}
        >
          💾 Сохранить
        </button>
      </div>

      {mode === 'view' ? (
        <PageView page={page} />
      ) : (
        <PageEditor page={page} onChange={updatePage} />
      )}
    </div>
  )
}
