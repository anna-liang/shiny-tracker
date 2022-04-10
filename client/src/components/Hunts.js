import React from 'react';
import axios from 'axios';
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
        props.updateStep(parseInt(e.target.elements[0].value));
    };

    const newHunt = async (target, index) => {
        let targetImg = await props.getPokemon(target);
        try {
          const res = await axios.post(props.apiUrl + "api/hunt", { 
            "target": target, 
            "targetImg": targetImg,
            "count": 0,
            "gen": 2,
            "method": "full-odds",
            "phase": 0,
            "charm": false,
            "active": false,
          }, {
            withCredentials: true,
          });
          let newHunts = [...props.hunts];
          if (index === props.hunts.length)
            newHunts.push(res.data);
          else
            newHunts[index] = res.data;
          props.getHunts();
          props.updateHunts(newHunts);
          props.clearError();
        } catch (err) {
          props.renderError(err);
        }
    };

    return (
        <div className="hunts">
            <div className="new-hunt-step-input">
                <Button 
                    className="new-hunt-btn"
                    variant="outlined" 
                    onClick={() => {newHunt("pikachu", props.hunts.length)}}
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
            </div>
            <Box className="hunts-box">
                <List>
                    {props.hunts.map(function(hunt, index) {
                        return (
                            <div key={index} className="hunt">
                                <Divider className={index === 0 ? "hidden" : "divider"}/>
                                <ListItem disablePadding key={index}>
                                    <ListItemText 
                                        disableTypography
                                        primary={
                                            <Settings 
                                                getPokemon={props.getPokemon}
                                                revertDefault={props.revertDefault}
                                                updateHunts={props.updateHunts}
                                                index={index}
                                                hunts={props.hunts}
                                                hunt={hunt}
                                                activePokemon={props.activePokemon}
                                                renderError={props.renderError}
                                                clearError={props.clearError}
                                                apiUrl={props.apiUrl}
                                            />
                                        }
                                    />
                                </ListItem>
                            </div>
                        );
                    })}
                </List> 
            </Box>
        </div>
    )
}
