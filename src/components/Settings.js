import React from 'react'
import '../styles/Settings.css';

export default function Settings(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        props.updateHunt();
    };

    const handleChange = (e) => {
        props.getPokemon(e.target.value, props.index);
        console.log("calling getPokemon:", e.target.value, props.index);
        props.setActiveTarget(e.target.value.toLowerCase());
    };

    const handleDelete = (e) => {
        let newHunts = [...props.hunts];
        newHunts.splice(props.index, 1);
        props.setHunts(newHunts);
        document.getElementById("settings-form").reset();
    };

    const handleActivate = (e) => {
        let newHunts = [...props.hunts];
        newHunts.map((hunt) => {
            if (hunt.active)
                hunt.active = false;
        });
        newHunts[props.index].active = true;
        props.setHunts(newHunts);
        props.activePokemon(props.hunt, props.index);
        console.log("set active target to ", props.hunt.target);
        console.log(newHunts);
    };

    return (
        <div>
            <img className="target-sprite" src={props.hunt.targetImg} alt="Pokemon Sprite"/>
            <form id="settings-form" onSubmit={handleSubmit}>
                <div className="target-input">
                    <label>Target: </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        placeholder="Enter Pok&eacute;mon"
                    />
                </div>
            
                <div className="count-input">
                    <input
                        type="text"
                        placeholder={props.hunt.count}
                    />
                </div>
                <div className="gen-input">
                    <label>Gen: </label>
                    <select name="gen" className="gen-dropdown">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                    </select>
                </div>
                <div className="method-input">
                    <label>Method: </label>
                    <select name="method" className="method-dropdown">
                        <option value="full-odds">Full Odds</option>
                        <option value="random">Random Encounter</option>
                        <option value="sr">SR</option>
                        <option value="masuda">Masuda Method</option>
                        <option value="dexnav">Dex Nav</option>
                        <option value="friend-safari">Friend Safari</option>
                        <option value="radar">Radar Chaining</option>
                        <option value="fishing">Chain Fishing</option>
                        <option value="sos">S.O.S</option>
                    </select>
                </div>
                <div className="phase-input">
                    <label>Phase: </label>
                    <input
                        type="text"
                        // onChange={props.handleChange}
                        placeholder="0"
                    />
                </div>
                <div className="shiny-charm">
                    <label>Shiny Charm? </label>
                    <input
                        type="checkbox"
                        // onChange={props.handleChange}
                        name="shiny-charm"
                        value="shiny-charm"
                    />
                </div>
            </form> {/* form won't submit if i include all inputs */}
                <button className="delete-hunt" onClick={handleDelete}>
                    Delete
                </button>
                <div className="active-button">
                    <button className="active" onClick={handleActivate}>
                        Active
                    </button>
                </div>
            {/* </form> */}
        </div>
    )
}
