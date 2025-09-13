import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { DashboardPage } from './pages/dashboard/dashboard'
import Clients from './pages/clients/clients'
import Repairs from './pages/repairs/repairs'
import RepairDetails from './pages/repairs/repairDetails'
import AddService from './pages/repairs/AddService'
import ProductPage from './pages/products/products'
import Rents from './pages/rents/rents'
import AddRent from './pages/rents/AddRent'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Rents />}></Route>
      </Route>
      <Route path={'auth'}>
        <Route path={'login'} element={<LoginPage />} />
      </Route>
      <Route path="dashboard" element={<PrivateRoute />}>
        <Route index element={<DashboardPage />} />
      </Route>
      <Route path="clients">
        <Route index element={<Clients />} />
      </Route>
      <Route path="repairs" element={<PrivateRoute />}>
        <Route index element={<Repairs />} />
      </Route>
      <Route path="new-repair" element={<PrivateRoute />}>
        <Route index element={<AddService />} />
      </Route>
      <Route path="repair-details/:id" element={<PrivateRoute />}>
        <Route index element={<RepairDetails />} />
      </Route>
      <Route path="products" element={<PrivateRoute />}>
        <Route index element={<ProductPage />}></Route>
      </Route>

      <Route path="rents/add" element={<PrivateRoute />}>
        <Route index element={<AddRent />}></Route>
      </Route>
    </Routes>
  )
}
