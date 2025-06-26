import React, { useState, useEffect } from "react";
import { Button, Grid, CircularProgress, TextField } from "@mui/material";
import DiscountIcon from "@mui/icons-material/Discount";
import Signup from "./Signup";
import { useNavigate } from "react-router";
import { postData, isValidAuth } from "../../Services/NodeServices";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import CheckoutWithAddress from "../CheckoutWithAddress";

export default function CouponAndPriceDetail(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, addresses } = useSelector((state) => state);
  const userEmail = user ? Object.keys(user)[0] : null;
  const userData = userEmail ? user[userEmail] : {};

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [authState, setAuthState] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await isValidAuth();

      if (result.auth) {
        setAuthState(true);
        dispatch({ type: "ADD_USER", payload: [result.email, result] });

        // Only fetch address if not already in Redux
        if (result.email && (!addresses || !addresses[result.email])) {
          try {
            setLoading(true);
            const res = await postData(`address/display_email/${result.email}`);
            dispatch({
              type: "SET_ADDRESSES",
              payload: {
                email: result.email,
                addresses: res,
              },
            });
          } catch (error) {
            Swal.fire("Error", "Failed to fetch address", "error");
          } finally {
            setLoading(false);
          }
        }
      } else {
        setAuthState(false);
      }
    };

    fetchData();
  }, [dispatch, addresses]); // Add addresses as a dependency

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
    setAddressDialogOpen(true);
  };

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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          background: "#fff",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", margin: 20 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div style={{ display: "flex", textAlign: "center" }}>
                <DiscountIcon style={{ color: "#000", marginTop: 5 }} />
                <span style={{ color: "#535353" }}>
                  Have a coupon/referral code?
                </span>
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
              <Button style={{ background: "pink", color: "black" }}>
                APPLY
              </Button>
            </Grid>

            <Grid item xs={12}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>
                PRICE DETAILS ({values.length} items)
              </div>
            </Grid>
            <Grid item xs={12}>
              <hr color="#ABABAB" />
            </Grid>

            <Grid item xs={6}>
              <div>Total MRP (Inc. of Taxes)</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ textAlign: "right" }}>₹{aamt}</div>
            </Grid>

            <Grid item xs={6}>
              <div>Discount:</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ textAlign: "right" }}>-₹{aamt - tpay}</div>
            </Grid>

            <Grid item xs={6}>
              <div>Shipping</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ textAlign: "right", color: "#2ecc71" }}>Free</div>
            </Grid>

            <Grid item xs={12}>
              <hr color="#ABABAB" />
            </Grid>

            <Grid item xs={6}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Total Amount</div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{ textAlign: "right", fontWeight: 700, fontSize: 18 }}
              >
                ₹{tpay}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div
                style={{
                  textAlign: "center",
                  background: "#2ecc71",
                  color: "#fff",
                  padding: 7,
                }}
              >
                You Saved ₹{aamt - tpay} on this order
              </div>
            </Grid>

            <Grid item xs={12}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  onClick={values.length > 0 ? handleCheckout : null}
                  style={{
                    boxShadow: "0px 0px 4px 0px grey",
                    background: values.length > 0 ? "#51CBCC" : "#cccccc",
                    fontSize: 20,
                    fontWeight: 600,
                    width: "70%",
                    padding: 10,
                    borderRadius: 5,
                    color: "#000000",
                    cursor: values.length > 0 ? "pointer" : "not-allowed",
                    textAlign: "center",
                    opacity: values.length > 0 ? 1 : 0.6,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "#fff" }} />
                  ) : (
                    "CHECKOUT NOW"
                  )}
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>

      <Signup open={open} setOpen={setOpen} />
      <CheckoutWithAddress
        open={addressDialogOpen}
        onClose={closeAddressDialog}
        totalAmount={tpay}
      />
    </div>
  );
}
