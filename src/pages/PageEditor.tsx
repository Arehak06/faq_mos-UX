function uid() {
  return Math.random().toString(36).slice(2)
}

export default function PageEditor({
  page,
  onChange
}: {
  page: any
  onChange: (p: any) => void
}) {
  const addTextBlock = () => {
    onChange({
      ...page,
      blocks: [
        ...page.blocks,
        {
          id: uid(),
          type: 'text',
          value: ''
        }
      ]
    })
  }

  const addCardBlock = () => {
    onChange({
      ...page,
      blocks: [
        ...page.blocks,
        {
          id: uid(),
          type: 'card',
          title: '',
          text: ''
        }
      ]
    })
  }

  const removeBlock = (index: number) => {
    const copy = structuredClone(page)
    copy.blocks.splice(index, 1)
    onChange(copy)
  }

  return (
    <div className="editor">
      <label className="editor-field">
        <span>Заголовок страницы</span>
        <input
          value={page.title}
          onChange={(e) =>
            onChange({ ...page, title: e.target.value })
          }
        />
      </label>

      <h3>Блоки</h3>

      {page.blocks.map((b: any, i: number) => (
        <div key={b.id} className="editor-block">
          <div className="editor-block-header">
            <strong>{b.type}</strong>

            <button
              className="danger"
              onClick={() => removeBlock(i)}
            >
              🗑
            </button>
          </div>

          {b.type === 'text' && (
            <textarea
              value={b.value}
              placeholder="Текст блока"
              onChange={(e) => {
                const copy = structuredClone(page)
                copy.blocks[i].value = e.target.value
                onChange(copy)
              }}
            />
          )}

          {b.type === 'card' && (
            <>
              <input
                value={b.title}
                placeholder="Заголовок карточки"
                onChange={(e) => {
                  const copy = structuredClone(page)
                  copy.blocks[i].title = e.target.value
                  onChange(copy)
                }}
              />
              <textarea
                value={b.text}
                placeholder="Текст карточки"
                onChange={(e) => {
                  const copy = structuredClone(page)
                  copy.blocks[i].text = e.target.value
                  onChange(copy)
                }}
              />
            </>
          )}
        </div>
      ))}

      <div className="editor-actions">
        <button onClick={addTextBlock}>➕ Текст</button>
        <button onClick={addCardBlock}>➕ Карточка</button>
      </div>
    </div>
  )
}
