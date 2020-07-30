import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Auth } from "aws-amplify";

const CustomSignin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const user = await Auth.signIn(username, password);
      if (user) {
        setUsername("");
        setPassword("");
        window.location.reload(false);
      }
    } catch (error) {
      console.log("error signing in", error);
      setErrorMessage(error.message);
      handleDialogOpen();
    }
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const classes = useStyles();

  return (
    <Paper elevation={5} className={classes.container}>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle className={classes.dialogTitle}>Opps...</DialogTitle>
        <p className={classes.errorMessage}>{errorMessage}</p>
        <DialogActions>
          <button
            className={classes.dialogBtn}
            onClick={() => handleDialogClose()}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
      <h3>Sign in to your account</h3>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        onSubmit={(e) => signIn(e)}
      >
        <TextField
          variant="outlined"
          label="username"
          value={username}
          className={classes.input}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="password"
          type="password"
          value={password}
          className={classes.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={classes.signInBtn}>
          Sign In
        </button>
      </form>
    </Paper>
  );
};

export default CustomSignin;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "1rem 2rem 3rem 2rem",
    width: "30rem",
  },
  input: {
    marginBottom: "2rem",
  },
  signInBtn: {
    width: "30%",
    height: "3rem",
    marginLeft: "auto",
    backgroundColor: "steelblue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    "&:hover": {
      opacity: "0.75",
    },
  },
  dialogTitle: {
    paddingLeft: "3rem",
  },
  errorMessage: {
    margin: "0 3rem 1rem 3rem",
  },
  dialogBtn: {
    backgroundColor: "steelblue",
    color: "white",
    height: "2.1rem",
    width: "4rem",
    border: "none",
    borderRadius: "5px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    margin: "0 2rem 1rem 0",
    "&:hover": {
      opacity: "0.75",
    },
  },
}));
