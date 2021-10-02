import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../styles/Counter.css';

export default function Counter(props) {

    const handleCountClick = (action) => async (e) => {
        let newHunts = [...props.hunts];
        let hunt = props.hunts[props.activeIndex];
        let count = props.activeCounter;
        if (action === "increment") {
            count = props.activeCounter + props.step;
            props.setActiveCounter(count);
            newHunts[props.activeIndex].count = props.activeCounter + props.step;
        }
        else if (action === "decrement") {
            count = Math.max(props.activeCounter - props.step, 0);
            props.setActiveCounter(count);
            newHunts[props.activeIndex].count = Math.max(props.activeCounter - props.step, 0);
        }
        else if (action === "reset") {
            count = 0;
            props.setActiveCounter(count);
            newHunts[props.activeIndex].count = 0;
        }
        try {
            const url = "http://localhost:3001/api/hunt";
            await axios.patch(url, { 
                "id": hunt.id,
                "target": hunt.target, 
                "targetImg": hunt.targetImg,
                "count": count,
                "gen": hunt.gen,
                "method": hunt.method,
                "phase": hunt.phase,
                "charm": hunt.charm,
                "active": hunt.active,
            });
        } catch (e) {
            console.log(e);
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
