import React, { useEffect } from "react";
import { Grid, TextField, Button, DialogActions } from "@mui/material";

export default function AddAddress({ form, setForm, onCancel, onSave, editMode }) {
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Populate email and userid from localStorage (if not already set)
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && (!form.email || !form.userid)) {
      setForm((prev) => ({
        ...prev,
        email: user.email,
        userid: user.userid,
      }));
    }
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label="Street"
            name="street"
            fullWidth
            value={form.street}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Town"
            name="town"
            fullWidth
            value={form.town}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="City"
            name="city"
            fullWidth
            value={form.city}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="State"
            name="state"
            fullWidth
            value={form.state}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Pin Code"
            name="pinCode"
            fullWidth
            value={form.pinCode}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Country"
            name="country"
            fullWidth
            value={form.country}
            onChange={handleInputChange}
            required
          />
        </Grid>
      </Grid>

      {/* Hidden fields */}
      <input type="hidden" name="email" value={form.email} />
      <input type="hidden" name="userid" value={form.userid} />

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </>
  );
}
