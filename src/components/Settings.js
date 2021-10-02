import React from 'react'
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/Settings.css';

export default function Settings(props) {

    const handleTargetSubmit = (e) => {
        e.preventDefault();
        let target = e.target.elements[0].value.toLowerCase();
        props.updateTarget(target, props.index);
        console.log("calling getPokemon:", target, props.index);
        if (props.hunt.active) {
            props.setActiveTarget(target);
            props.activePokemon(props.hunt, props.index);
        }
    };

    const handleGenChange = async (e) => {
        e.preventDefault();
        console.log(e.target.value);
        let gen = e.target.value;
        try {
            const url = "http://localhost:3001/api/hunt";
            await axios.patch(url, { 
                "id": props.hunt.id,
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": gen,
                "method": props.hunt.method,
                "phase": props.hunt.phase,
                "charm": props.hunt.charm,
                "active": props.hunt.active,
            });
        } catch (e) {
            console.log(e);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].gen = gen;
        props.setHunts(newHunts);
    };

    const handleMethodChange = async (e) => {
        e.preventDefault();
        console.log(e.target.value);
        let method = e.target.value;
        try {
            const url = "http://localhost:3001/api/hunt";
            await axios.patch(url, { 
                "id": props.hunt.id,
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": method,
                "phase": props.hunt.phase,
                "charm": props.hunt.charm,
                "active": props.hunt.active,
            });
        } catch (e) {
            console.log(e);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].method = method;
        props.setHunts(newHunts);
    };

    const handlePhaseSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target.elements[0].value);
        let phase = e.target.elements[0].value;
        try {
            const url = "http://localhost:3001/api/hunt";
            await axios.patch(url, { 
                "id": props.hunt.id,
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": props.hunt.method,
                "phase": phase,
                "charm": props.hunt.charm,
                "active": props.hunt.active,
            });
        } catch (e) {
            console.log(e);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].phase = phase;
        props.setHunts(newHunts);
    };

    const handleCharmChange = async (e) => {
        console.log("click");
        let charm = !props.hunt.charm;
        try {
            const url = "http://localhost:3001/api/hunt";
            const res = await axios.patch(url, { 
                "id": props.hunt.id,
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": props.hunt.method,
                "phase": props.hunt.phase,
                "charm": charm,
                "active": props.hunt.active,
            });
        } catch (e) {
            console.log(e);
        }
        let newHunts = [...props.hunts];
        newHunts[props.index].charm = charm;
        props.setHunts(newHunts);
    };

    const handleDelete = async (e) => {
        try {
            const url = "http://localhost:3001/api/hunt";
            await axios.delete(url, {
              params: { 
                id: props.hunt.id
              }
            });
        } catch (e) {
            console.log(e);
        }
        document.getElementById("target-form").reset();
        let newHunts = [...props.hunts];
        newHunts.splice(props.index, 1);
        props.setHunts(newHunts);
        if (props.hunt.active)
            props.revertDefault();
    };

    const handleActivate = async (e) => {
        let oldActiveState = props.hunt.active;
        try {
            const url = "http://localhost:3001/api/hunt";
            const res = await axios.patch(url, { 
                "id": props.hunt.id,
                "target": props.hunt.target, 
                "targetImg": props.hunt.targetImg,
                "count": props.hunt.count,
                "gen": props.hunt.gen,
                "method": props.hunt.method,
                "phase": props.hunt.phase,
                "charm": props.hunt.charm,
                "active": !oldActiveState,
            });
        } catch (e) {
            console.log(e);
        }
        // if inactive to active
        if (!oldActiveState)
            props.activePokemon(props.hunt, props.index);
        else
            props.revertDefault();
        let newHunts = [...props.hunts];
        newHunts.map(async (hunt) => {
            if (hunt.active) {
                hunt.active = false;
                try {
                    const url = "http://localhost:3001/api/hunt";
                    await axios.patch(url, { 
                        "id": hunt.id,
                        "target": hunt.target, 
                        "targetImg": hunt.targetImg,
                        "count": hunt.count,
                        "gen": hunt.gen,
                        "method": hunt.method,
                        "phase": hunt.phase,
                        "charm": hunt.charm,
                        "active": false,
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        });
        newHunts[props.index].active = !oldActiveState;
        console.log(newHunts[props.index].target, "old state", oldActiveState, "new state", newHunts[props.index].active);
        props.setHunts(newHunts);
    };

    const getAllPokemon = async () => {
        const url = `https://pokeapi.co/api/v2/pokemon-species?limit=1`;
        const res = await axios.get(url);
        console.log("getting all pokemon");
        console.log(res.data.results);
        // console.log(typeof([]));
        // let result = [res.data.results[0]]
        return Object.entries(res.data.results);
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
                    {/* <Autocomplete
                        disablePortal
                        required
                        autoComplete
                        className="settings-input"
                        // sx={{ width: 200 }}
                        defaultValue={props.hunt.target}
                        // options={getAllPokemon().then((res) => {
                        //     console.log("results", Object.entries(res)[0]);
                        //     return Object.entries(res)[0];
                        // })}
                        options={['test']}
                        renderInput={(params) => <TextField {...params}/>}
                    /> */}
                </form>
                <div className="gen-input">
                    <InputLabel>Gen</InputLabel>
                    <Select
                        onChange={handleGenChange}
                        className="settings-input"
                        // value={props.hunt.gen}
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
                        // value={props.hunt.method ? props.hunt.method : ""}
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
                        control={<Checkbox onClick={handleCharmChange}/>}
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
