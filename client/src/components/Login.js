import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import '../styles/Login.css';
import '../styles/Main.css';

export default function Login(props) {

    const [signedIn, setSignedIn] = useState(props.getUsername() !== "");
    const [signInOpen, setSignInOpen] = useState(false);
    const [signUpOpen, setSignUpOpen] = useState(false);

    const handleSignInOpen = () => {
        setSignInOpen(true);
    };

    const handleSignInClose = () => {
        setSignInOpen(false);
    };

    const handleSignUpOpen = () => {
        setSignUpOpen(true);
    };

    const handleSignUpClose = () => {
        setSignUpOpen(false);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        let username = e.target.elements[0].value.toLowerCase();
        let password = e.target.elements[1].value.toLowerCase();
        try {
        //   const url = "http://localhost:3001/signin/";
          await axios.post(props.apiUrl + "signin/", { 
            "username": username, 
            "password": password, 
          }, {
            withCredentials: true,
          });
          props.getHunts();
          props.getActiveHunt();
          if (props.getUsername() !== "") {
            setSignedIn(true);
            setSignInOpen(false);
            props.clearError();
          }
        } catch (err) {
            props.renderError(err);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        let username = e.target.elements[0].value.toLowerCase();
        let password = e.target.elements[1].value.toLowerCase();
        try {
        //   const url = "http://localhost:3001/signup/";
          await axios.post(props.apiUrl + "signup/", { 
            "username": username, 
            "password": password, 
          }, {
            withCredentials: true,
          });
          props.getHunts();
          props.getActiveHunt();
          if (props.getUsername() !== "") {
            setSignedIn(true);
            setSignUpOpen(false);
            props.clearError();
          }
        } catch (err) {
            props.renderError(err);
        }
    };

    const handleSignOut = async () => {
        try {
        //   const url = "http://localhost:3001/signout/";
          const res = await axios.get(props.apiUrl + "signout/", {
              withCredentials: true
          });
          if (res.status === 200) {
              setSignedIn(false);
              window.location.href = '/';
          }
        } catch (err) {
            props.renderError(err);
        }
    };

    return (
        <div>
            <div className={signedIn ? "hidden" : "sign-in-btn"}>
                <Button 
                    variant="outlined"
                    onClick={handleSignInOpen}
                >
                    Sign In
                </Button>
            </div>
            <Dialog open={signInOpen} onClose={handleSignInClose}>
                <div className="error-container">
                    <Alert severity="error" className="error-box"></Alert>
                </div>
                <DialogTitle>Sign in</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSignIn}>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="username"
                            label="Username"
                            type="text"
                            fullWidth
                            variant="standard"
                            required
                        />
                        <TextField
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            required
                        />
                    <DialogActions>
                        <Button onClick={handleSignInClose}>Cancel</Button>
                        <Button type="submit">Sign In</Button>
                    </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <div className={signedIn ? "hidden" : "sign-up-btn"}>
                <Button 
                    variant="outlined"
                    onClick={handleSignUpOpen}
                >
                    Sign Up
                </Button>
            </div>
            <Dialog open={signUpOpen} onClose={handleSignUpClose}>
                <div className="error-container">
                    <Alert severity="error" className="error-box"></Alert>
                </div>
                <DialogTitle>Sign up</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSignUp}>
                        <TextField
                            autoFocus
                            margin="normal"
                            id="username"
                            label="Username"
                            type="text"
                            fullWidth
                            variant="standard"
                            required
                        />
                        <TextField
                            margin="normal"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="standard"
                            required
                        />
                    <DialogActions>
                        <Button onClick={handleSignUpClose}>Cancel</Button>
                        <Button type="submit">Sign Up</Button>
                    </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <div className={signedIn ? "sign-out-btn" : "hidden"}>
                <Button 
                    className="hidden"
                    variant="outlined"
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
};