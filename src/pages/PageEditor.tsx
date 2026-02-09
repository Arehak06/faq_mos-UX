export default function PageEditor({
  page,
  onChange
}: {
  page: any
  onChange: (p: any) => void
}) {
  return (
    <div className="editor">
      <h3>✏️ Редактор страницы</h3>

      <label>
        Заголовок:
        <input
          value={page.title}
          onChange={(e) =>
            onChange({ ...page, title: e.target.value })
          }
        />
      </label>

      {page.blocks.map((b: any, i: number) => (
        <div key={b.id} className="editor-block">
          <strong>{b.type}</strong>

          {b.type === 'text' && (
            <textarea
              value={b.value}
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
                placeholder="Заголовок"
                value={b.title}
                onChange={(e) => {
                  const copy = structuredClone(page)
                  copy.blocks[i].title = e.target.value
                  onChange(copy)
                }}
              />
              <textarea
                placeholder="Текст"
                value={b.text}
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
    </div>
  )
}
