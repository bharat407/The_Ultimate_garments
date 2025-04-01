// Component
import { Button, Grid, TextField } from "@material-ui/core"
// Style
import { useStyles } from "./DisplayAllColorCss"
// Matrial Table
import MaterialTable from "@material-table/core"
// Services
import { getData, postData } from "../Services/NodeServices"
// State and UseEffect
import { useState, useEffect } from "react"
// Material Dialog 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// DropDown
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Sweet Alert
import Swal from "sweetalert2"
// Navigate
import { useNavigate } from "react-router"

export default function DisplayAllColor() {
  // Style
  var classes = useStyles()
  // Navigate
  var navigate = useNavigate()

  // State
  const [colors, setColors] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [categoryId, setCategoryId] = useState()
  const [subCategoryList, setSubCategoryList] = useState([])
  const [subCategoryId, setSubCategoryId] = useState()
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState()
  const [sizeList, setSizeList] = useState([])
  const [size, setSize] = useState()
  const [colorId, setColorId] = useState()
  const [color, setColor] = useState()
  const [open, setOpen] = useState(false)

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
  const handleSizeChange = (event) => {
    setSize(event.target.value)
  }
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

  // Material Dialog
  const handleEditColor = async () => {
    setOpen(false)
    var body = { productid: productId, categoryid: categoryId, subcategoryid: subCategoryId, size: size, color: color, colorid: colorId }
    var result = await postData('color/edit_color_data', body)

    if (result.status) {
      Swal.fire({
        icon: 'success',
        title: 'Record Updated Successfully',
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }
    fetchAllColor()
  }
  const handleDeleteColor = async () => {
    setOpen(false)

    Swal.fire({
      title: 'Do you want to delete the Size?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'delete',
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {

        var body = { colorid: colorId }
        var result = await postData('color/delete_color_data', body)
        if (result.status) {
          Swal.fire('Deleted!', '', 'success')
          fetchAllColor()
        }
        else {
          Swal.fire('Server Error!', '', 'error')
        }

      } else if (res.isDenied) {
        Swal.fire('Color are not deleted', '', 'info')
      }
    })

  }
  const handleOpen = (rowData) => {
    setColorId(rowData.colorid)
    setCategoryId(rowData.categoryid)
    setSubCategoryId(rowData.subcategoryid)
    setProductId(rowData.productid)
    setSize(rowData.size)
    setColor(rowData.color)

    fetchAllSubCategory(rowData.categoryid)
    fetchAllProduct(rowData.categoryid, rowData.subcategoryid)
    fetchAllSize(rowData.categoryid, rowData.subcategoryid, rowData.productid)

    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  // ............................
  //FetchAll Color
  const fetchAllColor = async () => {
    var result = await getData('color/display_all_color')
    setColors(result.data)
  }
  useEffect(function () {
    fetchAllColor()
  }, [])
  //.......................

  const showColor = () => {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container className={classes.gridStyle} spacing={2}>
            <Grid item xs={12} className={classes.headingText}>
              Edit Color
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
                  onChange={handleSizeChange}
                >
                  <MenuItem>Choose Size</MenuItem>
                  {fillSize()}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" label="Color Name" fullWidth value={color} onChange={(event) => setColor(event.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <Button onClick={handleEditColor} fullWidth variant="contained" color="primary">Edit</Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth onClick={handleDeleteColor} variant="contained" color="primary">Delete</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function displayAllColor() {
    return (
      <MaterialTable
        title="List Of Color"
        columns={[
          { title: 'Id', field: 'colorid' },
          { title: 'Category', field: 'cn' },
          { title: 'Subcategory', field: 'sn' },
          { title: 'Product', field: 'pn' },
          { title: 'Size', field: 'size' },
          { title: 'Color', field: 'color' },
        ]}
        data={colors}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (event, rowData) => handleOpen(rowData)
          },
          {
            icon: 'add',
            tooltip: 'Add Color',
            isFreeAction: true,
            onClick: (event) => navigate('/dashboard/color')
          }

        ]}
      />
    )
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        {displayAllColor()}
      </div>
      {showColor()}
    </div>
  );
}


