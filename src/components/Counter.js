import React from 'react';
import Button from '@mui/material/Button';
import '../styles/Counter.css';

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
        <div className="counter">
            <div className="img-count">
                <img className={props.activeTargetImg == '' ? "hidden" : "target-sprite"} src={props.activeTargetImg} alt="Pokemon Sprite"/>
                <div className="count">
                    {props.activeCounter}
                </div>
            </div>
            <div className="counter-reset-btns">
                <div className="counter-btns">
                    <Button 
                        className="decrement-btn"
                        variant="contained" 
                        color="error" 
                        onClick={handleCountClick("decrement")}
                    >
                        -
                    </Button>
                    <Button 
                        className="decrement-btn"
                        variant="contained" 
                        color="success" 
                        onClick={handleCountClick("increment")}
                    >
                        +
                    </Button>
                </div>
                <div className="reset-btn">
                    <Button 
                        className="reset-btn"
                        variant="outlined" 
                        color="error" 
                        onClick={handleCountClick("reset")}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}
