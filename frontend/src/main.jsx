import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App            from './App.jsx';
import LandingPage    from './pages/LandingPage.jsx';
import Home           from './components/Home.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Products       from './pages/Products.jsx';
import ProductDetail  from './pages/ProductDetail.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AddProduct     from './pages/AddProduct.jsx';
import EditProduct    from './pages/EditProduct.jsx';
import Categories     from './pages/Categories.jsx';
import UserManager    from './pages/UserManager.jsx';
import RoleMapping      from './pages/RoleMapping.jsx';
import ImportProducts   from './pages/ImportProducts.jsx';
import ErrorBoundary    from './components/ErrorBoundary.jsx';
import CartPage         from './pages/CartPage.jsx';
import MyOrders         from './pages/MyOrders.jsx';
import AdminOrders      from './pages/AdminOrders.jsx';
import Profile          from './pages/Profile.jsx';
import Report           from './pages/Report.jsx';
import AdminReports     from './pages/AdminReports.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary>
      <Routes>
        {/* Public */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<App />} />

        {/* Protected — any logged-in user */}
        <Route path='/home'          element={<ProtectedRoute><ErrorBoundary><Home /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/products'      element={<ProtectedRoute><ErrorBoundary><Products /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/products/:id'  element={<ProtectedRoute><ErrorBoundary><ProductDetail /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/categories'    element={<ProtectedRoute><ErrorBoundary><Categories /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/cart'          element={<ProtectedRoute><ErrorBoundary><CartPage /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/orders/my'     element={<ProtectedRoute><ErrorBoundary><MyOrders /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/profile'       element={<ProtectedRoute><ErrorBoundary><Profile /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/report'        element={<ProtectedRoute><ErrorBoundary><Report /></ErrorBoundary></ProtectedRoute>} />

        {/* Protected — admin only */}
        <Route path='/admin'                    element={<ProtectedRoute adminOnly><ErrorBoundary><AdminDashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/products/add'       element={<ProtectedRoute adminOnly><ErrorBoundary><AddProduct /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/products/edit/:id'  element={<ProtectedRoute adminOnly><ErrorBoundary><EditProduct /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/users'              element={<ProtectedRoute adminOnly><ErrorBoundary><UserManager /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/rolemapping'        element={<ProtectedRoute adminOnly><ErrorBoundary><RoleMapping /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/products/import'    element={<ProtectedRoute adminOnly><ErrorBoundary><ImportProducts /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/orders'             element={<ProtectedRoute adminOnly><ErrorBoundary><AdminOrders /></ErrorBoundary></ProtectedRoute>} />
        <Route path='/admin/reports'             element={<ProtectedRoute adminOnly><ErrorBoundary><AdminReports /></ErrorBoundary></ProtectedRoute>} />
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
  // This is the main jsx  which held in fronted folder.
)
