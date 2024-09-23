import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { v1 as UuidV1 } from 'uuid'
import { ControlPage } from './pages/control'
import { HomePage } from './pages/home'
import { LobbyPage } from './pages/lobby'
import { ScreenPage } from './pages/screen'

import './index.css'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/lobby/:id',
    element: <LobbyPage />,
  },
  {
    path: '/screen/:id',
    element: <ScreenPage />,
  },
  {
    path: '/control/:id',
    element: <ControlPage />,
  },
])

if (!localStorage.getItem('user-id')) {
  localStorage.setItem('user-id', UuidV1())
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
