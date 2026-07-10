import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { PricesProvider } from './components/PricesProvider'
import { objectives } from './objectives/registry'
import { wikiImageUrl } from './lib/format'

export default function App() {
  return (
    <PricesProvider>
      <div className="page">
        <nav className="obj-nav">
          {objectives.map((obj) => (
            <NavLink key={obj.id} to={`/${obj.id}`} className={({ isActive }) => (isActive ? 'active' : '')}>
              <img src={wikiImageUrl(obj.icon)} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
              {obj.title}
            </NavLink>
          ))}
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to={`/${objectives[0].id}`} replace />} />
          {objectives.map((obj) => (
            <Route key={obj.id} path={`/${obj.id}`} element={<obj.page />} />
          ))}
        </Routes>
      </div>
    </PricesProvider>
  )
}
