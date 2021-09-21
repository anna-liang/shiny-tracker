import React from 'react';
import Button from '@mui/material/Button';

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
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleCountClick("decrement")}
                >
                    -
                </Button>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleCountClick("increment")}
                >
                    +
                </Button>
            </div>
            <Button 
                variant="outlined" 
                color="error" 
                onClick={handleCountClick("reset")}
            >
                Reset
            </Button>
        </div>
    )
}
