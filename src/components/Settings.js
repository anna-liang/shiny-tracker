import React from 'react'
import '../styles/Settings.css';

export default function Settings(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        let target = e.target.elements[0].value.toLowerCase();
        props.getPokemon(target, props.index);
        console.log("calling getPokemon:", target, props.index);
        if (props.hunt.active) {
            props.setActiveTarget(target);
            props.activePokemon(props.hunt, props.index);
        }
        // props.updateHunt();
    };

    const handleDelete = (e) => {
        let newHunts = [...props.hunts];
        newHunts.splice(props.index, 1);
        props.setHunts(newHunts);
        document.getElementById("target-form").reset();
        if (props.hunt.active)
            props.revertDefault();
    };

    const handleActivate = (e) => {
        let oldActiveState = props.hunt.active;
        // if inactive to active
        if (!oldActiveState)
            props.activePokemon(props.hunt, props.index);
        else
            props.revertDefault();
        let newHunts = [...props.hunts];
        newHunts.map((hunt) => {
            if (hunt.active)
                hunt.active = false;
        });
        newHunts[props.index].active = !oldActiveState;
        console.log(newHunts[props.index].target, "old state", oldActiveState, "new state", newHunts[props.index].active);
        props.setHunts(newHunts);
    };

    // const handleCount = (e) => {
    //     e.preventDefault();
    //     let count = parseInt(e.target.elements[0].value);
    //     console.log("setting new count to", count);
    //     let newHunts = [...props.hunts];
    //     if (props.hunt.active) {
    //         props.setActiveCounter(count);
    //         newHunts[props.activeIndex].count = count;
    //     }
    //     props.hunt.count = count;
    //     props.setHunts(newHunts);
    // };

    return (
        <div>
            <img className="target-sprite" src={props.hunt.targetImg} alt="Pokemon Sprite"/>
            <form id="target-form" onSubmit={handleSubmit}>
                <div className="target-input">
                    <label>Target: </label>
                    <input
                        type="text"
                        placeholder="Enter Pok&eacute;mon"
                        defaultValue={props.hunt.target}
                    />
                </div>
            </form>
                <div className="count">
                    <label>Count: </label>
                    <p>{props.hunt.count}</p>
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
                        // placeholder={props.hunt.phase}
                        defaultValue={props.hunt.phase}
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
            {/* </form> form won't submit if i include all inputs */}
                <button className="delete-hunt" onClick={handleDelete}>
                    Delete
                </button>
                {/* <IconButton aria-label="delete" onClick={handleDelete}> */}
                    {/* <DeleteIcon /> */}
                {/* </IconButton> */}
                <span class="material-icons-outlined">
                delete
                </span>
                <div className="active-button">
                    <button className="active" onClick={handleActivate}>
                        Active
                    </button>
                </div>
            {/* </form> */}
        </div>
    )
}
