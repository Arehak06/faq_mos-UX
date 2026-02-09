import { useParams } from 'react-router-dom'
import PageRenderer from '../components/PageRenderer'
import pages from '../data/pages.json'

export default function Page() {
  const { slug } = useParams()
  const page = (pages as any)[slug || 'home']

  if (!page) {
    return <div className="page">Страница не найдена</div>
  }

  return <PageRenderer page={page} />
}
