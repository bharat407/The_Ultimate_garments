import React, { useState } from "react";
// import SearchBar from './UserComponents/SearchBar';
import SearchBar from "./UserComponents/SearchBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from "react-router";

// Components....................
import ProductDetailsFilling from "./UserComponents/ProductDetailsFilling";
import ImageSlider from "./UserComponents/ImageSlider";
import RatingLogo from "./UserComponents/RatingLogo";
import ProductDetails from "./UserComponents/ProductDetails";
import Footer from "./UserComponents/Footer";

export default function SetProductDetails(props) {
  const [refresh, setRefresh] = useState(false);
  const updateCart = () => {
    setRefresh(!refresh);
  };

  var location = useLocation();
  var product = location.state.product;
  var productid = JSON.parse(product).productid;
  var categoryid = JSON.parse(product).categoryid;
  var subcategoryid = JSON.parse(product).subcategoryid;
  console.log("PROPS:", product);

  const matches = useMediaQuery("(max-width:720px)");

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItem: "center",
          textAlign: "center",
          letterSpacing: "2px",
          color: "black",
          background: "azure",
          fontWeight: 600,
          fontStyle: "italic",
        }}
      >
        <marquee direction="left">FREE SHIPPING ON ORDERS OVER ₹990 </marquee>
      </div>
      <SearchBar />

      {matches ? (
        <div
          style={{
            marginTop: 25,
            display: "flex",
            flexDirection: "column",
            marginLeft: 35,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <ImageSlider
              categoryid={categoryid}
              productid={productid}
              subcategoryid={subcategoryid}
            />
          </div>
          <div style={{ paddingLeft: 2, marginTop: 15, width: "100%" }}>
            <ProductDetailsFilling
              updateCart={updateCart}
              productInfo={product}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <ProductDetails />
          </div>
          <div style={{ marginTop: 20 }}>
            <RatingLogo />
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 25, display: "flex", flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "50%",
              }}
            >
              <ImageSlider
                categoryid={categoryid}
                subcategoryid={subcategoryid}
                productid={productid}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "50%",
                marginTop: 25,
              }}
            >
              <ProductDetailsFilling
                updateCart={updateCart}
                productInfo={product}
              />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <ProductDetails />
          </div>
          <div style={{ marginTop: 20 }}>
            <RatingLogo />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
