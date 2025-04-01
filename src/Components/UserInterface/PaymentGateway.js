import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { ServerURL, postData } from "../Services/NodeServices";
import { useNavigate } from "react-router";
import { css } from "@emotion/react";
import SyncLoader from "react-spinners/SyncLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
});

const PaymentGateway = (props) => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#36D7B7");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const userData = Object.values(user)[0];

  const cart = useSelector((state) => state.cart);
  const values = Object.values(cart);

  /** 🔹 Calculate total payable amount */
  const totalPayableAmount = (a, b) => {
    const price =
      b.offerprice > 0 ? b.offerprice * Number(b.qty) : b.price * Number(b.qty);
    return a + price;
  };

  /** 🔹 Calculate actual amount without discount */
  const actualAmount = (a, b) => a + b.price * Number(b.qty);

  const tpay = values.reduce(totalPayableAmount, 0);
  const aamt = values.reduce(actualAmount, 0);

  console.log("Cart:", cart);
  console.log("Actual Amount (aamt):", aamt);
  console.log("Total Payable (tpay):", tpay);

  const options = {
    key: "rzp_test_GQ6XaPC6gMPNwH",
    amount: tpay * 100, // ✅ Corrected amount
    name: "TheUltimateGarments.com",
    image: `${ServerURL}/images/logo.png`,
    handler: async function (response) {
      alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

      const result = await postData("userinterface/submit_orders", {
        userid: userData.mobilenumber,
        mobilenumber: userData.mobilenumber,
        emailid: userData.emailid,
        orderdate: new Date(),
        products: cart,
      });

      if (result.status) {
        alert("Order Submitted Successfully!");
        dispatch({ type: "EMPTY_CART", payload: [] });
        window.location.href = "http://localhost:3000/home";
      } else {
        alert("Failed to submit order. Please try again.");
      }
    },
    prefill: {
      name: `${userData.firstname} ${userData.lastname}`,
      contact: userData.mobilenumber,
      email: userData.emailid,
    },
    theme: {
      color: "#51cccc",
      hide_topbar: false,
    },
  };

  const openPayModal = async () => {
    const rzp1 = new window.Razorpay(options);
    await rzp1.open();
    setLoading(false);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const { classes } = props;

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: "gray" }}>Redirecting to Razorpay, please wait...</h2>
      <SyncLoader color={color} loading={loading} css={override} size={25} />
      {openPayModal()}
    </div>
  );
};

export default withStyles(styles)(PaymentGateway);
