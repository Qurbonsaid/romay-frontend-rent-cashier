import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import Clients from './pages/clients/clients'
import ClientDetails from './pages/clients/clientDetails'
import Repairs from './pages/repairs/repairs'
import RepairDetails from './pages/repairs/repairDetails'
import AddService from './pages/repairs/AddService'
import EditService from './pages/repairs/EditService'
import ProductPage from './pages/products/products'
import Rents from './pages/rents/rents'
import AddRent from './pages/rents/AddRent'
import EditRent from './pages/rents/EditRent.tsx'
import RentDetails from './pages/rents/rentDetails'
import Bonuses from './pages/bonus/bonuses'

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route index element={<Rents />}></Route>
      </Route>
      <Route path="rents/add" element={<PrivateRoute />}>
        <Route index element={<AddRent />}></Route>
      </Route>
      <Route path="rents/edit/:id" element={<PrivateRoute />}>
        <Route index element={<EditRent />}></Route>
      </Route>
      <Route path="rent-details/:id" element={<PrivateRoute />}>
        <Route index element={<RentDetails />} />
      </Route>
      <Route path={'auth'}>
        <Route path={'login'} element={<LoginPage />} />
      </Route>
      <Route path="clients" element={<PrivateRoute />}>
        <Route index element={<Clients />} />
        <Route path=":id" element={<ClientDetails />} />
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
      <Route path="edit-service/:id" element={<PrivateRoute />}>
        <Route index element={<EditService />} />
      </Route>
      <Route path="products" element={<PrivateRoute />}>
        <Route index element={<ProductPage />}></Route>
      </Route>
      <Route path="bonuses" element={<PrivateRoute />}>
        <Route index element={<Bonuses />} />
      </Route>
    </Routes>
  )
}
