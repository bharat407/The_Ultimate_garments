import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useState,useEffect } from 'react';
import { getData,postData } from '../../Services/NodeServices';
import { Button } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export default function MainBar(props) {

  // Menu Anchor
  const [anchorEl, setAnchorEl] = useState(null);
  const [open,setOpen]=useState(anchorEl) 

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true)
    setCategoryId(event.currentTarget.value)
    fetchAllSubCategories(event.currentTarget.value)
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false)
  };
  //........................

  // Fetch All Category and Subcategory
  const [category,setCategory]=useState([])
  const [categoryId,setCategoryId]=useState('')
  const [subCategory,setSubCategory]=useState([])

  const fetchAllCategories=async()=>{
    var result=await getData('userinterface/display_all_category')
    setCategory(result.data)
  }
  const fetchAllSubCategories=async(categoryid)=>{
    var result=await postData('userinterface/display_all_subcategory',{categoryid:categoryid})
    setSubCategory(result.data)
  }
  //.....................................

  const showCategoryMenu=()=>{
    return category.map((item)=>{
      
      return(
        <Button onClick={handleClick} style={{color:'#000'}} value={item.categoryid} color='inherit' id="basic-button">{item.categoryname}</Button>
      )
    })
  }
  const showSubCategoryMenu=()=>{
    return subCategory.map((item)=>{
      return(
        <MenuItem>{item.subcategoryname}</MenuItem>
      )
    })
  }

  useEffect(function(){
    fetchAllCategories()
  },[])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{background:'#fff'}}>
        <Toolbar>
          
          <div style={{ display:'flex',justifyContent:'center',width:'100%'}}>    
           {showCategoryMenu()} 
           <Menu
             id="basic-menu"
             anchorEl={anchorEl}
             open={open}
             onClose={handleClose}
             MenuListProps={{
              'aria-labelledby': 'basic-button',
             }}
             >
             {showSubCategoryMenu()}
           </Menu>
          </div>

        </Toolbar>
      </AppBar>
      
    </Box>
  );
}
