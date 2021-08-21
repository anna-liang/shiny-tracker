import React from 'react';
import Counter from './Counter';
import Hunts from './Hunts';

export default function CounterHunts(props) {
    return (
        <div>
            <Counter
                targetImg={props.targetImg}
                counter={props.counter}
                setCounter={props.setCounter}
                step={props.step}
                setStep={props.setStep}
            />
            <Hunts
                getPokemon={props.getPokemon}
                setTarget={props.setTarget}
                updateHunt={props.updateHunt}
                hunts={props.hunts}
                setHunts={props.setHunts}
            />
        </div>
    )
}
