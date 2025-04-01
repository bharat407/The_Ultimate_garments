import React, { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import useMediaQuery from "@mui/material/useMediaQuery";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
// Component..........................
import SizeChart from "./SizeChart";
import PlusMinusComponent from "./PlusMinusComponent";
import ColorRadio from "./ColorRadio";
import DeliveryOptions from "./DeliveryOptions";
// Service
import { postData } from "../../Services/NodeServices";
// Redux Fn
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetailsFilling(props) {
  var navigate = useNavigate();

  var product = JSON.parse(props.productInfo);
  var dispatch = useDispatch();

  var cart = useSelector((state) => state.cart);
  var selectedProduct = cart[product.productid];
  var keys = Object.keys(cart);
  var selectedQty = null;

  if (keys?.length > 0) {
    var selectedQty = selectedProduct?.qty;
    product["size"] = selectedProduct?.size;
    product["color"] = selectedProduct?.color;
    product["qty"] = selectedProduct?.qty;
  }

  // Size and Color Manupilation..................
  const [size, setSize] = useState([]);
  const [colors, setColors] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(selectedQty);

  const fetchAllSize = async () => {
    var result = await postData(
      "userinterface/display_all_color_by_productid",
      { productid: product.productid }
    );
    // var sizes = Object.values(JSON.parse(result.data[0].size))
    console.log("SIZEEEEEEEEEEEEEE:", result.data);
    var sizes = result.data.map((item) => {
      if (
        keys > 0 &&
        selectedProduct != "undefined" &&
        selectedProduct?.size == item.size
      ) {
        fetchAllColors(item.size);
        return { size: item.size, status: true };
      } else {
        return { size: item.size, status: false };
      }
    });
    setSize(sizes);
  };
  useEffect(function () {
    fetchAllSize();
  }, []);

  const handleSize = (index) => {
    setSelectedColor(null);
    setQty(null);

    var temp = size.map((item) => {
      return { size: item.size, status: false };
    });
    temp[index].status = true;
    setSelectedSize(temp[index].size);
    setSize([...temp]);

    product["size"] = temp[index].size;
    if (selectedSize != null && selectedColor != null)
      dispatch({ type: "ADD_CART", payload: [product.productid, product] });

    fetchAllColors(temp[index].size);
  };
  const showSize = () => {
    return size.map((item, i) => {
      return (
        <span
          onClick={() => handleSize(i)}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 47,
            width: 47,
            textAlign: "center",
            fontSize: 13,
            marginRight: 5,
            cursor: "pointer",
            border: item.status ? "2px solid #51cccc" : "1px solid #ddd",
            borderRadius: 50,
          }}
        >
          {item.size}
        </span>
      );
    });
  };

  const fetchAllColors = async (sizeid) => {
    var result = await postData("userinterface/display_all_color_by_size", {
      productid: product.productid,
      size: sizeid,
    });

    var pcolor = JSON.parse(result.data[0].color);
    setColors(pcolor);
  };
  const handleColor = (value) => {
    setSelectedColor(value);
    setQty(0);
    product["color"] = value;
    if (selectedSize != null && selectedColor != null)
      dispatch({ type: "ADD_CART", payload: [product.productid, product] });
  };
  //.............................................

  // Heart Manupilation..........................
  const [heart, setHeart] = useState(false);
  const matches = useMediaQuery("(max-width:720px)");
  const handleFavoriteHeart = () => {
    setHeart(true);
  };
  const handleHeart = () => {
    setHeart(false);
  };
  //..............................................

  // Store the Data In Redux Container............
  const handleQtyChange = (value) => {
    if (selectedSize != null && selectedColor != null) {
      if (value == 0) {
        dispatch({
          type: "DELETE_CART",
          payload: [product.productid, product],
        });
      } else {
        product["qty"] = value;
        product["size"] = selectedSize;
        product["color"] = selectedColor;
        dispatch({ type: "ADD_CART", payload: [product.productid, product] });
        setQty(value);
      }
    } else {
      Swal.fire("Pls Select Size & Color Both");
      setQty(null);
    }

    props.updateCart();
  };
  //...............................................

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {matches ? (
            <span style={{ fontSize: 25, fontWeight: 700 }}>
              {product.productname}
            </span>
          ) : (
            <>
              <span style={{ fontSize: 25, fontWeight: 700 }}>
                {product.productname}
              </span>
              {heart ? (
                <span
                  onClick={handleHeart}
                  style={{ marginLeft: 70, cursor: "pointer" }}
                >
                  <FavoriteIcon style={{ color: "red" }} />
                </span>
              ) : (
                <span
                  onClick={handleFavoriteHeart}
                  style={{ marginLeft: 70, cursor: "pointer" }}
                >
                  <FavoriteBorderIcon />
                </span>
              )}
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          {product.offerprice ? (
            <>
              <span style={{ fontSize: 20, fontWeight: 700 }}>
                PRICE:&nbsp;&#8377;{product.offerprice}
              </span>
              &nbsp;&nbsp;
              <span
                style={{
                  color: "#a7a7a7",
                  fontSize: 17,
                  textDecoration: "line-through",
                }}
              >
                &#8377;{product.price}
              </span>
              &nbsp;&nbsp;
              <span style={{ fontSize: 18, fontWeight: 700, color: "#4d9d0b" }}>
                (&#8377;{product.price - product.offerprice} off)
              </span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 20, fontWeight: 700 }}>
                PRICE:&nbsp;&#8377;{product.price}
              </span>
            </>
          )}
          <div>
            <span style={{ fontSize: 15 }}>Inclusive of All Taxes +</span>
            &nbsp;&nbsp;
            <span style={{ color: "#efb30b", fontWeight: 600 }}>
              Free Shipping
            </span>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ display: "flex" }}>
            <span style={{ marginRight: 200 }}>SIZE</span>
            <span>
              <SizeChart />
            </span>
          </div>
          <div
            style={{
              marginTop: 15,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {showSize()}
          </div>
        </Grid>
        <Grid item xs={10}>
          <ColorRadio
            colorlist={colors}
            onClick={(value) => handleColor(value)}
            colorName={selectedProduct && selectedProduct.color}
          />
        </Grid>
        <Grid item xs={5}>
          <PlusMinusComponent
            value={qty}
            onChange={(value) => handleQtyChange(value)}
          />
        </Grid>
        <Grid item xs={5}>
          <Button
            fullWidth
            variant="contained"
            style={{
              height: "100%",
              background: "#ffb8b8",
              color: "#000",
              cursor: "pointer",
            }}
            startIcon={<ArrowCircleRightOutlinedIcon />}
          >
            Buy Now
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => navigate("/home")}
            style={{
              width: "83.3%",
              background: "#1e90ff",
              height: "123%",
              color: "#000",
            }}
            startIcon={<ArrowCircleRightOutlinedIcon />}
          >
            Continue Shopping
          </Button>
        </Grid>
        <Grid item xs={10}>
          <DeliveryOptions />
        </Grid>
      </Grid>
    </div>
  );
}
