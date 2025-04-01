import React,{useState,useEffect} from 'react';
import { Grid } from '@mui/material';
// Service
import { postData } from '../Services/NodeServices';
// Params fn use For to read the url data
import { useParams } from 'react-router';
// Product Details Component
import ProductDetailsComponent from './UserComponents/ProductDetailsComponent';
// MainBar and SearchBar and Footer
import MainBar from './UserComponents/MainBar';
import SearchBar from './UserComponents/SearchBar';
import Footer from './UserComponents/Footer';
// Service 
import { ServerURL } from '../Services/NodeServices';
// Filter Component 
import FilterComponent from './UserComponents/FilterComponent';

export default function ProductList() {
 

  const [productList,setProductList]=useState([])  
  var  {id,icon}=useParams()

  const fetchAllProductBySubCategory=async()=>{
    var body={subcategoryid:id}
    var result=await postData('userinterface/fetch_all_product_by_subcategory',body)
    setProductList(result.data)
  }  
  useEffect(function(){
    fetchAllProductBySubCategory()
  },[])

  return (
    <div>
      {/* <div style={{position:'fixed',zIndex:3,width:'100%',marginTop:'-120px'}}> */}
        <SearchBar setProductList={setProductList} search={true} />
        <MainBar/>
      {/* </div> */}


      <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',paddingLeft:70,paddingRight:70}}> {/* marginTop:120 "whenever navbar is fixed so you should apply this margintop in this div......"  */}
        <div style={{width:'100%',height:'auto',marginTop:25,marginBottom:10,cursor:'pointer'}}>
          <img src={`${ServerURL}/images/${icon}`} style={{width:'100%',height:'80%'}}/>
        </div>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <FilterComponent setProductList={setProductList}/>
        </Grid>
        <Grid xs={9}>
          <div style={{display:'flex',justifyContent:'space-around',marginRight:40,marginLeft:40,marginTop:15,width:'95%',padding:2,flexWrap:'wrap'}}>
            <ProductDetailsComponent data={productList} />
          </div>
        </Grid>
      </Grid>
      
      <Footer/>
    </div>
  );
}


