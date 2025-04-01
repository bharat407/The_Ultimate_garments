// Component
import { Grid, Button, Avatar } from "@material-ui/core";
// State and Effect fn
import { useState, useEffect } from "react";
// Style
import { useStyles } from "./SizeCss";
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
// Select Drop Down......
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import * as React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'S',
  'M',
  'L',
  'XS',
  'XL',
  'XXL',
];
//........................

export default function Size(props) {

  // style
  var classes = useStyles()
  // Navigate
  var navigate = useNavigate()

  // State 
  const [categoryList, setCategoryList] = useState([])
  const [categoryId, setCategoryId] = useState()
  const [subCategoryList, setSubCategoryList] = useState([])
  const [subCategoryId, setSubCategoryId] = useState()
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState()
  const [size, setSize] = useState([])

  // Select Drop Down
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSize(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  //.....................


  // Category DropDown Manupilation
  const handleCategoryChange = async (event) => {
    setCategoryId(event.target.value)
    fetchAllSubCategory(event.target.value)
    fetchAllProduct(null, null)
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

  const handleSubmit = async () => {
    var body = { 'categoryid': categoryId, 'subcategoryid': subCategoryId, 'productid': productId, 'size': JSON.stringify(size) }

    var result = await postData('size/add_new_size', body)

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

  }

  const handleReset = () => {

  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        <Grid container className={classes.gridStyle} spacing={2}>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <div className={classes.headingText}>
              Size Interface
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '71%' }}>
              <Avatar src={'/report.png'} variant="square" style={{ width: 39 }} onClick={() => navigate('/dashboard/displayallsize')} />
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
              <InputLabel id="demo-multiple-checkbox-label">Size</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={size}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}

              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={size.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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







