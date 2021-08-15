import React from 'react';
import Counter from './Counter';
import Hunts from './Hunts';

export default function CounterHunts(props) {
    return (
        <div>
            <Counter
                getPokemon={props.getPokemon}
                setTarget={props.setTarget}
                targetImg={props.targetImg}
                counter={props.counter}
                setCounter={props.setCounter}
                step={props.step}
                setStep={props.setStep}
            />
            <Hunts
            />
        </div>
    )
}
