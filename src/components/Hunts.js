import React from 'react';
import Settings from './Settings';

export default function Hunts(props) {

    return (
        <div>
            <button onClick={() => {props.getPokemon("pikachu", props.hunts.length)}}>
                New Hunt
            </button>
            {props.hunts.map(function(hunt, index) {
                return (
                <div key={index}>
                    <div>{hunt.target}</div>
                    <Settings 
                        getPokemon={props.getPokemon}
                        setActiveTarget={props.setActiveTarget}
                        setActiveCounter={props.setActiveCounter}
                        activeIndex={props.activeIndex}
                        updateHunt={props.updateHunt}
                        setHunts={props.setHunts}
                        index={index}
                        hunts={props.hunts}
                        hunt={hunt}
                        activePokemon={props.activePokemon}
                    />
                </div>
                );
            })}
        </div>
    )
}
