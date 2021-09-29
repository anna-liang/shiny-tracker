import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import '../styles/Login.css';

export default function Login() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSignIn = async (e) => {
        // e.preventDefault();
        let username = e.target.elements[0].value.toLowerCase();
        let password = e.target.elements[1].value.toLowerCase();
        try {
          const url = "http://localhost:3001/signin/";
          const res = await axios.post(url, { 
            "username": username, 
            "password": password, 
          });
          console.log(res);
        } catch (e) {
          console.log(e);
        }
    };

    const handleSignUp = async (e) => {
        // e.preventDefault();
        let username = e.target.elements[0].value.toLowerCase();
        let password = e.target.elements[1].value.toLowerCase();
        try {
          const url = "http://localhost:3001/signup/";
          const res = await axios.post(url, { 
            "username": username, 
            "password": password, 
          });
          console.log(res);
        } catch (e) {
          console.log(e);
        }
    };

    return (
        <div>
            <div className="sign-in-btn">
                <Button 
                    variant="outlined"
                    onClick={handleClickOpen}
                >
                    Sign In
                </Button>
            </div>
            <Dialog open={open} onClose={handleClose}>
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
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Sign In</Button>
                    </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};