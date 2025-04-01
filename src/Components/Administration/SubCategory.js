// Component
import { TextField, Button, Grid } from "@mui/material";
// Use State 
import { useState, useEffect } from "react";
// Avatar
import Avatar from '@mui/material/Avatar';
// Styles
import { useStyles } from "./SubCategoryCss";
//Service
import { getData, postData } from "../Services/NodeServices";
// DropDown 
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Sweet Alert
import Swal from "sweetalert2"
// Use Navigate For Call Another Component
import { useNavigate } from "react-router";



export default function SubCategory(props) {
    var classes = useStyles()
    var navigate = useNavigate()

    const [categoryId, setCategoryId] = useState()
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryName, setSubCategoryName] = useState()
    const [subCategoryIcon, setSubCategoryIcon] = useState({ url: '/icon.png', bytes: '' })
    const [bannerPriority, setBannerPriority] = useState('')

    const handleIcon = (event) => {
        setSubCategoryIcon({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    }

    const handleSubmit = async () => {
        var formData = new FormData()
        formData.append('categoryid', categoryId)
        formData.append('subcategoryname', subCategoryName)
        formData.append('icon', subCategoryIcon.bytes)
        formData.append('bannerpriority', bannerPriority)

        var result = await postData('subcategory/add_new_subcategory', formData, true)

        if (result.result) {
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

        setSubCategoryName('')
        setSubCategoryIcon({ url: '/icon.png', bytes: '' })
    }
    const handleReset = () => {
        setCategoryId('')
        setSubCategoryName('')
        setSubCategoryIcon({ url: '/icon.png', bytes: '' })
    }
    // DropDown Manupilation.......
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
    // ..............................

    return (
        <div className={classes.maincontainer}>
            <div className={classes.box}>
                <Grid container spacing={2} className={classes.gridStyle}>
                    <Grid item xs={12} style={{ display: 'flex' }}>
                        <div className={classes.headingText}>
                            SubCategory Interface
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '30vw' }}>
                            <Avatar src={'/report.png'} style={{ width: 39 }} onClick={() => navigate('/dashboard/displayallsubcategory')} variant='square' />
                        </div>
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
                    <Grid item xs={6} className={classes.center}>
                        <Button variant="contained" component="label" color="primary" fullWidth onChange={handleIcon}>
                            Upload
                            <input hidden accept="image/*" multiple type="file" />
                        </Button>
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Avatar
                            alt="SubCategory Icon"
                            src={subCategoryIcon.url}
                            sx={{ width: 70, height: 70 }}
                            variant="square"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={handleSubmit} fullWidth variant="contained" color="primary">Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={handleReset} fullWidth variant="contained" color="primary">Reset</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )


}




