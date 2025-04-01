import React,{createRef} from 'react';
// carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// Service
import { ServerURL } from '../../Services/NodeServices';
// Media Query For Responsive
 // import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


export default function SliderComponent(props) {
  // Refrence Variable
  var mySlider=createRef()
  // Media Query of Previous and Next Button
   // const theme = useTheme();
   // const matches = useMediaQuery(theme.breakpoints.down('md')); 
  const matches = useMediaQuery('(max-width:1400px)'); 
  
  const setImageInSlider=()=>{
    return props.images.map((item)=>{
      return(
        <div>
          <img src={`${ServerURL}/images/${item}`} style={{width:'100%',height:'90%'}}/>
        </div>
      )
    })
  }

  const handleBack=()=>{
    mySlider.current.slickPrev()
  }
  const handleForward=()=>{
    mySlider.current.slickNext()
  }
return (
    <div>
     {props.images.length>0?

      <div style={{width:'100%'}}>
       {matches?<></>:
        <div style={{position:'absolute',top:'44%',left:3,zIndex:1,backgroundColor:'rgb(0 0 0 / 39%)',width:39,height:106,padding:5,borderRadius:8,display:'flex',justifyContent:'center',alignItems:'center',paddingLeft:3}}>
          <ArrowBackIosNewIcon style={{color:'#FFF'}} onClick={()=>handleBack()} />
        </div>}

          <Slider {...props.bannersettings} ref={mySlider}>
            {setImageInSlider()}
          </Slider>

       {matches?<></>:   
        <div style={{position:'absolute',top:'44%',right:3,zIndex:1,backgroundColor:'rgb(0 0 0 / 39%)',width:39,height:106,padding:5,borderRadius:8,display:'flex',justifyContent:'center',alignItems:'center',paddingLeft:5}}>
          <ArrowForwardIosIcon style={{color:'#FFF'}} onClick={()=>handleForward()} />
        </div>}  
      </div>

    :<></>}
    </div>
  );
}


