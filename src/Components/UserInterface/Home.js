import React,{useState,useEffect} from 'react';
// Service
import { getData,postData } from '../Services/NodeServices';
// Main Bar
import MainBar from './UserComponents/MainBar';
// Search Bar
import SearchBar from './UserComponents/SearchBar';
// Carousel
import SliderComponent from './UserComponents/SliderComponent';
// Small Component Card
import SmallCardComponent from './UserComponents/SmallCardComponent';
// Three Card Component 
import ThreeCardComponent from './UserComponents/ThreeCardComponent';
// Two Card Component
import TwoCardComponent from './UserComponents/TwoCardComponent';
// One Component
import OneCardComponent from './UserComponents/OneCardComponent';
// Footer
import Footer from './UserComponents/Footer';

// Carousel Manupilation.............
var bannersettings={
  dots: true,
  arrows: false,
  infinite: true,
  speed: 900,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
};

export default function Home(props) {
  // Carousel Manupialtion............
  const [banners,setBanners]=useState([])

  const fetchBanners=async()=>{
    var result=await getData('userinterface/display_all_banners')
    var temp=JSON.parse(result.data.bannerpictures)
    setBanners(temp)
  }
  useEffect(function(){
    fetchBanners()
  },[])
  //....................................

  // Fetch Product By Sale Status.......
  const [productBySaleStatus,setProductBySaleStatus]=useState([])
  const [productBySalePopular,setProductByPopular]=useState([])
  const [bigImages,setBigImages]=useState([])
  const [twoPriorityImages1,setTwoPriorityImages1]=useState([])
  const [twoPriorityImages2,setTwoPriorityImages2]=useState([])

  const fetchProducts=async(status)=>{
    var body={'salestatus':status}
    var result=await postData('userinterface/display_all_product_salestatus',body)
    setProductBySaleStatus(result.data)
  } 
  const fetchPopularProducts=async(status)=>{
    var body={'salestatus':status}
    var result=await postData('userinterface/display_all_product_salestatus',body)
    setProductByPopular(result.data)
  }
  const fetchBigImagesForSubcategory=async(priority)=>{
    var body={'priority':priority}
    var result=await postData('userinterface/display_all_subcategory_by_priority',body)
    setBigImages(result.data)
  }
  const fetchTwoPriorityForSubcategory1=async(priority)=>{
    var body={'priority':priority}
    var result=await postData('userinterface/display_all_subcategory_by_priority',body)
    setTwoPriorityImages1(result.data)
  }
  const fetchTwoPriorityForSubcategory2=async(priority)=>{
    var body={'priority':priority}
    var result=await postData('userinterface/display_all_subcategory_by_priority',body)
    setTwoPriorityImages2(result.data)
  }
  useEffect(function(){
    fetchProducts('Trending')
    fetchPopularProducts('Popular')
    fetchTwoPriorityForSubcategory1(2)
    fetchTwoPriorityForSubcategory2(3)
    fetchBigImagesForSubcategory(1)
  },[])
  //....................................

  // Heading of Small Components........
  const Heading=(props)=>{
    return(
      <div style={{width:'100wh',textAlign:'center',fontSize:32,letterSpacing:1,fontWeight:'bolder',fontFamily:'cursive',margin:5,color:props.color}}>
        {props.heading}
      </div>
    )
  }
  //....................................

return (
    <div>
      
      {/* <div style={{position:'fixed',zIndex:3,width:'100%',marginTop:'-120px'}}> */}
        <SearchBar search={false}/>
        <MainBar/>
      {/* </div> */}

      {/* <div style={{marginTop:120}}> */}
        <SliderComponent images={banners} bannersettings={bannersettings} />
      {/* </div> */}

      <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',width:'100%',marginTop:30}}>
        <Heading heading="TRENDING" color="#343434"/>
        <div style={{display:'flex',justifyContent:'space-around',marginRight:40,marginLeft:40,width:'90%',padding:2,flexWrap:'wrap'}}>
          <SmallCardComponent data={productBySaleStatus} url={'productlist'} />
        </div>
        <Heading heading="POPULAR" color="#343434"/>
        <div style={{display:'flex',justifyContent:'space-around',margin:'0px 40px 40px 40px',width:'90%',padding:2,flexWrap:'wrap'}}>
          <ThreeCardComponent data={productBySalePopular} url={'productlist'} />
        </div>
        <Heading heading="SHOP FOR MEN" color="#343434" />
        <div style={{display:'flex',justifyContent:'space-around',margin:'0px 40px 40px 40px',width:'90%',padding:2,flexWrap:'wrap'}}>
          <TwoCardComponent data={twoPriorityImages1} url={'productlist'} />
        </div>
        <Heading heading="SHOP FOR WOMEN" color="#343434" />
        <div style={{display:'flex',justifyContent:'space-around',margin:'0px 40px 40px 40px',width:'90%',padding:2,flexWrap:'wrap'}}>
          <TwoCardComponent data={twoPriorityImages2} url={'productlist'} />
        </div>
        <div style={{display:'flex',justifyContent:'space-around',margin:'0px 40px 40px 40px',width:'90%',padding:2,flexWrap:'wrap'}}>
          <OneCardComponent data={bigImages} url={'productlist'}  />
        </div>
      </div>
      
      <div>
        <Footer/>
      </div>      

    </div>
  );
}



