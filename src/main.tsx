import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/store.ts'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </StrictMode>
)
