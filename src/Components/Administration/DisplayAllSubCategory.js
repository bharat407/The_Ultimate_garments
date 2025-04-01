// Component
import { TextField, Button, Grid, Avatar } from "@material-ui/core";
// Styles
import { useStyles } from "./DisplayAllSubCategoryCss";
// State
import { useEffect, useState } from "react";
// Services
import { getData, postData, ServerURL } from "../Services/NodeServices";
// Material Table
import MaterialTable from "@material-table/core"
// Material Dialog 
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// DropDown
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Use Navigate For Call Another Component
import { useNavigate } from "react-router";
// Sweet Alert
import Swal from "sweetalert2"

export default function DisplayAllSubCategory() {
    // Style
    var classes = useStyles()
    // Navigate For using Call SubCategory
    var navigate = useNavigate()

    // State
    const [subCategories, setSubCategories] = useState([])
    const [subCategoryId, setSubCategoryId] = useState()
    const [categoryList, setCategoryList] = useState([])
    const [categoryId, setCategoryId] = useState()
    const [subCategoryName, setSubCategoryName] = useState()
    const [subCategoryIcon, setSubCategoryIcon] = useState({ url: '/icon.png', bytes: '' })
    const [bannerPriority, setBannerPriority] = useState('')
    const [open, setOpen] = useState(false)
    const [btnStatus, setBtnStatus] = useState(false)
    const [uploadBtn, setUploadBtn] = useState(false)
    const [oldIcon, setOldIcon] = useState('')
    const [oldPic, setOldPic] = useState('')

    // Icon Change fn
    const handleIcon = (event) => {
        setSubCategoryIcon({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
        setBtnStatus(true)
        setUploadBtn(true)
    }
    // Fetch All SubCategory
    const fetchAllSubCategory = async () => {
        var result = await getData('subcategory/display_all_subcategory')
        setSubCategories(result.data)
    }
    // Form Data Edit fn
    const handleEditSubCategory = async () => {
        setOpen(false)

        var body = { categoryid: categoryId, subcategoryid: subCategoryId, subcategoryname: subCategoryName, bannerpriority: bannerPriority }
        var result = await postData('subcategory/edit_subcategory_data', body)

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

        fetchAllSubCategory()
    }
    // Form Data Delete fn
    const handleDeleteSubCategory = async () => {
        setOpen(false)

        Swal.fire({
            title: 'Do you want to delete the subcategory?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'delete',
            denyButtonText: `Don't Delete`,
        }).then(async (res) => {
            /* Read more about isConfirmed, isDenied below */
            if (res.isConfirmed) {

                var body = { subcategoryid: subCategoryId }
                var result = await postData('subcategory/delete_subcategory_data', body)

                if (result.status) {
                    Swal.fire('Deleted!', '', 'success')
                    fetchAllSubCategory()
                }
                else {
                    Swal.fire('Server Error!', '', 'error')
                }

            } else if (res.isDenied) {
                Swal.fire('SubCategory are not deleted', '', 'info')
            }
        })

    }
    // Open Dialog
    const handleOpen = (rowData) => {
        setSubCategoryId(rowData.subcategoryid)
        setCategoryId(rowData.categoryid)
        setSubCategoryName(rowData.subcategoryname)
        setSubCategoryIcon({ url: `${ServerURL}/images/${rowData.subcategoryicon}`, bytes: '' })
        setOldIcon(`${ServerURL}/images/${rowData.subcategoryicon}`)
        setOldPic(`${rowData.subcategoryicon}`)
        setBannerPriority(rowData.bannerpriority)
        setOpen(true)
    }
    // Close Dialog
    const handleClose = () => {
        setOpen(false)
    }
    const handleCancel = () => {
        setSubCategoryIcon({ url: oldIcon, bytes: '' })
        setBtnStatus(false)
        setUploadBtn(false)
    }
    // Create a Dynamic Button  
    const saveAndCancelButton = () => {
        return (
            <div>
                {btnStatus ? <div style={{ display: 'flex', justifyContent: 'space-between', width: '110%' }} ><Button onClick={handleSavePicture} color="primary" variant="contained">Save</Button><Button onClick={handleCancel} color="secondary" variant="contained">Cancel</Button></div> : <></>}
            </div>
        )
    }
    // Edit Picture
    const handleSavePicture = async () => {
        setOpen(false)

        var formData = new FormData()
        formData.append('subcategoryid', subCategoryId)
        formData.append('subcategoryicon', subCategoryIcon.bytes)
        formData.append('oldpic', oldPic)
        var result = await postData('subcategory/update_icon', formData, true)

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
        fetchAllSubCategory()
    }
    // Drop Down.............. 
    const handleChange = (event) => {
        setCategoryId(event.target.value)
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
    //........................

    useEffect(function () {
        fetchAllSubCategory()
    }, [])


    // Material Dialog
    const showSubCategory = () => {
        return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Grid container spacing={2} className={classes.gridStyle}>
                        <Grid item xs={12} className={classes.headingText}>
                            Edit SubCategory
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={categoryId}
                                    label="Category"
                                    onChange={handleChange}
                                >
                                    {fillCategories()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField value={subCategoryName} onChange={(event) => setSubCategoryName(event.target.value)} variant="outlined" fullWidth label="SubCategory Name" />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={bannerPriority}
                                    label="Priority"
                                    onChange={(event) => setBannerPriority(event.target.value)}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handleEditSubCategory} fullWidth variant="contained" color="primary">Edit</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button onClick={handleDeleteSubCategory} fullWidth variant="contained" color="primary">Delete</Button>
                        </Grid>
                        <Grid item xs={4} className={classes.center}>
                            <Button disabled={uploadBtn} color="primary" variant="contained" component="label" fullWidth onChange={handleIcon}>
                                Upload
                                <input hidden accept="image/*" multiple type="file" />
                            </Button>
                        </Grid>
                        <Grid item xs={4} className={classes.center}>
                            <Avatar
                                alt="SubCategory Icon"
                                src={subCategoryIcon.url}
                                sx={{ width: 70, height: 70 }}
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

    // Material Table
    function displayAllSubCategory() {
        return (
            <MaterialTable
                title="List of SubCategories"
                columns={[
                    { title: 'Id', field: 'subcategoryid' },
                    { title: 'Category', field: 'cn' },
                    { title: 'SubCategory', field: 'subcategoryname' },
                    { title: 'Banner Priority', field: 'bannerpriority' },
                    { title: 'Icon', render: (rowData) => <img src={`${ServerURL}/images/${rowData.subcategoryicon}`} width='50' style={{ borderRadius: 5 }} /> },
                ]}
                data={subCategories}
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'Edit SubCategory',
                        onClick: (event, rowData) => handleOpen(rowData)
                    },
                    {
                        icon: 'add',
                        tooltip: 'Add SubCategory',
                        isFreeAction: true,
                        onClick: (event) => navigate('/dashboard/subcategory')
                    }
                ]}
            />
        )
    }


    return (
        <div className={classes.mainContainer}>
            <div className={classes.box}>
                {displayAllSubCategory()}
            </div>
            {showSubCategory()}
        </div>
    )
}


