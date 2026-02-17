import { useState } from 'react'
import { VersionA } from './pages/VersionA'
import { VersionB } from './pages/VersionB'
import './App.css'

function App() {
  const [version, setVersion] = useState<'A' | 'B'>('B')

  return (
    <>
      {version === 'A' ? <VersionA /> : <VersionB />}

      {/* Floating version switcher */}
      <div className="version-switcher">
        <button
          className={`vs-btn ${version === 'A' ? 'active' : ''}`}
          onClick={() => { setVersion('A'); window.scrollTo(0, 0) }}
        >
          Version A
        </button>
        <button
          className={`vs-btn ${version === 'B' ? 'active' : ''}`}
          onClick={() => { setVersion('B'); window.scrollTo(0, 0) }}
        >
          Version B
        </button>
      </div>
    </>
  )
}

export default App
