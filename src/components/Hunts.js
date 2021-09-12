import React from 'react';
import Settings from './Settings';

export default function Hunts(props) {

    const handleStep = (e) => {
        e.preventDefault();
        console.log("setting step to", e.target.elements[0].value);
        props.setStep(parseInt(e.target.elements[0].value));
    };

    return (
        <div>
            <button onClick={() => {props.getPokemon("pikachu", props.hunts.length)}}>
                New Hunt
            </button>
            <form id="step-form" onSubmit={handleStep}>
                <div className="step-input">
                    <label>Step: </label>
                    <input 
                        type="text"
                        defaultValue={props.step}
                    />
                </div>
            </form>
            {props.hunts.map(function(hunt, index) {
                if (index > 0) {
                    return (
                    <div key={index}>
                        <div>{hunt.target}</div>
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
                    </div>
                    );
                }
            })}
        </div>
    )
}
