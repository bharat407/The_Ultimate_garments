// Styles
import { useStyles } from "./CategoryCss";
// Components
import { TextField, Button, Grid } from "@mui/material";
// Avatar 
import Avatar from '@mui/material/Avatar';
// UseState
import { useState, useEffect } from "react";
// PostData
import { postData } from "../Services/NodeServices";
// Sweet Alert
import Swal from "sweetalert2"
// Use Navigate For Call Another Component
import { useNavigate } from "react-router";

export default function Category(props) {
    var classes = useStyles()
    var navigate = useNavigate()

    const [categoryName, setCategoryName] = useState('')
    const [icon, setIcon] = useState({ url: '/icon.png', bytes: '' })

    const handleIcon = (event) => {
        setIcon({ url: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    }

    const handleSubmit = async () => {

        var formData = new FormData()
        formData.append('categoryname', categoryName)
        formData.append('icon', icon.bytes)
        var result = await postData('category/add_new_category', formData, true)

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

        setCategoryName('')
        setIcon({ url: '/icon.png', bytes: '' })

    }
    const handlreset = () => {
        setCategoryName('')
        setIcon({ url: '/icon.png', bytes: '' })
    }

    return (
        <div className={classes.mainContainer}>
            <div className={classes.box}>

                <Grid container className={classes.gridStyle} spacing={2}>
                    <Grid item xs={12} style={{ display: 'flex' }}>
                        <div className={classes.headingText}>
                            Category Interface
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '24vw' }}>
                            <Avatar src={'/report.png'} style={{ width: 39 }} onClick={() => navigate('/dashboard/displayallcategory')} variant="square" />
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField value={categoryName} onChange={(event) => setCategoryName(event.target.value)} fullWidth label="Category Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Button variant="contained" component="label" fullWidth onChange={handleIcon}>
                            Upload
                            <input hidden accept="image/*" multiple type="file" />
                        </Button>
                    </Grid>
                    <Grid item xs={6} className={classes.center}>
                        <Avatar
                            alt="Category Icon"
                            src={icon.url}
                            sx={{ width: 70, height: 70 }}
                            variant="square"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth color="primary" variant="contained" onClick={handleSubmit} >Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth color="primary" variant="contained" onClick={handlreset} >Reset</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    );

}


