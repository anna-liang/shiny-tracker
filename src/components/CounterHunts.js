import React from 'react';
import Counter from './Counter';
import Hunts from './Hunts';

export default function CounterHunts(props) {
    return (
        <div>
            <Counter
                activeTargetImg={props.activeTargetImg}
                activeCounter={props.activeCounter}
                setActiveCounter={props.setActiveCounter}
                step={props.step}
                setStep={props.setStep}
                activeIndex={props.activeIndex}
                hunts={props.hunts}
                setHunts={props.setHunts}
            />
            <Hunts
                getPokemon={props.getPokemon}
                setActiveTarget={props.setActiveTarget}
                setActiveCounter={props.setActiveCounter}
                activeIndex={props.activeIndex}
                updateHunt={props.updateHunt}
                hunts={props.hunts}
                setHunts={props.setHunts}
                activePokemon={props.activePokemon}
            />
        </div>
    )
}
