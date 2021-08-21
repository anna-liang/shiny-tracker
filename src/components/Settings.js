import React from 'react'

export default function Settings(props) {

    const handleSubmit = (e) => {
        e.preventDefault();
        props.updateHunt();
    };

    const handleChange = (index) => (e) => {
        props.getPokemon(e.target.value, index);
        console.log("calling getPokemon:", e.target.value, index);
        props.setTarget(e.target.value.toLowerCase());
    };

    const handleDelete = index => (e) => {
        let newHunts = [...props.hunts];
        newHunts.splice(index, 1);
        props.setHunts(newHunts);
        document.getElementById("settings-form").reset();
    };

    return (
        <div>
            <img className="target-sprite" src={props.targetImg} alt="Pokemon Sprite"/>
            <form id="settings-form" onSubmit={handleSubmit}>
                <div className="target-input">
                    <label>Target: </label>
                    <input
                        type="text"
                        onChange={handleChange(props.index)}
                        placeholder="Enter Pok&eacute;mon"
                    />
                </div>
            
                <div className="count-input">
                    <input
                        type="text"
                        placeholder="0"
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
                <button className="delete-hunt" onClick={handleDelete(props.index)}>
                    Delete
                </button>
                <div className="active-button">
                    <button className="active">
                        Active
                    </button>
                </div>
            {/* </form> */}
        </div>
    )
}
