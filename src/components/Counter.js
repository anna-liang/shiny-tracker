import React from 'react';

export default function Counter(props) {

    const handleCountClick = (action) => (e) => {
        let newHunts = [...props.hunts];
        if (action === "increment") {
            props.setActiveCounter(props.activeCounter + props.step);
            newHunts[props.activeIndex].count = props.activeCounter + props.step;
        }
        else if (action === "decrement") {
            props.setActiveCounter(Math.max(props.activeCounter - props.step, 0));
            newHunts[props.activeIndex].count = Math.max(props.activeCounter - props.step, 0);
        }
        else if (action === "reset") {
            props.setActiveCounter(0);
            newHunts[props.activeIndex].count = 0;
        }
        props.setHunts(newHunts);
    };

    return (
        <div>
            <img className="target-sprite" src={props.activeTargetImg} alt="Pokemon Sprite"/>
            <div className="count">
                {props.activeCounter}
            </div>
            <div className="counter-buttons">
                <button className="decrement" onClick={handleCountClick("decrement")}>
                    -
                </button>
                <button className="increment" onClick={handleCountClick("increment")}>
                    +
                </button>
            </div>
            <button className="reset" onClick={handleCountClick("reset")}>
                Reset
            </button>
        </div>
    )
}
