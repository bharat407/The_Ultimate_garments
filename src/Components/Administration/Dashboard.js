import * as React from 'react';
// App Bar 
import AdminAppBar from './AdminAppBar';
// Side List
import SideList from './SideList';
import { Routes, Route } from 'react-router-dom';
// Administration Component
import Category from "./Category";
import DisplayAllCategory from "./DisplayAllCategory";
import SubCategory from "./SubCategory";
import DisplayAllSubCategory from ".//DisplayAllSubCategory";
import Product from "./Product";
import DisplayAllProduct from "./DisplayAllProduct";
import Size from "./Size";
import DisplayAllSize from "./DisplayAllSize";
import Color from "./Color";
import DisplayAllColor from "./DisplayAllColor";
import BannerImages from './BannerImages';
import ProductImages from './ProductImages';
// Jwt Required fn
import { isValidAuth } from '../Services/NodeServices';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(props) {
  var navigate=useNavigate()

  // Jwt Manupilation..............
  const [authState,setAuthState]=useState(false)
  const checkAuth = async () => {
    var result = await isValidAuth()
    if (result.auth) {
      setAuthState(true)
    }
    else {
      setAuthState(false)
      // navigate('/adminlogin')
    }
  }
  useEffect(function () {
    checkAuth()
  }, [])
  // ...............................



  return (
    <div>
      {authState?
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

      <AdminAppBar />

      <div style={{ display: 'flex' }}>
        <div style={{ width: '15%' }}>
          <SideList />
        </div>
        <div style={{ width: '75%' }}>
          <Routes>
            <Route element={<Category />} path="/category" />
            <Route element={<DisplayAllCategory />} path="/displayallcategory" />
            <Route element={<SubCategory />} path="/subcategory" />
            <Route element={<DisplayAllSubCategory />} path="/displayallsubcategory" />
            <Route element={<Product />} path="/product" />
            <Route element={<DisplayAllProduct />} path="/displayallproduct" />
            <Route element={<Size />} path="/size" />
            <Route element={<DisplayAllSize />} path="/displayallsize" />
            <Route element={<Color />} path="/color" />
            <Route element={<DisplayAllColor />} path="/displayallcolor" />
            <Route element={<BannerImages />} path="/bannerimages" />
            <Route element={<ProductImages />} path="/productimages" />
          </Routes>
        </div>
      </div>

    </div>:<><h1>Not a Valid User</h1></>
    }</div>
  )

}