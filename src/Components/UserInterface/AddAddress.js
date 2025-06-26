import React, { useEffect } from "react";
import { Grid, TextField, Button, DialogActions } from "@mui/material";

export default function AddAddress({
  form,
  setForm,
  onCancel,
  onSave,
  editMode,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    // Load email and userid from localStorage if not already set
    if (!form.email || !form.userid) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setForm((prev) => ({
          ...prev,
          email: user.email || prev.email,
          userid: user.userid || prev.userid,
        }));
      }
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

      {/* Hidden fields to preserve user identity */}
      <input type="hidden" name="email" value={form.email} />
      <input type="hidden" name="userid" value={form.userid} />

      <DialogActions sx={{ mt: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave} variant="contained" color="primary">
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </>
  );
}
