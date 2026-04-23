import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './Pages/Home'
import VerticalTrafficLight from './Pages/VerticalTrafficLight'
import HorizontalTrafficLight from './Pages/HorizontalTrafficLight'
import F1TrafficLightPage from './Pages/F1TrafficLightPage'
import LoginPage from './Pages/LoginPage'
import ErrorPage from './Pages/ErrorPage'

const Layout = () => (
  <div className="min-h-screen bg-base-100">
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'vertical', element: <VerticalTrafficLight /> },
      { path: 'horizontal', element: <HorizontalTrafficLight /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: 'f1-traffic-light',
        element: (
          <ProtectedRoute>
            <F1TrafficLightPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}