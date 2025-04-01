// Component
import { TextField, Button, Grid, Avatar } from "@material-ui/core"
// Style
import { useStyles } from "./DisplayAllProductCss"
// Matrial Table
import MaterialTable from "@material-table/core"
// Services
import { getData, ServerURL, postData } from "../Services/NodeServices"
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

export default function DisplayAllProduct() {
  // Style
  var classes = useStyles()
  // Navigate
  var navigate = useNavigate()

  // State
  const [products, setProducts] = useState()
  const [productId, setProductId] = useState()
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
  const [open, setOpen] = useState(false)
  const [btnStatus, setBtnStatus] = useState(false)
  const [uploadBtn, setUploadBtn] = useState(false)
  const [oldIcon, setOldIcon] = useState('')
  const [oldPic, setOldPic] = useState('')

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
    setBtnStatus(true)
    setUploadBtn(true)
    setIcon({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
  }
  // Material Dialog
  const handleEditProduct = async () => {
    setOpen(false)
    var body = { 'productid': productId, 'categoryid': categoryId, 'subcategoryid': subCategoryId, 'productname': productName, 'price': price, 'offerprice': offerPrice, 'stock': stock, 'description': description, 'rating': rating, 'status': status, 'salestatus': saleStatus }
    var result = await postData('product/edit_product_data', body)

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
    fetchAllProduct()
  }
  const handleDeleteProduct = async () => {
    setOpen(false)

    Swal.fire({
      title: 'Do you want to delete the Product?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'delete',
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {

        var body = { 'productid': productId }
        var result = await postData('product/delete_product_data', body)
        if (result.status) {
          Swal.fire('Deleted!', '', 'success')
          fetchAllProduct()
        }
        else {
          Swal.fire('Server Error!', '', 'error')
        }

      } else if (res.isDenied) {
        Swal.fire('Product are not deleted', '', 'info')
      }
    })

  }
  const handleSavePicture = async () => {
    setOpen(false)

    var formData = new FormData()
    formData.append('productid', productId)
    formData.append('icon', icon.bytes)
    formData.append('oldpic', oldPic)
    var result = await postData('product/update_icon', formData, true)

    if (result.status) {
      Swal.fire({
        icon: 'success',
        title: 'Picture Updated Successfully',
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      })
    }

    setUploadBtn(false)
    setBtnStatus(false)
    setOldIcon('')
    fetchAllProduct()
  }
  const handleOpen = (rowData) => {
    setProductId(rowData.productid)
    setCategoryId(rowData.categoryid)
    setSubCategoryId(rowData.subcategoryid)
    setProductName(rowData.productname)
    setPrice(rowData.price)
    setOfferPrice(rowData.offerprice)
    setStock(rowData.stock)
    setDescription(rowData.description)
    setRating(rowData.rating)
    setStatus(rowData.status)
    setSaleStatus(rowData.salestatus)
    setIcon({ url: `${ServerURL}/images/${rowData.icon}`, bytes: '' })
    setOldIcon(`${ServerURL}/images/${rowData.icon}`)
    setOldPic(`${rowData.icon}`)

    fetchAllSubCategory(rowData.categoryid)

    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleCancel = () => {
    setIcon({ url: oldIcon, bytes: '' })
    setUploadBtn(false)
    setBtnStatus(false)

  }
  const saveAndCancelButton = () => {
    return (
      <div>
        {btnStatus ? <div style={{ display: 'flex', justifyContent: 'space-between', width: '110%' }}><Button color="primary" onClick={handleSavePicture} variant="contained" >Save</Button><Button onClick={handleCancel} color="secondary" variant="contained">Cancel</Button></div> : <></>}
      </div>
    )
  }
  // ............................
  //FetchAll Product
  const fetchAllProduct = async () => {
    var result = await getData('product/display_all_product')
    setProducts(result.data)
  }
  useEffect(function () {
    fetchAllProduct()
  }, [])
  //.......................

  const showProduct = () => {
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
              Edit Product
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
              <TextField fullWidth value={productName} onChange={(event) => setProductName(event.target.value)} variant="outlined" label="Product Name" />
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
            <Grid item xs={6}>
              <Button fullWidth onClick={handleEditProduct} variant="contained" color="primary">Edit</Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth onClick={handleDeleteProduct} variant="contained" color="primary">Delete</Button>
            </Grid>
            <Grid item xs={4} className={classes.center}>
              <Button variant="contained" disabled={uploadBtn} component="label" color="primary" fullWidth onChange={handleIcon}>
                Upload
                <input hidden accept="image/*" multiple type="file" />
              </Button>
            </Grid>
            <Grid item xs={4} className={classes.center}>
              <Avatar
                alt="Product Icon"
                src={icon.url}
                style={{ width: 70, height: 70 }}
                variant="square"
              />
            </Grid>
            <Grid item xs={4} className={classes.center}>
              {saveAndCancelButton()}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  function displayAllProduct() {
    return (
      <MaterialTable
        title="List Of Product"
        columns={[
          { title: 'Id', field: 'productid' },
          { title: 'Category/SubCategory', render: (rowData) => <div style={{ display: 'flex', flexDirection: 'column' }}><div>{rowData.cn}</div><div>{rowData.sn}</div></div> },
          { title: 'Name', field: 'productname' },
          { title: 'Price', render: (rowData) => <div style={{ display: 'flex', flexDirection: 'column' }}><div>{rowData.offerprice > 0 ? <><div><b>Price:</b><s>{rowData.price}</s></div><div><b>Offer:</b>{rowData.offerprice}</div></> : rowData.price}</div><div><b>Stock:</b>{rowData.stock}</div></div> },
          { title: 'Description', field: 'description' },
          { title: 'Rating', field: 'rating' },
          { title: 'Status', render: (rowData) => <div style={{ display: 'flex', flexDirection: 'column' }}><div>{rowData.status}</div><div><b>SaleStatus:</b>{rowData.salestatus}</div></div> },
          { title: 'Icon', render: (rowData) => <img src={`${ServerURL}/images/${rowData.icon}`} width='50' height='50' style={{ borderRadius: 5 }} /> },

        ]}
        data={products}
        actions={[
          {
            icon: 'edit',
            tooltip: 'Edit',
            onClick: (event, rowData) => handleOpen(rowData)
          },
          {
            icon: 'add',
            tooltip: 'Add Product',
            isFreeAction: true,
            onClick: (event) => navigate('/dashboard/product')
          }

        ]}
      />
    )
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        {displayAllProduct()}
      </div>
      {showProduct()}
    </div>
  );
}


