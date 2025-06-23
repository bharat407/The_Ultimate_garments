import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import Signup from "./Signup";
import { useNavigate } from "react-router";
import { postData, isValidAuth } from "../../Services/NodeServices";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import CheckoutWithAddress from "../CheckoutWithAddress"; // Import the address component

export default function CouponAndPriceDetail(props) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [userAddress, setUserAddress] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [authState, setAuthState] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false); // State for address dialog

  // ✅ Check JWT token on mount
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    const result = await isValidAuth();
    console.log("Auth check result:", result);

    if (result.auth) {
      setAuthState(true);
    } else {
      setAuthState(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkAuth();
    }, 100); // slight delay to ensure token is saved

    return () => clearTimeout(timeout);
  }, []);

  // ✅ Fetch user address only if logged in
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        setLoading(true);
        const result = await postData(`address/display_email/${user.email}`); // Use email
        setUserAddress(result);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch address", "error");
      } finally {
        setLoading(false);
      }
    };

    if (user.email) { // Use email
      fetchUserAddress();
    }
  }, [user.email]); // Use email

  // ✅ Checkout logic
  const handleCheckout = () => {
    if (!authState) {
      Swal.fire({
        icon: "warning",
        title: "Please login to continue",
        showConfirmButton: false,
        timer: 1500,
      });
      setOpen(true);
      return;
    }

    // Open the address dialog instead of navigating directly
    setAddressDialogOpen(true);
  };

  // 💰 Price calculation logic
  const totalPayableAmount = (a, b) =>
    a + (b.offerprice > 0 ? b.offerprice * b.qty : b.price * b.qty);
  const actualAmount = (a, b) => a + b.price * b.qty;

  const values = props.value || [];
  const tpay = values.reduce(totalPayableAmount, 0);
  const aamt = values.reduce(actualAmount, 0);

  const closeAddressDialog = () => {
    setAddressDialogOpen(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", background: "#fff", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", margin: 20 }}>
          <Grid container spacing={2}>
            {/* Coupon section */}
            <Grid item xs={12}>
              <div style={{ display: "flex", textAlign: "center" }}>
                <DiscountIcon style={{ color: "#000", marginTop: 5 }} />
                &nbsp;&nbsp;
                <span style={{ color: "#535353" }}>Have a coupon/referral code?</span>
              </div>
            </Grid>
            <Grid item xs={8}>
              <TextField
                color="secondary"
                margin="normal"
                fullWidth
                placeholder="Enter Code"
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <Button style={{ background: "pink", color: "black" }}>APPLY</Button>
            </Grid>

            {/* Price Details */}
            <Grid item xs={12}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>PRICE DETAILS ({values.length} items)</div>
            </Grid>
            <Grid item xs={12}><hr color="#ABABAB" /></Grid>

            <Grid item xs={6}><div>Total MRP (Inc. of Taxes)</div></Grid>
            <Grid item xs={6}><div style={{ textAlign: "right" }}>₹{aamt}</div></Grid>

            <Grid item xs={6}><div>Discount:</div></Grid>
            <Grid item xs={6}><div style={{ textAlign: "right" }}>-₹{aamt - tpay}</div></Grid>

            <Grid item xs={6}><div>Shipping</div></Grid>
            <Grid item xs={6}><div style={{ textAlign: "right", color: "#2ecc71" }}>Free</div></Grid>

            <Grid item xs={12}><hr color="#ABABAB" /></Grid>

            <Grid item xs={6}><div style={{ fontWeight: 700, fontSize: 18 }}>Total Amount</div></Grid>
            <Grid item xs={6}><div style={{ textAlign: "right", fontWeight: 700, fontSize: 18 }}>₹{tpay}</div></Grid>

            <Grid item xs={12}>
              <div style={{ textAlign: "center", background: "#2ecc71", color: "#fff", padding: 7 }}>
                You Saved ₹{aamt - tpay} on this order
              </div>
            </Grid>

            {/* Checkout Button */}
            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={handleCheckout}
                  style={{
                    boxShadow: "0px 0px 4px 0px grey",
                    background: "#51CBCC",
                    fontSize: 20,
                    fontWeight: 600,
                    width: "70%",
                    padding: 10,
                    borderRadius: 5,
                    color: "#fff",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "#fff" }} />
                  ) : (
                    "CHECKOUT SECURELY"
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      {/* Login Popup */}
      <Signup open={open} setOpen={setOpen} />

      {/* Address Selection Popup */}
      <CheckoutWithAddress
        open={addressDialogOpen}
        onClose={closeAddressDialog}
        totalAmount={tpay} // Pass the total amount
      />
    </div>
  );
}
