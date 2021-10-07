import React from 'react';
import Settings from './Settings';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import '../styles/Hunts.css';

export default function Hunts(props) {

    const handleStep = (e) => {
        e.preventDefault();
        console.log("setting step to", e.target.elements[0].value);
        props.setStep(parseInt(e.target.elements[0].value));
    };

    return (
        <div className="hunts">
            <div className="new-hunt-step-input">
                <Button 
                    className="new-hunt-btn"
                    variant="outlined" 
                    onClick={() => {props.newHunt("pikachu", props.hunts.length)}}
                >
                    New Hunt
                </Button>
                <form id="step-form" onSubmit={handleStep}>
                    <div className="step-input">
                        <InputLabel>Step</InputLabel>
                        <TextField
                            required
                            defaultValue={props.step}
                        />
                    </div>
                </form>
                <Button
                    variant="outlined"
                    onClick={() => {props.getHunts()}}
                >
                    get hunts
                </Button>
            </div>
            <Box className="hunts-box">
                <List>
                    {props.hunts.map(function(hunt, index) {
                        if (index > 0) {
                            return (
                                <div key={index} className="hunt">
                                    <Divider className={index == 1 ? "hidden" : "divider"}/>
                                    <ListItem disablePadding key={index}>
                                        <ListItemText 
                                            disableTypography
                                            primary={
                                                <Settings 
                                                    newHunt={props.newHunt}
                                                    setActiveTarget={props.setActiveTarget}
                                                    activeCounter={props.activeCounter}
                                                    setActiveCounter={props.setActiveCounter}
                                                    activeIndex={props.activeIndex}
                                                    revertDefault={props.revertDefault}
                                                    updateTarget={props.updateTarget}
                                                    setHunts={props.setHunts}
                                                    index={index}
                                                    hunts={props.hunts}
                                                    hunt={hunt}
                                                    activePokemon={props.activePokemon}
                                                />
                                            }
                                        />
                                    </ListItem>
                                </div>
                            );
                        }
                    })}
                </List> 
            </Box>
        </div>
    )
}
