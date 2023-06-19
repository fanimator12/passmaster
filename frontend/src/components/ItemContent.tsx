import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState } from "react";
import {
  updatePassword,
  deletePassword,
  getAllPasswords,
  getPassword,
  savePassword,
} from "../api/api_root";
import {
  Modal,
  Box,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

interface FormData {
  website?: string;
  email?: string;
  username?: string;
  password?: string;
}

interface Password {
  id: string;
  website: string;
  email: string;
  username: string;
  password: string;
}

export default function ItemContent() {
  const [open, setOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [revealedPasswords, setRevealedPasswords] = useState<Password[]>([]);
  const [editPasswordData, setEditPasswordData] = useState<Password | null>();
  const [editMode, setEditMode] = useState(false);
  const { token } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleOpen = (isEditMode = false, password: Password | null = null) => {
    setEditMode(isEditMode);
    setEditPasswordData(password);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const handleAddPassword = () => {
    setEditMode(false);
    setEditPasswordData(null);
    setOpen(true);
  };

  const handleRevealPassword = async (
    passmaster_id: string,
    token: string | null
  ) => {
    try {
      if (!token) {
        throw new Error("Token is null");
      }
      const passwordData = await getPassword(passmaster_id, token);

      setRevealedPasswords((prevPasswords) => [
        ...prevPasswords,
        {
          ...passwordData,
          id: passmaster_id,
          password: passwordData.encrypted_password,
        },
      ]);

      setTimeout(() => {
        setRevealedPasswords((prevPasswords) =>
          prevPasswords.filter((p) => p.id !== passmaster_id)
        );
      }, 400);
    } catch (error) {
      console.error("Error while retrieving password", error);
    }
  };

  const handleUpdatePassword = (passmaster_id: string) => {
    const passwordToUpdate = passwords.find(
      (password) => password.id === passmaster_id
    );
    if (passwordToUpdate) {
      handleOpen(true, passwordToUpdate);
      setEditPasswordData(passwordToUpdate);
      setEditMode(true);
      reset(passwordToUpdate);
      setOpen(true);
    } else {
      console.error(`Password with ID ${passmaster_id} not found.`);
    }
  };

  const handleDeletePassword = async (
    passmaster_id: string,
    token: string | null
  ) => {
    try {
      if (!token) {
        throw new Error("Token is null");
      }
      await deletePassword(passmaster_id, token);
      console.log("Password record deleted successfully!");
    } catch (error) {
      console.error("Error while deleting password", error);
    }
  };

  const handleRefreshPasswords = async () => {
    try {
      if (token) {
        const passwords = await getAllPasswords(token);
        setPasswords(passwords);
        console.log("Passwords refreshed successfully!");
      }
    } catch (error) {
      console.error("Error while refreshing passwords", error);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log("OnSubmit triggered with data: ", data);
    setOpen(false);

    if (token) {
      console.log(data);
      console.log(token);

      try {
        if (editMode && editPasswordData) {
          const updatedPasswordData: {
            website?: string;
            email?: string;
            username?: string;
            password?: string;
          } = {};

          if (data.website) updatedPasswordData.website = data.website;
          if (data.email) updatedPasswordData.email = data.email;
          if (data.username) updatedPasswordData.username = data.username;
          if (data.password) updatedPasswordData.password = data.password;
          await updatePassword(editPasswordData.id, updatedPasswordData, token);

          console.log("Password updated successfully!");
        } else {
          const savePasswordData: {
            website: string;
            email: string;
            username: string;
            password: string;
          } = {
            website: data.website || "",
            email: data.email || "",
            username: data.username || "",
            password: data.password || "",
          };

          await savePassword(savePasswordData, token);

          console.log("Password submitted successfully!");
        }

        setShowNotification(true);
        setEditPasswordData(null);
      } catch (error) {
        console.error("Error while saving/updating password", error);
      }
    }
  };

  useEffect(() => {
    const fetchPasswords = async () => {
      if (token) {
        try {
          const passwords = await getAllPasswords(token);
          setPasswords(passwords);
        } catch (error) {
          console.error("Error while fetching passwords", error);
        }
      }
    };

    fetchPasswords();
  }, [token]);

  return (
    <>
      <Paper
        sx={{
          maxWidth: 936,
          margin: "auto",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, hsla(217, 100%, 37%, 1) 0%, hsla(157, 100%, 50%, 1) 100%)",
        }}
      >
        <AppBar
          position="static"
          color="default"
          elevation={0}
          sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SearchIcon color="inherit" sx={{ display: "block" }} />
              </Grid>
              <Grid item xs>
                <TextField
                  fullWidth
                  placeholder="Search"
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontSize: "default" },
                  }}
                  variant="standard"
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={handleAddPassword}
                  sx={{
                    mr: 1,
                    background:
                      "linear-gradient(135deg, hsla(217, 100%, 37%, 1) 0%, hsla(157, 100%, 50%, 1) 100%)",
                  }}
                >
                  + Add Password
                </Button>
                <Tooltip title="Reload">
                  <IconButton onClick={handleRefreshPasswords}>
                    <RefreshIcon color="inherit" sx={{ display: "block" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {passwords && passwords.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ margin: "auto", background: "transparent" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Website
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Username
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Password
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Update
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                    Delete
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {passwords.map((password) => (
                  <TableRow key={password.id}>
                    <TableCell sx={{ color: "#fff" }}>
                      {password.website}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {password.email}
                    </TableCell>
                    <TableCell sx={{ color: "#fff" }}>
                      {password.username}
                    </TableCell>
                    <TableCell>
                      {revealedPasswords.find((p) => p.id === password.id) ? (
                        <Typography sx={{ color: "#fff" }}>
                          {revealedPasswords
                            .find((p) => p.id === password.id)
                            ?.password?.toString()}
                        </Typography>
                      ) : (
                        <Button
                          variant="contained"
                          className="button"
                          onClick={() =>
                            handleRevealPassword(password.id, token)
                          }
                        >
                          Reveal
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={{ color: "#fff" }}
                        onClick={() => handleUpdatePassword(password.id)}
                      >
                        <UpdateIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={{ color: "rgb(0, 72, 189)" }}
                        onClick={() => handleDeletePassword(password.id, token)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ my: 5, mx: 2 }} color="#fff" align="center">
            No passwords saved for this vault yet
          </Typography>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="div"
            sx={{
              width: 400,
              bgcolor: "background.paper",
              p: 5,
              mx: "auto",
              my: "auto",
              borderRadius: "5px",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {editPasswordData ? "Update Password" : "Add Password"}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Website"
                {...register("website")}
                defaultValue={editPasswordData?.website || ""}
                sx={{ mt: 2 }}
              />
              {errors.website?.message && <span>{errors.website.message}</span>}
              <TextField
                fullWidth
                label="Email"
                {...register("email")}
                defaultValue={editPasswordData?.email || ""}
                sx={{ mt: 2 }}
              />
              {errors.email?.message && <span>{errors.email.message}</span>}
              <TextField
                fullWidth
                label="Username"
                {...register("username")}
                defaultValue={editPasswordData?.username || ""}
                sx={{ mt: 2 }}
              />
              {errors.username?.message && (
                <span>{errors.username.message}</span>
              )}
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register("password")}
                defaultValue={editPasswordData?.password || ""}
                sx={{ mt: 2 }}
              />
              {errors.password?.message && (
                <span>{errors.password.message}</span>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Modal>
        <Snackbar
          open={showNotification}
          autoHideDuration={3000}
          onClose={handleNotificationClose}
          message="Password record submitted successfully!"
        />
      </Paper>
    </>
  );
}
