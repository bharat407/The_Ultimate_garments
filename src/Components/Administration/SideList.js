import * as React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "@material-ui/core";

export default function SideList() {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <List component="nav">
          <React.Fragment>
            <Link
              href={"/dashboard"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/category"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Category" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/subcategory"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="SubCategory" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/product"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Product" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/size"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Size" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/color"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Color" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/dalle"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="AI-Image generation" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/bannerimages"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Banner Images" />
              </ListItemButton>
            </Link>
          </React.Fragment>

          <Divider style={{ width: "90%" }} />

          <React.Fragment>
            <Link
              href={"/dashboard/displayallcategory"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="DisplayCategory" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/displayallsubcategory"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="DisplaySubCategory" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/displayallproduct"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="DisplayProduct" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/displayallsize"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="DisplaySize" />
              </ListItemButton>
            </Link>

            <Link
              href={"/dashboard/displayallcolor"}
              style={{ textDecoration: "None", color: "black" }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="DisplayColor" />
              </ListItemButton>
            </Link>
          </React.Fragment>
        </List>
      </div>
    </div>
  );
}
