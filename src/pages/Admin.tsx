import { useState } from 'react'
import { loadPages, savePages } from '../utils/storage'
import PageEditor from './PageEditor'
import PageView from './PageView'

export default function Admin() {
  const [pages, setPages] = useState(loadPages())
  const [current, setCurrent] = useState('home')
  const [preview, setPreview] = useState(false)

  const page = pages[current]

  const updatePage = (p: any) => {
    setPages({ ...pages, [current]: p })
  }

  const save = () => {
    savePages(pages)
    alert('Сохранено')
  }

  return (
    <div className="page">
      <h1>🛠 Админка</h1>

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

      <button onClick={() => setPreview(!preview)}>
        {preview ? '✏️ Редактировать' : '👁 Просмотр'}
      </button>

      <button onClick={save}>💾 Сохранить</button>

      {preview ? (
        <PageView page={page} />
      ) : (
        <PageEditor page={page} onChange={updatePage} />
      )}
    </div>
  )
}
