// Component
import { Grid, Avatar, TextField, Button } from "@material-ui/core";
// State and Effect fn
import { useState, useEffect } from "react";
// Style
import { useStyles } from "./ProductCss";
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

export default function Product() { // style
  var classes = useStyles()
  //Navigate
  var navigate = useNavigate()

  // State 
  const [categoryList, setCategoryList] = useState([])
  const [categoryId, setCategoryId] = useState()
  const [subCategoryList, setSubCategoryList] = useState([])
  const [subCategoryId, setSubCategoryId] = useState()
  const [productName, setProductName] = useState()
  const [price, setPrice] = useState()
  const [offerPrice, setOfferPrice] = useState()
  const [stock, setStock] = useState()
  const [description, setDescription] = useState()
  const [rating, setRating] = useState()
  const [status, setStatus] = useState()
  const [saleStatus, setSaleStatus] = useState()
  const [icon, setIcon] = useState({ url: '/icon.png', bytes: '' })

  // Category DropDown Manupilation
  const handleCategoryChange = async (event) => {
    setCategoryId(event.target.value)
    fetchAllSubCategory(event.target.value)
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
  }
  const fetchAllSubCategory = async (cid) => {
    var body = { categoryid: cid }
    var result = await postData('subcategory/fetch_all_subcategory', body)
    setSubCategoryList(result.data)
  }
  // useEffect(function(){
  //   fetchAllSubCategory()
  // },[categoryId])
  const fillSubCategories = () => {
    return subCategoryList.map((item) => {
      return (
        <MenuItem value={item.subcategoryid}>{item.subcategoryname}</MenuItem>
      )
    })
  }
  // ...............................

  //Icon Change
  const handleIcon = (event) => {
    setIcon({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
  }
  const handleSubmit = async () => {
    var formData = new FormData()
    formData.append('categoryid', categoryId)
    formData.append('subcategoryid', subCategoryId)
    formData.append('productname', productName)
    formData.append('price', price)
    formData.append('offerprice', offerPrice)
    formData.append('stock', stock)
    formData.append('description', description)
    formData.append('rating', rating)
    formData.append('status', status)
    formData.append('salestatus', saleStatus)
    formData.append('icon', icon.bytes)

    var result = await postData('product/add_new_product', formData, true)

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

    setProductName('')
    setPrice('')
    setOfferPrice('')
    setStock('')
    setDescription('')
    setRating('')
    setStatus('')
    setSaleStatus('')
    setIcon({ url: '/icon.png', bytes: '' })
  }

  const handleReset = () => {
    setProductName('')
    setPrice('')
    setOfferPrice('')
    setStock('')
    setDescription('')
    setRating('')
    setStatus('')
    setSaleStatus('')
    setIcon({ url: '/icon.png', bytes: '' })
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        <Grid container className={classes.gridStyle} spacing={2}>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <div className={classes.headingText}>
              Product Interface
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '69%' }}>
              <Avatar src={'/report.png'} variant="square" style={{ width: 39 }} onClick={() => navigate('/dashboard/displayallproduct')} />
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
            <TextField value={productName} fullWidth onChange={(event) => setProductName(event.target.value)} variant="outlined" label="Product Name" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth value={price} onChange={(event) => setPrice(event.target.value)} variant="outlined" label="Product Price" />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth value={offerPrice} onChange={(event) => setOfferPrice(event.target.value)} variant="outlined" label="Offer Price" />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth value={stock} onChange={(event) => setStock(event.target.value)} variant="outlined" label="Stock" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth value={description} onChange={(event) => setDescription(event.target.value)} variant="outlined" label="Description" />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth value={rating} onChange={(event) => setRating(event.target.value)} variant="outlined" label="Rating" />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={(event) => setStatus(event.target.value)}
              >
                <MenuItem value={'Continue'}>Continue</MenuItem>
                <MenuItem value={'Discontinue'}>Discontinue</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sale Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={saleStatus}
                label="Sale Status"
                onChange={(event) => setSaleStatus(event.target.value)}
              >
                <MenuItem value={'Trending'}>Trending</MenuItem>
                <MenuItem value={'Popular'}>Popular</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} className={classes.center}>
            <Button variant="contained" component="label" color="primary" fullWidth onChange={handleIcon}>
              Upload
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          </Grid>
          <Grid item xs={6} className={classes.center}>
            <Avatar
              alt="Product Icon"
              src={icon.url}
              style={{ width: 80, height: 50 }}
              variant="square"
            />
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
