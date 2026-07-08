import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Cursor } from 'animal-island-ui'
import './index.css'
import 'animal-island-ui/style'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cursor>
      <App />
    </Cursor>
  </StrictMode>,
)
