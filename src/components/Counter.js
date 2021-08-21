import React from 'react';

export default function Counter(props) {
    return (
        <div>
            <img className="target-sprite" src={props.targetImg} alt="Pokemon Sprite"/>
            <div className="count">
                {props.counter}
            </div>
            <div className="counter-buttons">
                <button className="decrement" onClick={() => {props.setCounter(Math.max(props.counter - props.step, 0))}}>
                    -
                </button>
                <button className="increment" onClick={() => {props.setCounter(props.counter + props.step)}}>
                    +
                </button>
            </div>
            <button className="reset" onClick={() => {props.setCounter(0)}}>
                Reset
            </button>
        </div>
    )
}
