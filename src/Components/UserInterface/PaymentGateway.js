import React, { useEffect, useState } from "react";
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

const PaymentGateway = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart data from Redux store
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const userData = Object.values(user)[0] || {};

  // Calculate total amount
  const tpay = Object.values(cart).reduce((total, item) => {
    const price = item.offerprice > 0 ? item.offerprice : item.price;
    return total + price * item.qty;
  }, 0);

  // Handle payment success
  const handlePaymentSuccess = async (paymentId) => {
    try {
      setLoading(true);
      
      const products = Object.values(cart).map((item) => ({
        productId: item._id,
        quantity: item.qty,
        price: item.offerprice > 0 ? item.offerprice : item.price
      }));

      const orderData = {
        userId: userData._id,
        products,
        paymentId,
        amount: tpay,
        email: userData.emailid,
        status: "COMPLETED"
      };

      const result = await postData("api/orders/create", orderData);

      if (result?.id) {
        dispatch({ type: "EMPTY_CART", payload: [] });
        navigate("/order-confirmation", { 
          state: { 
            orderId: result.id,
            amount: tpay,
            paymentId 
          } 
        });
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      setError("Payment successful but order failed");
      setLoading(false);
    }
  };

  // Initialize payment immediately
  const initializePayment = () => {
    try {
      const options = {
        key: "rzp_test_t4LUM04KXw6wHc",
        amount: Math.round(tpay * 100),
        currency: "INR",
        name: "TheUltimateGarments.com",
        description: "Order Payment",
        image: `${ServerURL}/images/logo.png`,
        handler: (response) => {
          handlePaymentSuccess(response.razorpay_payment_id);
        },
        theme: {
          color: "#51cccc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to initialize payment");
      setLoading(false);
    }
  };

  // Load Razorpay script and initialize payment on mount
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setLoading(false);
        initializePayment();
      };
      script.onerror = () => {
        setError("Failed to load payment gateway");
        setLoading(false);
      };
      document.body.appendChild(script);
    } else {
      setLoading(false);
      initializePayment();
    }
  }, []);

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "red" }}>{error}</h2>
        <button onClick={() => navigate("/mycart")}>
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Processing your payment...</h2>
      <SyncLoader color="#36D7B7" loading={loading} css={override} size={15} />
    </div>
  );
};

export default PaymentGateway;