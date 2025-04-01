// Component
import { Button, Grid } from "@material-ui/core"
// Style
import { useStyles } from "./DisplayAllSizeCss"
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

export default function DisplayAllSize() {
  // Style
  var classes = useStyles()
  // Navigate
  var navigate = useNavigate()

  // State
  const [sizes, setSizes] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [categoryId, setCategoryId] = useState()
  const [subCategoryList, setSubCategoryList] = useState([])
  const [subCategoryId, setSubCategoryId] = useState()
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState()
  const [sizeId, setSizeId] = useState()
  const [size, setSize] = useState([])
  const [open, setOpen] = useState(false)

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



  // Material Dialog....
  const handleEditSize = async () => {
    setOpen(false)
    var body = { productid: productId, categoryid: categoryId, subcategoryid: subCategoryId, size: JSON.stringify(size), sizeid: sizeId }
    var result = await postData('size/edit_size_data', body)

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
    fetchAllSize()
  }
  const handleDeleteSize = async () => {
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

        var body = { sizeid: sizeId }
        var result = await postData('size/delete_size_data', body)
        if (result.status) {
          Swal.fire('Deleted!', '', 'success')
          fetchAllSize()
        }
        else {
          Swal.fire('Server Error!', '', 'error')
        }

      } else if (res.isDenied) {
        Swal.fire('Size are not deleted', '', 'info')
      }
    })

  }
  const handleOpen = (rowData) => {
    setSizeId(rowData.sizeid)
    setCategoryId(rowData.categoryid)
    setSubCategoryId(rowData.subcategoryid)
    setProductId(rowData.productid)
    setSize(JSON.parse(rowData.size))

    fetchAllSubCategory(rowData.categoryid)
    fetchAllProduct(rowData.categoryid, rowData.subcategoryid)

    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  // ............................
  //FetchAll Size
  const fetchAllSize = async () => {
    var result = await getData('size/display_all_size')
    setSizes(result.data)
  }
  useEffect(function () {
    fetchAllSize()
  }, [])
  //.......................

  const showSize = () => {
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
              Edit Size
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
              <Button onClick={handleEditSize} fullWidth variant="contained" color="primary">Edit</Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth onClick={handleDeleteSize} variant="contained" color="primary">Delete</Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function displayAllSize() {
    return (
      <MaterialTable
        title="List Of Size"
        columns={[
          { title: 'Id', field: 'sizeid' },
          { title: 'Category', field: 'cn' },
          { title: 'Subcategory', field: 'sn' },
          { title: 'Product', field: 'pn' },
          { title: 'Size', field: 'size' },
        ]}
        data={sizes}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (event, rowData) => handleOpen(rowData)
          },
          {
            icon: 'add',
            tooltip: 'Add Size',
            isFreeAction: true,
            onClick: (event) => navigate('/dashboard/size')
          }

        ]}
      />
    )
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        {displayAllSize()}
      </div>
      {showSize()}
    </div>
  );
}


