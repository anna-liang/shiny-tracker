import React from 'react';
import Settings from './Settings';

export default function Hunts(props) {

    return (
        <div>
            {props.hunts.map(function(hunt, index) {
                return (<Settings 
                    key={index}
                    targetImg={hunt.targetImg}
                    getPokemon={props.getPokemon}
                    setTarget={props.setTarget}
                    updateHunt={props.updateHunt}
                    setHunts={props.setHunts}
                    index={index}
                />);
            })}
        </div>
    )
}
