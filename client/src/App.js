import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, Products, About, DetailProduct } from './pages/public';
import { ManageOrders, ManageUsers, ManageProducts, AdminLayout, CreateProducts, Dashboard } from './pages/admin';
import { MemberLayout, Personal } from './pages/member';
import path from './ultils/path';
import { getCategories } from './store/app/asyncActions';
import { useDispatch } from 'react-redux';

function App() {
  const dispacth = useDispatch()
  useEffect(() => {
    dispacth(getCategories())
  }, [])
  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.ABOUT} element={<About />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.ALL} element={<Home />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDERS} element={<ManageOrders />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_USERS} element={<ManageUsers />} />
          <Route path={path.CREATE_PRODUCT} element={<CreateProducts />} />
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />} />
        </Route>
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
