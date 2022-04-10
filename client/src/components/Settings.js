import React from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/Settings.css';
import '../styles/Main.css';

export default function Settings(props) {

    const updateTarget = async (target, index) => {
        let hunt = props.hunts[index];
        let targetImg = await props.getPokemon(target);
        if (targetImg !== undefined) {
          try {
            await axios.patch(props.apiUrl + "api/hunt/" + hunt._id + "/", { 
              "target": target, 
              "targetImg": targetImg,
              "count": hunt.count,
              "gen": hunt.gen,
              "method": hunt.method,
              "phase": hunt.phase,
              "charm": hunt.charm,
              "active": hunt.active,
            }, {
              withCredentials: true,
            });
            let newHunts = [...props.hunts];
            newHunts[index].target = target;
            newHunts[index].targetImg = targetImg;
            props.updateHunts(newHunts);
            props.clearError();
          } catch (err) {
            props.renderError(err);
          }
        }
      };

    const handleTargetSubmit = (e) => {
        e.preventDefault();
        let target = e.target.elements[0].value.toLowerCase();
        updateTarget(target, props.index);
        if (props.hunt.active) {
            props.activePokemon(props.hunt);
        }
    };

    const handleGenChange = async (e) => {
        e.preventDefault();
        let gen = e.target.value;
        try {
            await axios.patch(props.apiUrl + "api/hunt/" + props.hunt._id + "/", { 
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": gen,
                "method": props.hunt.method,
                "phase": props.hunt.phase,
                "charm": props.hunt.charm,
                "active": props.hunt.active,
            }, {
                withCredentials: true,
            });
            props.clearError();
        } catch (err) {
            props.renderError(err);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].gen = gen;
        props.updateHunts(newHunts);
    };

    const handleMethodChange = async (e) => {
        e.preventDefault();
        let method = e.target.value;
        try {
            await axios.patch(props.apiUrl + "api/hunt/" + props.hunt._id + "/", { 
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": method,
                "phase": props.hunt.phase,
                "charm": props.hunt.charm,
                "active": props.hunt.active,
            }, {
                withCredentials: true,
            });
            props.clearError();
        } catch (err) {
            props.renderError(err);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].method = method;
        props.updateHunts(newHunts);
    };

    const handlePhaseSubmit = async (e) => {
        e.preventDefault();
        let phase = e.target.elements[0].value;
        try {
            await axios.patch(props.apiUrl + "api/hunt/" + props.hunt._id + "/", { 
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": props.hunt.method,
                "phase": phase,
                "charm": props.hunt.charm,
                "active": props.hunt.active,
            }, {
                withCredentials: true,
            });
            props.clearError();
        } catch (err) {
            props.renderError(err);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].phase = phase;
        props.updateHunts(newHunts);
    };

    const handleCharmChange = async () => {
        let charm = !props.hunt.charm;
        try {
            await axios.patch(props.apiUrl + "api/hunt/" + props.hunt._id + "/", { 
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": props.hunt.method,
                "phase": props.hunt.phase,
                "charm": charm,
                "active": props.hunt.active,
            }, {
                withCredentials: true,
            });
            props.clearError();
        } catch (err) {
            props.renderError(err);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].charm = charm;
        props.updateHunts(newHunts);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(props.apiUrl + "api/hunt/" + props.hunt._id + "/", {
                withCredentials: true,
            });
            props.clearError();
        } catch (err) {
            props.renderError(err);
        }
        document.getElementById("target-form").reset();
        let newHunts = [...props.hunts];
        newHunts.splice(props.index, 1);
        props.updateHunts(newHunts);
        if (props.hunt.active)
            props.revertDefault();
    };

    const handleActivate = async (e) => {
        let oldActiveState = props.hunt.active;
        try {
            await axios.patch(props.apiUrl + "api/hunt/" + props.hunt._id + "/", { 
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": props.hunt.method,
                "phase": props.hunt.phase,
                "charm": props.hunt.charm,
                "active": !oldActiveState,
            }, {
                withCredentials: true,
            });
            props.clearError();
        } catch (err) {
            props.renderError(err);
        }
        // if inactive to active
        if (!oldActiveState)
            props.activePokemon(props.hunt);
        else
            props.revertDefault();
        let newHunts = [...props.hunts];
        newHunts.map(async (hunt) => {
            if (hunt.active) {
                hunt.active = false;
                try {
                    await axios.patch(props.apiUrl + "api/hunt/" + hunt._id + "/", { 
                        "target": hunt.target, 
                        "targetImg": hunt.targetImg,
                        "count": hunt.count,
                        "gen": hunt.gen,
                        "method": hunt.method,
                        "phase": hunt.phase,
                        "charm": hunt.charm,
                        "active": false,
                    }, {
                        withCredentials: true,
                    });
                    props.clearError();
                } catch (err) {
                    props.renderError(err);
                }
            }
        });
        newHunts[props.index].active = !oldActiveState;
        props.updateHunts(newHunts);
    };

    return (
        <div className="settings">
            <img className="target-sprite" src={props.hunt.targetImg} alt="Pokemon Sprite"/>
            <div className="count">
                <p>{props.hunt.count}</p>
            </div>
            <div className="col1">
                <form id="target-form" onSubmit={handleTargetSubmit}>
                    <InputLabel>Pok&eacute;mon</InputLabel>
                    <TextField
                        required
                        className="settings-input"
                        defaultValue={props.hunt.target}
                    />
                </form>
                <div className="gen-input">
                    <InputLabel>Gen</InputLabel>
                    <Select
                        onChange={handleGenChange}
                        className="settings-input"
                        value={props.hunt.gen ? props.hunt.gen : ""}
                        label="Gen"
                    >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                    </Select>
                </div>
            </div>
            <div className="col2">
                <div className="method-input">
                    <InputLabel>Method</InputLabel>
                    <Select
                        onChange={handleMethodChange}
                        className="settings-input"
                        value={props.hunt.method ? props.hunt.method : ""}
                        label="Method"
                    >
                        <MenuItem value={"full-odds"}>Full Odds</MenuItem>
                        <MenuItem value={"random"}>Random Encounter</MenuItem>
                        <MenuItem value={"sr"}>Soft Reset</MenuItem>
                        <MenuItem value={"masuda"}>Masuda Method</MenuItem>
                        <MenuItem value={"dexnav"}>Dex Nav</MenuItem>
                        <MenuItem value={"friend-safari"}>Friend Safari</MenuItem>
                        <MenuItem value={"radar"}>Radar Chaining</MenuItem>
                        <MenuItem value={"fishing"}>Chain Fishing</MenuItem>
                        <MenuItem value={"sos"}>S.O.S</MenuItem>
                    </Select>
                </div>
                <form id="phase-form" onSubmit={handlePhaseSubmit}>
                    <div className="phase-input">
                        <InputLabel>Phase</InputLabel>
                        <TextField
                            required
                            className="settings-input"
                            defaultValue={props.hunt.phase}
                        />
                    </div>
                </form>
            </div>
            <div className="col3">
                <div className="shiny-charm">
                    <FormControlLabel
                        className="settings-input"
                        value="Shiny Charm"
                        control={<Checkbox onClick={handleCharmChange} checked={props.hunt.charm}/>}
                        label="Shiny Charm?"
                        labelPlacement="start"
                    />
                </div>
                <div className="settings-btn-group">
                    <div className="settings-btn">
                        <Button 
                            className="settings-btn"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                    <div className="settings-btn">
                        <Button 
                            className="settings-btn"
                            variant={props.hunt.active ? "contained" : "outlined"}
                            color="success" 
                            onClick={handleActivate}
                        >
                            Active
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
