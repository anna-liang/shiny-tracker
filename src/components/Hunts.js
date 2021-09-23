import React from 'react';
import Settings from './Settings';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

export default function Hunts(props) {

    const handleStep = (e) => {
        e.preventDefault();
        console.log("setting step to", e.target.elements[0].value);
        props.setStep(parseInt(e.target.elements[0].value));
    };

    return (
        <div>
            <Button 
                variant="outlined" 
                onClick={() => {props.getPokemon("pikachu", props.hunts.length)}}
            >
                New Hunt
            </Button>
            <form id="step-form" onSubmit={handleStep}>
                <div className="step-input">
                    <TextField
                        required
                        id="outlined-required"
                        label="Step"
                        defaultValue={props.step}
                    />
                </div>
            </form>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <List>
                    {props.hunts.map(function(hunt, index) {
                        if (index > 0) {
                            return (
                                <div key={index}>
                                    <Divider/>
                                    <ListItem disablePadding key={index}>
                                        <ListItemText 
                                            disableTypography
                                            primary={hunt.target}
                                            secondary={
                                                <Settings 
                                                    getPokemon={props.getPokemon}
                                                    setActiveTarget={props.setActiveTarget}
                                                    activeCounter={props.activeCounter}
                                                    setActiveCounter={props.setActiveCounter}
                                                    activeIndex={props.activeIndex}
                                                    revertDefault={props.revertDefault}
                                                    updateHunt={props.updateHunt}
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
