import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, Products, About, DetailProduct, ResetPassword, DetailCart } from './pages/public';
import { ManageOrders, ManageUsers, ManageProducts, AdminLayout, CreateProducts, Dashboard } from './pages/admin';
import { MemberLayout, MyCart, Personal, History, Wishlist } from './pages/member';
import path from './ultils/path';
import { getCategories} from './store/app/asyncActions';
import { getBrands } from './store/brand/asyncActions';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cart } from './components';
import { showCart } from './store/app/appSlice';

function App() {
  const {isShowCart} = useSelector(state => state.app)
  const dispacth = useDispatch()
  useEffect(() => {
    dispacth(getCategories())
    dispacth(getBrands())
  }, [])
  return (
    <div className="min-h-screen font-main relative">
      {isShowCart && <div onClick={() => dispacth(showCart())} className='fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end'>
        <Cart />
      </div>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.ABOUT} element={<About />} />
          <Route path={path.PRODUCTS} element={<Products />} />
          <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={path.DETAIL_CART} element={<DetailCart />} />
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
          <Route path={path.MY_CART} element={<MyCart />} />
          <Route path={path.HISTORY} element={<History />} />
          <Route path={path.WISHLIST} element={<Wishlist />} />
        </Route>
        <Route path={path.LOGIN} element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </div>
  );
}

export default App;
