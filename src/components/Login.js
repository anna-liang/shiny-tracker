import React from 'react';
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
    const [signedIn, setSignedIn] = React.useState(false);
    const [signInOpen, setSignInOpen] = React.useState(false);
    const [signUpOpen, setSignUpOpen] = React.useState(false);

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
          const url = "http://localhost:3001/signin/";
          const res = await axios.post(url, { 
            "username": username, 
            "password": password, 
          }, {
            withCredentials: true,
          });
          console.log(res.status);
          props.getHunts();
          props.getActiveHunt();
          if (res.status === 200) {
            setSignedIn(true);
            setSignInOpen(false);
            props.clearError();
          }
        } catch (e) {
            props.renderError(e);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        let username = e.target.elements[0].value.toLowerCase();
        let password = e.target.elements[1].value.toLowerCase();
        try {
          const url = "http://localhost:3001/signup/";
          const res = await axios.post(url, { 
            "username": username, 
            "password": password, 
          }, {
            withCredentials: true,
          });
          console.log(res.status);
          if (res.status === 200) {
            setSignedIn(true);
            setSignUpOpen(false);
            props.clearError();
          }
        } catch (e) {
            props.renderError(e);
        }
    };

    const handleSignOut = async (e) => {
        try {
          const url = "http://localhost:3001/signout/";
          const res = await axios.get(url, {
              withCredentials: true
          });
          if (res.status === 200) setSignedIn(false);
        } catch (e) {
            props.renderError(e);
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