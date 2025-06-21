import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Disable React DevTools message in console
if (typeof (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)