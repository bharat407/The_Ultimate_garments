import React, { useState, useEffect } from "react";
import { Button, Grid } from '@mui/material';
import DiscountIcon from '@mui/icons-material/Discount';
import TextField from '@mui/material/TextField';
import Signup from "./Signup";
import { useNavigate } from "react-router";
import { postData } from "../../Services/NodeServices";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

export default function CouponAndPriceDetail(props) {
  var navigate = useNavigate()
  var user = useSelector(state => state.user)
  var userDataKeys = Object.keys(user)

  const [userAddress, setUserAddress] = useState({})
  const fetchUserAddress = async () => {
    var result = await postData("userinterface/check_user_address", { userid: props?.userData.mobilenumber })
    if (result.status) {
      setUserAddress(result)
      console.log('UUUUUUUUUUUUUUUUUUUUUUUUU:', userAddress)
    }
  }

  useEffect(function () {
    fetchUserAddress()
  }, [])

  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)

  var values = props.value
  const totalPayableAmount = (a, b) => {
    var price = 0
    if (b.offerprice > 0)
      price = b.offerprice * b.qty
    else
      price = b.price * b.qty
    return a + price
  }
  const actualAmount = (a, b) => {
    return a + b.price * b.qty
  }

  var tpay = values.reduce(totalPayableAmount, 0)
  var aamt = values.reduce(actualAmount, 0)

  const handleClick = () => {
    if (props.page == "Cart") {
      if (userDataKeys.length == 0) {
        setOpen(true)
      }
      else {
        navigate('/address')
      }
    }
    else if (props.page == "Address") {
      fetchUserAddress()
      var keys = Object.keys(userAddress)
      alert(keys.length)
      if (keys.length != 0) {
        navigate('/paymentgateway')
      }
      else {
        Swal.fire('Pls Input a Address First...!')
      }
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', background: '#fff', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap',/* border:'2px solid #51CBCC', */margin: 20 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div style={{ display: 'flex', textAlign: 'center' }}>
                <DiscountIcon style={{ color: '#000', marginTop: 5 }} /> &nbsp;&nbsp;<span style={{ color: '#535353' }}>Have a coupon/referral code?</span>
              </div>
            </Grid>
            <Grid item xs={8}>
              <div style={{ background: '#fff' }}>
                <TextField
                  color="secondary"
                  margin="normal"
                  fullWidth
                  placeholder="Enter Code"
                  disableUnderline={false}
                  InputLabelProps="disableAnimation"
                  size="small"
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div style={{ background: '#fff', marginTop: 7, padding: 9 }}>
                <Button style={{ background: 'pink', color: 'black' }}>APPLY</Button>
              </div>
            </Grid>
            <Grid style={{ color: '#535353' }} item xs={5}>
              ‣Flat ₹100 off on orders above ₹999 -
            </Grid>
            <Grid style={{ color: '#535353', fontWeight: 700 }} item xs={7}>
              TUG100
            </Grid>
            {show ? null : <Grid style={{ color: '#535353', fontSize: 14, fontWeight: 700 }} item xs={12}>
              <div onClick={() => setShow(true)} style={{ cursor: 'pointer' }}>Show more..</div>
            </Grid>}
            {show ?
              <Grid style={{ color: '#535353' }} item xs={5}>
                ‣Flat ₹200 off on orders above ₹1999 -
              </Grid> : null}
            {show ? <Grid style={{ color: '#535353', fontWeight: 700 }} item xs={7}>
              TUG200
            </Grid> : null}

            {show ? <Grid style={{ color: '#535353' }} item xs={5}>
              ‣Flat 250 off on orders above ₹2999 -
            </Grid> : null}
            {show ? <Grid style={{ color: '#535353', fontWeight: 700 }} item xs={7}>
              TUG250
            </Grid> : null}

            {show ? <Grid style={{ color: '#535353' }} item xs={5}>
              ‣Flat ₹400 off on orders above ₹3999 -
            </Grid> : null}
            {show ? <Grid style={{ color: '#535353', fontWeight: 700 }} item xs={7}>
              TUG400
            </Grid> : null}

            {show ? <Grid style={{ color: '#535353' }} item xs={12}>
              <div onClick={() => setShow(false)} style={{ cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Show Less</div>
            </Grid> : null}
            <Grid item xs={12}>
              <div style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18, marginTop: 7 }}>
                PRICE DETAILS ({values.length} items)
              </div>
            </Grid>
            <Grid item xs={12}>
              <hr color="#ABABAB"></hr>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}>Total MRP (Inc. of Taxes)</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}> ₹{aamt}</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}>Discount:</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}> -₹{aamt - tpay}</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}>Shipping</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'sans-serif', fontSize: 16, color: '#2ecc71' }}> Free</div>
            </Grid>
            {/* <Grid item xs={6}>
              <div style={{ fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}>Cart Total</div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'sans-serif', fontSize: 16, color: '#000' }}> ₹{tpay}</div>
            </Grid> */}
            <Grid item xs={12}>
              <hr color="#ABABAB"></hr>
            </Grid>
            <Grid item xs={6}>
              <div style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18, }}>Total Amount </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18, }}>₹{tpay}</div>
            </Grid>
            <Grid item xs={12}>
              <div style={{ display: 'flex', justifyContent: 'center', background: '#2ecc71', fontFamily: 'sans-serif', fontSize: 16, padding: 7, color: '#fff', letterSpacing: 1 }}>
                You Saved ₹{aamt - tpay} on this order
              </div>
            </Grid>
            <Grid item xs={12}>
              <div onClick={handleClick} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ boxShadow: '0px 0px 4px 0px grey', display: 'flex', justifyContent: 'center', background: '#51CBCC', fontSize: 25, fontWeight: 600, width: '70%', padding: 5, borderRadius: 5, color: '#fff', cursor: 'pointer' }}>
                  CHECKOUT SECURELY
                </div>
              </div>
            </Grid>

          </Grid>
        </div>
      </div>
      <Signup open={open} />
    </div>)
}