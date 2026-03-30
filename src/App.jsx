import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Home from './Pages/Home'
import VerticalTrafficLight from './Pages/VerticalTrafficLight'
import HorizontalTrafficLight from './Pages/HorizontalTrafficLight'
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
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}