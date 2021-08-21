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
                        // key={index}
                        targetImg={hunt.targetImg}
                        getPokemon={props.getPokemon}
                        setTarget={props.setTarget}
                        updateHunt={props.updateHunt}
                        setHunts={props.setHunts}
                        index={index}
                    />
                </div>
                );
            })}
        </div>
    )
}
