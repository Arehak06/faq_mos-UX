import type { PageData } from '../types/page'
import { BlockRenderer } from '../components/BlockRenderer'

type Props = {
  page: PageData
}


export default function PageView({ page }: Props) {
  return (
    <div className="page">
      <h1 className="page-title">{page.title}</h1>

      {page.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}
