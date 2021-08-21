import React from 'react';
import Settings from './Settings';

export default function Hunts(props) {

    const handleDelete = index => (e) => {
        let newHunts = [...props.hunts];
        newHunts.splice(index, 1);
        props.setHunts(newHunts);
    };

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
                        targetImg={hunt.targetImg}
                        getPokemon={props.getPokemon}
                        setTarget={props.setTarget}
                        updateHunt={props.updateHunt}
                        setHunts={props.setHunts}
                        index={index}
                        hunts={props.hunts}
                        handleDelete={handleDelete}
                    />
                </div>
                );
            })}
        </div>
    )
}
