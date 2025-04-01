// Component
import { Grid, Button, Avatar, TextField } from "@material-ui/core";
// State and Effect fn
import { useState, useEffect } from "react";
// Style
import { useStyles } from "./ColorCss";
// Drop Down
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Services
import { getData, postData } from "../Services/NodeServices";
// Sweet Alert
import Swal from "sweetalert2"
// Navigation
import { useNavigate } from "react-router-dom";
// Color Picker
import ColorPicker from 'material-ui-color-picker'

export default function Color() { // style
  var classes = useStyles()
  //Navigate
  var navigate = useNavigate()

  // State 
  const [categoryList, setCategoryList] = useState([])
  const [categoryId, setCategoryId] = useState()
  const [subCategoryList, setSubCategoryList] = useState([])
  const [subCategoryId, setSubCategoryId] = useState()
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState()
  const [sizeList, setSizeList] = useState([])
  const [size, setSize] = useState()
  const [color, setColor] = useState()
  const [colorCode, setColorCode] = useState()
  const [colorList, setColorList] = useState({})


  // Category DropDown Manupilation
  const handleCategoryChange = async (event) => {
    setCategoryId(event.target.value)
    fetchAllSubCategory(event.target.value)
    fetchAllProduct(null, null)
    fetchAllSize(null, null, null)
  }
  const fetchAllCategory = async () => {
    var result = await getData('category/display_all_category')
    setCategoryList(result.data)
  }
  useEffect(function () {
    fetchAllCategory()
  }, [])
  const fillCategories = () => {
    return categoryList.map((item) => {
      return (
        <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem>
      )
    })
  }
  // ..............................  
  // SubCategory DropDown Manupilation
  const handleSubCategoryChange = (event) => {
    setSubCategoryId(event.target.value)
    fetchAllProduct(categoryId, event.target.value)
    fetchAllSize(null, null, null)
  }
  const fetchAllSubCategory = async (cid) => {
    var body = { categoryid: cid }
    var result = await postData('subcategory/fetch_all_subcategory', body)
    setSubCategoryList(result.data)
  }
  const fillSubCategories = () => {
    return subCategoryList.map((item) => {
      return (
        <MenuItem value={item.subcategoryid}>{item.subcategoryname}</MenuItem>
      )
    })
  }
  // ...............................
  // Product DropDown Manupilation
  const handleProductChange = (event) => {
    setProductId(event.target.value)
    fetchAllSize(categoryId, subCategoryId, event.target.value)
  }
  const fetchAllProduct = async (cid, sid) => {
    var body = { categoryid: cid, subcategoryid: sid }
    var result = await postData('product/fetch_all_product', body)
    setProductList(result.data)
  }
  const fillProducts = () => {
    return productList.map((item) => {
      return (
        <MenuItem value={item.productid}>{item.productname}</MenuItem>
      )
    })
  }
  // ...............................
  // Size DropDown Manupilation
  const fetchAllSize = async (cid, sid, pid) => {
    var body = { categoryid: cid, subcategoryid: sid, productid: pid }
    var result = await postData('size/fetch_all_size', body)

    setSizeList(result.data)
  }
  const fillSize = () => {
    return sizeList.map((item) => {
      return (
        <MenuItem value={item}>{item}</MenuItem>
      )
    })
  }
  // ...............................
  // Color Change
  const handleColorChange = (event) => {
    setColorCode(event)
  }
  // Add Color
  const handleAddColor = () => {
    var temp = colorList

    setColorList({ ...temp, [color]: colorCode })

  }

  const handleSubmit = async () => {
    var body = { categoryid: categoryId, subcategoryid: subCategoryId, productid: productId, size: size, color: JSON.stringify(colorList) }

    var result = await postData('color/add_new_color', body)

    if (result.status) {
      Swal.fire({
        icon: 'success',
        title: 'Record Submitted Successfully',
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }
    setColor('')
    setColorList({})
  }

  const handleReset = () => {
    setColor('')
    setColorList({})
  }


  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        <Grid container className={classes.gridStyle} spacing={2}>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <div className={classes.headingText}>
              Color Interface
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '70%' }}>
              <Avatar src={'/report.png'} variant="square" style={{ width: 39 }} onClick={() => navigate('/dashboard/displayallcolor')} />
            </div>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryId}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem>Choose Category</MenuItem>
                {fillCategories()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label1">SubCategory</InputLabel>
              <Select
                labelId="demo-simple-select-label1"
                id="demo-simple-select1"
                value={subCategoryId}
                label="SubCategory"
                onChange={handleSubCategoryChange}
              >
                <MenuItem>Choose SubCategory</MenuItem>
                {fillSubCategories()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Product</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={productId}
                label="Product"
                onChange={handleProductChange}
              >
                <MenuItem>Choose Product</MenuItem>
                {fillProducts()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Size</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={size}
                label="Size"
                onChange={(event) => setSize(event.target.value)}
              >
                <MenuItem>Choose Size</MenuItem>
                {fillSize()}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField value={color} variant="outlined" label="Color Name" fullWidth onChange={(event) => setColor(event.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <ColorPicker
              name='color'
              defaultValue='#Color'
              variant='outlined'
              fullWidth
              value={colorCode} //- for controlled component
              onChange={(code) => handleColorChange(code)}
            />
          </Grid>
          <Grid item xs={4} className={classes.center}>
            <Button onClick={handleAddColor} fullWidth variant="contained" color="primary">Set</Button>
          </Grid>
          <Grid item xs={12}>
            <TextField value={JSON.stringify(colorList)} onChange={(event) => setColorList(event.target.value)} variant="outlined" fullWidth label="Color List" />
          </Grid>
          <Grid item xs={6}>
            <Button onClick={handleSubmit} fullWidth variant="contained" color="primary">Submit</Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth onClick={handleReset} variant="contained" color="primary">Reset</Button>
          </Grid>
        </Grid>
      </div>
    </div>
  )

}







