import React, { useState, useEffect } from 'react';
import { ServerURL, postData } from '../../Services/NodeServices';
import { TextField, Button, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import LoginMenu from './LoginMenu';

export default function Signup(props) {
  const matches = useMediaQuery('(max-width:1150px)');

  const [openSignUp, setOpenSignUp] = useState(props.open);
  const [openSignUpDetails, setOpenSignUpDetails] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false)
  const [myAccount, setMyAccount] = useState(false)

  var navigate = useNavigate()
  var dispatch = useDispatch()
  var cart = useSelector(state => state.cart)
  var keys = Object.keys(cart)
  var user = useSelector(state => state.user)
  var userDataKeys = Object.keys(user)


  useEffect(function () { setOpenSignUp(props.open) }, [props])

  const handleClose = () => {
    setOpenSignUp(false)
    setOpenSignUpDetails(false)
    setOpenOtpDialog(false)
  }
  const handleSignUpDetails = () => {
    alert(otp + "         " + inputOtp)
    if (otp == inputOtp) {
      if (userData.status) {
        dispatch({ type: 'ADD_USER', payload: [userData.data.mobilenumber, userData.data] })
        if (keys.length != 0) {
          navigate('/address')
        }
        else {
          setOpenOtpDialog(false)
          setMyAccount(true)
        }
      }
      else {
        setOpenSignUpDetails(true)
        setOpenOtpDialog(false)
        setOpenSignUp(false)
      }
    }
    else {
      alert("Invalid Otp.......!!")
    }
  }
  const handleOtpOpen = () => {
    if (mobileNumber != '') {
      generateOtp()
      setOpenOtpDialog(true)
      setOpenSignUp(false)
    }
    else {
      alert('Please Input Number....!')
    }
  }

  const [userData, setUserData] = useState([])
  const [otp, setOtp] = useState('')
  const [inputOtp, setInputOtp] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [emailId, setEmailId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('female')

  const fetchUserData = async () => {
    var result = await postData('userinterface/check_user_mobilenumber', { mobilenumber: mobileNumber })
    setUserData(result)
  }
  const generateOtp = () => {
    fetchUserData()
    var otp = parseInt(Math.random() * 8999) + 1000
    setOtp(otp)
    alert(`Your OTP is ${otp}`)
  }
  const handleSubmit = async () => {
    var body = { mobilenumber: mobileNumber, emailid: emailId, firstname: firstName, lastname: lastName, dob: dob, gender: gender }
    var result = await postData('userinterface/submit_userdata', body)
    dispatch({ type: 'DELETE_USER', payload: [] })
    if (result.status) {
      dispatch({ type: 'ADD_USER', payload: [body.mobilenumber, body] })
      if (keys.length != 0) {
        navigate('/address')
      }
      else {
        setOpenSignUpDetails(false)
        setMyAccount(true)
      }
    }
    else {
      alert("Pls Check the input values.........")
    }
  }

  const handleClickOpen = () => {
    setOpenSignUp(true)
  }
  const handleLogout = (value) => {
    setMyAccount(value)
  }
  const checkLogin = () => {
    if (userDataKeys.length != 0) {
      if (myAccount == true) {
      }
      else {
        setMyAccount(true)
      }
    }
  }
  useEffect(function () {
    checkLogin()
  }, [])

  const signupDialog = () => {
    return (
      <div>
        {matches ?
          <Dialog
            open={openSignUp}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle style={{ padding: '0px 0px' }}>
              <div style={{ position: 'relative' }}>
                <img src={`${ServerURL}/images/signup.jpg`} style={{ width: '100%' }} />
                <Button onClick={handleClose} style={{ position: 'absolute', top: '0.5%', right: '0.1%', color: '#ababab' }}><CloseIcon /></Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div style={{ fontSize: 18, fontWeight: '500', color: '#0087BA' }}>
                    Please enter your mobile number to login
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">Mobile Number</InputLabel>
                    <Input
                      id="standard-adornment-mobileno"
                      startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                      onChange={(event) => setMobileNumber(event.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ diplay: 'flex', justifyContent: 'center', alignItem: 'center', background: 'gray', height: 60, width: 60, borderRadius: 50, cursor: 'pointer' }}>
                    <Button variant="contained" onClick={handleOtpOpen} style={{ background: 'rgb(0, 135, 186)', color: 'white', height: 63, width: 63, borderRadius: 60, }}>   <ArrowForwardIcon fontSize='large' /></Button>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 12 }}>OTP will be sent to this number by SMS and whatsapp..</div>

                  <div style={{ fontSize: 12, marginLeft: -13 }}>
                    <Checkbox color="primary" />
                    By signing up, I agree to the Privacy,Policy, Terms and Conditions of TUG.
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
          :
          <Dialog
            open={openSignUp}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ position: 'fixed', left: '63%', top: '-15%', height: '100%', width: '35%' }}
          >
            <DialogTitle style={{ padding: '0px 0px' }}>
              <div style={{ position: 'relative' }}>
                <img src={`${ServerURL}/images/signup.jpg`} style={{ width: '100%' }} />
                <Button onClick={handleClose} style={{ position: 'absolute', top: '0.5%', right: '0.1%', color: '#ababab' }}><CloseIcon /></Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div style={{ fontSize: 18, fontWeight: '500', color: '#0087BA' }}>
                    Please enter your mobile number to login
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-amount">Mobile Number</InputLabel>
                    <Input
                      id="standard-adornment-mobileno"
                      startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                      onChange={(event) => setMobileNumber(event.target.value)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ diplay: 'flex', justifyContent: 'center', alignItem: 'center', background: 'gray', height: 60, width: 60, borderRadius: 50, cursor: 'pointer' }}>
                    <Button variant="contained" onClick={handleOtpOpen} style={{ background: 'rgb(0, 135, 186)', color: 'white', height: 63, width: 63, borderRadius: 60, }}>   <ArrowForwardIcon fontSize='large' /></Button>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 12 }}>OTP will be sent to this number by SMS and whatsapp..</div>

                  <div style={{ fontSize: 12, marginLeft: -13 }}>
                    <Checkbox color="primary" />
                    By signing up, I agree to the Privacy,Policy, Terms and Conditions of TUG.
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        }
      </div>
    )
  }

  const signUpDetails = () => {
    return (
      <div>
        {matches ?
          <Dialog
            open={openSignUpDetails}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle style={{ padding: '0px 0px' }}>
              <div style={{ position: 'relative' }}>
                <img src={`${ServerURL}/images/signup.jpg`} style={{ width: '100%' }} />
                <Button onClick={handleClose} style={{ position: 'absolute', top: '0.5%', right: '0.1%', color: '#ababab' }}><CloseIcon /></Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ fontFamily: 'cursive', fontSize: 20, color: 'rgb(0, 135, 186)', fontWeight: 600 }}>
                  Enter Your Details
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Full Name
                  </div>
                  <TextField fullWidth onChange={(event) => setFirstName(event.target.value)} placeholder='First Name' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth onChange={(event) => setLastName(event.target.value)} placeholder='Last Name' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Date Of Birth
                  </div>
                  <TextField type='date' onChange={(event) => setDob(event.target.value)} fullWidth placeholder='dd/mm/yyyy' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Gender
                  </div>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={gender}
                      onChange={(event) => setGender(event.target.value)}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Email Address (Optional)
                  </div>
                  <TextField onChange={(event) => setEmailId(event.target.value)} fullWidth placeholder='name@email.com' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <div>
                    <FormControlLabel
                      style={{ fontSize: 2 }}
                      control={<Checkbox color="success" />}
                      label="send me personalised health tips & offers on whatsapp"
                    />
                  </div>
                </Grid>
                {/* <Grid item xs={12}>
                  <div style={{ background: 'rgb(0, 135, 186)', padding: 14, color: 'white' }}>
                    <CardGiftcardIcon /> <div style={{ fontSize: 12 }}>  Do You Have A Referral Code? (Optional)</div>
                    <TextField fullWidth placeholder='Enter Referral Code' id="standard-basic" variant="standard" />
                  </div>
                </Grid> */}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div style={{ padding: 14 }}>
                    <Button onClick={handleSubmit} style={{ background: 'rgb(0, 135, 186)', color: 'white' }} fullWidth variant="contained">SUBMIT</Button>
                  </div>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
          :
          <Dialog
            open={openSignUpDetails}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ position: 'fixed', left: '63%', height: '100%', width: '35%' }}
          >
            <DialogTitle style={{ padding: '0px 0px' }}>
              <div style={{ position: 'relative' }}>
                <img src={`${ServerURL}/images/signup.jpg`} style={{ width: '100%' }} />
                <Button onClick={handleClose} style={{ position: 'absolute', top: '0.5%', right: '0.1%', color: '#ababab' }}><CloseIcon /></Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ fontFamily: 'cursive', fontSize: 20, color: 'rgb(0, 135, 186)', fontWeight: 600 }}>
                  Enter Your Details
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Full Name
                  </div>
                  <TextField fullWidth onChange={(event) => setFirstName(event.target.value)} placeholder='First Name' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth onChange={(event) => setLastName(event.target.value)} placeholder='Last Name' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Date Of Birth
                  </div>
                  <TextField type='date' onChange={(event) => setDob(event.target.value)} fullWidth placeholder='dd/mm/yyyy' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Gender
                  </div>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={gender}
                      onChange={(event) => setGender(event.target.value)}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Email Address (Optional)
                  </div>
                  <TextField onChange={(event) => setEmailId(event.target.value)} fullWidth placeholder='name@email.com' id="standard-basic" variant="standard" />
                </Grid>
                <Grid item xs={12}>
                  <div>
                    <FormControlLabel
                      style={{ fontSize: 2 }}
                      control={<Checkbox color="success" />}
                      label="send me personalised health tips & offers on whatsapp"
                    />
                  </div>
                </Grid>
                {/* <Grid item xs={12}>
                  <div style={{ background: 'rgb(0, 135, 186)', padding: 14, color: 'white' }}>
                    <CardGiftcardIcon /> <div style={{ fontSize: 12 }}>  Do You Have A Referral Code? (Optional)</div>
                    <TextField fullWidth placeholder='Enter Referral Code' id="standard-basic" variant="standard" />
                  </div>
                </Grid> */}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div style={{ padding: 14 }}>
                    <Button onClick={handleSubmit} style={{ background: 'rgb(0, 135, 186)', color: 'white' }} fullWidth variant="contained">SUBMIT</Button>
                  </div>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        }
      </div>
    )
  }

  const otpDialog = () => {
    return (
      <div>
        {matches ?
          <Dialog
            open={openOtpDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle style={{ padding: '0px 0px' }}>
              <div style={{ position: 'relative' }}>
                <img src={`${ServerURL}/images/signup.jpg`} style={{ width: '100%' }} />
                <Button onClick={handleClose} style={{ position: 'absolute', top: '0.5%', right: '0.1%', color: '#ababab' }}><CloseIcon /></Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div style={{ fontSize: 16, fontWeight: '500', color: '#0087BA' }}>
                    Now type in the OTP sent to you for authentication
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <TextField fullWidth onChange={(event) => setInputOtp(event.target.value)} id="standard-basic" variant="standard" />
                  <div style={{ fontSize: 13 }}>Resend OTP</div>
                </Grid>
                <Grid item xs={4}>
                  <div style={{ diplay: 'flex', justifyContent: 'center', alignItem: 'center', background: 'rgb(0, 135, 186)', color: 'white', height: 60, width: 60, borderRadius: 50, cursor: 'pointer', }}>
                    <Button variant="contained" onClick={handleSignUpDetails} style={{ background: 'rgb(0, 135, 186)', color: 'white', height: 63, width: 63, borderRadius: 60 }}><ArrowForwardIcon fontSize='large' /></Button>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
          :
          <Dialog
            open={openOtpDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ position: 'fixed', left: '63%', top: '-15%', height: '100%', width: '35%' }}
          >
            <DialogTitle style={{ padding: '0px 0px' }}>
              <div style={{ position: 'relative' }}>
                <img src={`${ServerURL}/images/signup.jpg`} style={{ width: '100%' }} />
                <Button onClick={handleClose} style={{ position: 'absolute', top: '0.5%', right: '0.1%', color: '#ababab' }}><CloseIcon /></Button>
              </div>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div style={{ fontSize: 16, fontWeight: '500', color: '#0087BA' }}>
                    Now type in the OTP sent to you for authentication
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <TextField fullWidth onChange={(event) => setInputOtp(event.target.value)} id="standard-basic" variant="standard" />
                  <div style={{ fontSize: 13 }}>Resend OTP</div>
                  {/* <div>
                    or
                  </div> */}
                </Grid>
                <Grid item xs={4}>
                  <div style={{ diplay: 'flex', justifyContent: 'center', alignItem: 'center', background: 'rgb(0, 135, 186)', color: 'white', height: 60, width: 60, borderRadius: 50, cursor: 'pointer', }}>
                    <Button variant="contained" onClick={handleSignUpDetails} style={{ background: 'rgb(0, 135, 186)', color: 'white', height: 63, width: 63, borderRadius: 60 }}><ArrowForwardIcon fontSize='large' /></Button>
                  </div>
                </Grid>
                {/* <Grid item xs={12}>
                  <Button variant="contained" style={{ background: 'rgb(0, 135, 186)', color: 'white' }}><CallIcon /> GET OTP ON CALL</Button>
                </Grid> */}
              </Grid>
            </DialogContent>
          </Dialog>
        }
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontFamily: 'cursive', fontSize: 12, fontWeight: 600, color: 'white', cursor: 'pointer' }}>
        {myAccount ? <div><LoginMenu mobilenumber={mobileNumber} onClick={(value) => handleLogout(value)} /></div> : <>{matches ? <div style={{ fontFamily: 'cursive', fontSize: 10, fontWeight: 600, color: 'white', cursor: 'pointer' }} onClick={handleClickOpen} >LOGIN <br />| SINUP</div> : <div onClick={handleClickOpen}>LOGIN | SINUP</div>}</>}
      </div>

      {signupDialog()}
      {signUpDetails()}
      {otpDialog()}
    </div>
  );
}
