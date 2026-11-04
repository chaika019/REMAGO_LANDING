import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'
import './styles/reference.css'
import './styles/design.css'
import './styles/home.css'
import './styles/partner-corrections.css'
import './styles/interior-corrections.css'
import './styles/page-updates.css'
import './styles/responsive.css'
import './styles/rtv-inline.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
