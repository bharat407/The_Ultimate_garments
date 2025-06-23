import React, { useState, useEffect } from "react";
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
  const loginEmail = user.email;

  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loginEmail) return;

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(
          `http://localhost:8080/user/get-by/${loginEmail}`
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();

        setForm((prev) => ({
          ...prev,
          email: userData.email || loginEmail,
          userid: userData._id || "",
        }));

        await fetchAddresses(userData.email || loginEmail);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        Swal.fire("Error", "Failed to fetch user information", "error");
      }
    };

    fetchUserData();
  }, [loginEmail]);

  const fetchAddresses = async (email) => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await getData(`address/display_email/${email}`);
      console.log("Fetch addresses API response:", res);

      if (Array.isArray(res)) {
        setAddresses(res);
        if (!res.find((a) => a.addressid === selectedAddressId)) {
          setSelectedAddressId(res.length > 0 ? res[0].addressid : null);
        }
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
  };

  const [form, setForm] = useState({
    addressid: "",
    email: "",
    userid: "",
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
      email: form.email || loginEmail || "",
      userid: form.userid || "",
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
        console.log("Delete address response:", res);

        if (res && res.success) {
          Swal.fire("Deleted!", "Address deleted successfully", "success");
          fetchAddresses(form.email);
          if (selectedAddressId === addressid) {
            setSelectedAddressId(null);
          }
        } else {
          Swal.fire(
            "Error",
            res.message || "Failed to delete address",
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
      "email",
      "userid",
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
      const res = await postData(url, form);
      console.log("Save address response:", res);

      if (res && res.success) {
        Swal.fire(
          "Success",
          `Address ${editMode ? "updated" : "added"} successfully`,
          "success"
        );
        await fetchAddresses(form.email);

        const newId = res.addressid || form.addressid;
        if (newId) {
          setSelectedAddressId(newId);
        }

        resetForm();
      } else {
        Swal.fire("Error", res.message || "Failed to save address", "error");
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
        {!showForm && (
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
        )}

        {showForm && (
          <AddAddress
            form={form}
            setForm={setForm}
            onCancel={resetForm}
            onSave={saveAddress}
            editMode={editMode}
          />
        )}

        {!showForm && (
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleCheckout}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Checkout Securely"
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
