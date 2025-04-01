import React from "react";
import { ServerURL } from "../../Services/NodeServices";
import { useNavigate } from "react-router";
export default function ThreeCardComponent(props) {
  var navigate = useNavigate();
  const handleProductDetails = (item) => {
    navigate("/setproductdetails", {
      state: { product: JSON.stringify(item) },
    });
  };
  return props.data.map((item) => {
    return (
      <div
        onClick={() => handleProductDetails(item)}
        style={{
          padding: 2,
          margin: 3,
          position: "relative",
          width: 405,
          height: "auto",
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        <img
          title={item.subcategoryname}
          src={`${ServerURL}/images/${item.icon}`}
          style={{ width: "100%", height: "100%" }}
        />
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            position: "absolute",
            top: "93%",
            width: "99%",
            height: 28,
            textAlign: "center",
            color: "#FFF",
            zIndex: 1,
            background: "#0000002e",
          }}
        >
          {item.productname}
        </div>
      </div>
    );
  });
}
