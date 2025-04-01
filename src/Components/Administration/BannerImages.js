// Styles
import { useStyles } from "./BannerImagesCss";
// Components
import { Button, Grid } from "@mui/material";
// UseState
import { useState } from "react";
// PostData
import { postData } from "../Services/NodeServices";
// Sweet Alert
import Swal from "sweetalert2";
// Drop Zone
import { DropzoneArea } from "material-ui-dropzone";

export default function BannerImages(props) {
  var classes = useStyles();
  const [getFiles, setFiles] = useState([]);

  const handleSubmit = async () => {
    var formData = new FormData();

    getFiles.forEach((item) => {
      formData.append("picture", item); // Fix input name
    });

    var result = await postData("banner/add_new_pictures", formData, true);

    if (result.status) {
      Swal.fire({
        icon: "success",
        title: "Record Submitted Successfully",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  const handleSave = (files) => {
    setFiles(files);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.box}>
        <Grid container className={classes.gridStyle} spacing={2}>
          <Grid item xs={12} style={{ display: "flex" }}>
            <div className={classes.headingText}>Banner Images Interface</div>
          </Grid>
          <Grid item xs={12}>
            <DropzoneArea
              onChange={handleSave}
              acceptedFiles={[
                "image/jpg",
                "image/png",
                "image/bmp",
                "image/webp",
              ]}
              filesLimit={5} // Ensure limit matches backend
              maxFileSize={5000000}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
