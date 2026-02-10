import { useEffect, useState } from 'react'
import PageEditor from '../components/PageEditor'
import PageView from '../components/PageView'
import { loadPages, savePages } from '../utils/storage'
import { useTelegramMainButton } from '../hooks/useTelegramMainButton'

export default function Admin() {
  const [pages, setPages] = useState(loadPages())
  const [current, setCurrent] = useState('home')
  const [mode, setMode] = useState<'edit' | 'view'>('edit')

  const page = pages[current]

  useEffect(() => {
    savePages(pages)
  }, [pages])

  useTelegramMainButton({
    text: '💾 Сохранить',
    visible: mode === 'edit',
    onClick: () => savePages(pages)
  })

  return (
    <>
      <select value={current} onChange={(e) => setCurrent(e.target.value)}>
        {Object.keys(pages).map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>

      <button onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')}>
        {mode === 'edit' ? '👁 Просмотр' : '✏️ Редактор'}
      </button>

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
    </>
  )
}
