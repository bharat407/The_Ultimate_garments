// State Management
import { useEffect, useState } from "react";
// Material Table
import MaterialTable from "@material-table/core";
// Component
import { Button, Grid, Avatar, TextField } from "@material-ui/core";
// Services
import { getData, postData, ServerURL } from "../Services/NodeServices";
// Styles
import { useStyles } from "./DisplayAllCategoryCss";
// Material Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// Sweet Alert
import Swal from "sweetalert2";
// Use Navigate For Call Another Component
import { useNavigate } from "react-router";

export default function DisplayAllCategory(props) {
  var classes = useStyles();

  var navigate = useNavigate();

  // States
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [icon, setIcon] = useState({ url: "/icon.png", bytes: "" });
  const [categoryId, setCategoryId] = useState("");
  const [btnStatus, setBtnStatus] = useState(false);
  const [oldIcon, setOldIcon] = useState("");
  const [uploadBtn, setUploadBtn] = useState(false);
  const [oldPic, setOldPic] = useState("");

  // change Image Src
  const handleIcon = (event) => {
    setIcon({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
    setBtnStatus(true);
    setUploadBtn(true);
  };
  // Fetch All Data For Material Table
  const fetchAllCategory = async () => {
    var data = await getData("category/display_all_category");
    setCategories(data.data);
  };
  // Modal
  const handleOpen = (rowData) => {
    setCategoryId(rowData.categoryid);
    setCategoryName(rowData.categoryname);
    setOldIcon(`${ServerURL}/images/${rowData.icon}`);
    setIcon({ url: `${ServerURL}/images/${rowData.icon}`, bytes: "" });
    setOldPic(`${rowData.icon}`);

    setOpen(true);
  };
  // Close Modal
  const handleClose = () => {
    setOpen(false);
  };
  // Edit Service
  const handleEditCategory = async () => {
    setOpen(false);
    var body = { categoryname: categoryName, categoryid: categoryId };
    var result = await postData("category/edit_category_data", body);

    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Record Updated Successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }

    fetchAllCategory();
  };
  // delete Service
  const handleDeleteCategory = async () => {
    setOpen(false);

    Swal.fire({
      title: "Do you want to delete the category?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { categoryid: categoryId };
        var result = await postData("category/delete_category_data", body);

        if (result.status) {
          Swal.fire("Deleted!", "", "success");
          fetchAllCategory();
        } else {
          Swal.fire("Server Error!", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Category are not deleted", "", "info");
      }
    });
  };
  //create a Dynamic Button
  const saveAndCancelButton = () => {
    return (
      <div>
        {btnStatus ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "110%",
            }}
          >
            <Button
              onClick={handleSavePicture}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };
  // Edit Picture
  const handleSavePicture = async () => {
    setOpen(false);

    var formData = new FormData();
    formData.append("categoryid", categoryId);
    formData.append("icon", icon.bytes);
    formData.append("oldpic", oldPic);

    var result = await postData("category/update_icon", formData, true);

    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Picture Updated Successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }

    setBtnStatus(false);
    setUploadBtn(false);
    setOldIcon("");
    fetchAllCategory();
  };
  const handleCancel = () => {
    setBtnStatus(false);
    setIcon({ url: oldIcon, bytes: "" });
    setUploadBtn(false);
  };
  // Call FetchAllCategory fn
  useEffect(function () {
    fetchAllCategory();
  }, []);

  // Dialog
  const showCategory = () => {
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div>
              <Grid className={classes.gridStyle} container spacing={2}>
                <Grid item className={classes.headingText} xs={12}>
                  Edit Category
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    fullWidth
                    variant="outlined"
                    label="Category Name"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={handleEditCategory}
                    color="primary"
                    variant="contained"
                  >
                    Edit
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={handleDeleteCategory}
                    color="primary"
                    variant="contained"
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item xs={4} className={classes.center}>
                  <Button
                    disabled={uploadBtn}
                    onChange={handleIcon}
                    fullWidth
                    variant="contained"
                    color="primary"
                    component="label"
                  >
                    Upload
                    <input hidden accept="image/*" multiple type="file" />
                  </Button>
                </Grid>
                <Grid item xs={4} className={classes.center}>
                  <Avatar
                    alt="Category"
                    src={icon.url}
                    sx={{ width: 80, height: 80 }}
                    variant="square"
                  />
                </Grid>
                <Grid item xs={4} className={classes.center}>
                  {saveAndCancelButton()}
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  // Material Table
  function displayCategories() {
    return (
      <MaterialTable
        title="List of Categories"
        columns={[
          { title: "Id", field: "categoryid" },
          { title: "Category", field: "categoryname" },
          {
            title: "Icon",
            render: (rowData) => (
              <img
                src={`${ServerURL}/images/${rowData.icon}`}
                width="40"
                style={{ borderRadius: 5 }}
              />
            ),
          },
        ]}
        data={categories}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Category",
            onClick: (event, rowData) => handleOpen(rowData),
          },
          {
            icon: "add",
            tooltip: "Add Category",
            isFreeAction: true,
            onClick: (event) => navigate("/dashboard/category"),
          },
        ]}
      />
    );
  }

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>{displayCategories()}</div>
      {showCategory()}
    </div>
  );
}
