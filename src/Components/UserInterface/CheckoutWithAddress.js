import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { Edit, Delete, AddLocation } from "@mui/icons-material";
import Swal from "sweetalert2";
import AddAddress from "./AddAddress";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getData, postData } from "../Services/NodeServices";

export default function CheckoutWithAddress({ open, onClose, totalAmount }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const userEmail = Object.keys(user)[0] || "";
  const userData = user[userEmail] || {};
  const userId = userData._id;

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchAddresses = useCallback(async (email) => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await getData(`address/display_email/${email}`);
      if (Array.isArray(res)) {
        setAddresses(res);
        setSelectedAddressId((prev) =>
          res.length > 0 && !res.some((a) => a.addressid === prev)
            ? res[0].addressid
            : prev
        );
      } else {
        setAddresses([]);
        setSelectedAddressId(null);
      }
    } catch (error) {
      console.error("Fetch addresses error:", error);
      Swal.fire("Error", "Failed to fetch addresses", "error");
      setAddresses([]);
      setSelectedAddressId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      fetchAddresses(userEmail);
    }
  }, [userEmail, fetchAddresses]);

  const [form, setForm] = useState({
    addressid: "",
    email: userEmail || "",
    userid: userId || "",
    street: "",
    town: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  const resetForm = () => {
    setForm({
      addressid: "",
      email: userEmail || "",
      userid: userId || "",
      street: "",
      town: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
    });
    setEditMode(false);
    setShowForm(false);
  };

  const selectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const startEdit = (address) => {
    setForm({ ...address });
    setEditMode(true);
    setShowForm(true);
  };

  const deleteAddress = async (addressid) => {
    const confirm = await Swal.fire({
      title: "Delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await postData("address/delete_address", { addressid });
        if (res?.success) {
          Swal.fire("Deleted!", "Address deleted successfully", "success");
          fetchAddresses(userEmail);
          if (selectedAddressId === addressid) {
            setSelectedAddressId(
              addresses.length > 1
                ? addresses.find((a) => a.addressid !== addressid)?.addressid
                : null
            );
          }
        } else {
          Swal.fire(
            "Error",
            res?.message || "Failed to delete address",
            "error"
          );
        }
      } catch (error) {
        console.error("Delete address error:", error);
        Swal.fire("Error", "Failed to delete address", "error");
      }
    }
  };

  const saveAddress = async () => {
    const url = editMode ? "address/update_address" : "address/add_address";
    const requiredFields = [
      "street",
      "town",
      "city",
      "state",
      "pinCode",
      "country",
    ];

    for (const field of requiredFields) {
      if (!form[field]) {
        Swal.fire("Error", `${field} is required`, "error");
        return;
      }
    }

    try {
      const payload = {
        ...form,
        email: userEmail,
        userid: userId,
      };

      const res = await postData(url, payload);
      if (res?.success) {
        Swal.fire(
          "Success",
          `Address ${editMode ? "updated" : "added"} successfully`,
          "success"
        );
        await fetchAddresses(userEmail);
        resetForm();
      } else {
        Swal.fire("Error", res?.message || "Failed to save address", "error");
      }
    } catch (error) {
      console.error("Save address error:", error);
      Swal.fire("Error", "Failed to save address", "error");
    }
  };

  const handleCheckout = () => {
    if (!selectedAddressId) {
      Swal.fire(
        "Select Address",
        "Please select an address to continue",
        "warning"
      );
      return;
    }
    const selectedAddress = addresses.find(
      (a) => a.addressid === selectedAddressId
    );
    navigate("/paymentgateway", { state: { selectedAddress, totalAmount } });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode ? "Update Address" : "Select or Add Address"}
        {!editMode && (
          <Button
            startIcon={<AddLocation />}
            color="primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            style={{ float: "right" }}
          >
            Add New
          </Button>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {!showForm ? (
          <>
            <List>
              {addresses.length === 0 && (
                <Typography>No addresses found. Please add one.</Typography>
              )}
              {addresses.map((addr) => (
                <ListItem
                  key={addr.addressid}
                  selected={addr.addressid === selectedAddressId}
                  onClick={() => selectAddress(addr.addressid)}
                  button
                >
                  <ListItemText
                    primary={`${addr.street}, ${addr.town}, ${addr.city}, ${addr.state}, ${addr.pinCode}, ${addr.country}`}
                    secondary={addr.email}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(addr);
                    }}
                    size="small"
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(addr.addressid);
                    }}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
            </List>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleCheckout}
              disabled={loading || !selectedAddressId}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Checkout Securely"
              )}
            </Button>
          </>
        ) : (
          <AddAddress
            form={form}
            setForm={setForm}
            onCancel={resetForm}
            onSave={saveAddress}
            editMode={editMode}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
