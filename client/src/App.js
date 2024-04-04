import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import {Login, Home, Public, Products, About, DetailProduct} from './pages/public';
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
        <Route path={path.PRODUCTS} element={<Products />} />
        <Route path={path.DETAIL_PRODUCT__PID__TITLE} element={<DetailProduct />} />
        <Route path={path.ABOUT} element={<About />} />
      </Route>
      <Route path={path.LOGIN} element={<Login />} />
    </Routes>
    </div>
  );
}

export default App;
