import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../styles/Counter.css';
import '../styles/Main.css';

export default function Counter(props) {

    const handleCountClick = (action) => async (e) => {
        let hunt = await props.getActiveHunt();
        let count = props.activeCounter;
        if (action === "increment") {
            count = props.activeCounter + props.step;
            if (hunt !== undefined) props.setActiveCounter(count);
        }
        else if (action === "decrement") {
            count = Math.max(props.activeCounter - props.step, 0);
            if (hunt !== undefined) props.setActiveCounter(count);
        }
        else if (action === "reset") {
            count = 0;
            if (hunt !== undefined) props.setActiveCounter(count);
        }
        if (hunt !== null && props.getUsername()) {
            try {
                // const url = "http://localhost:3001/api/hunt/" + hunt._id + "/";
                await axios.patch(props.apiUrl + "api/hunt/" + hunt._id + "/", { 
                    "target": hunt.target, 
                    "targetImg": hunt.targetImg,
                    "count": count,
                    "gen": hunt.gen,
                    "method": hunt.method,
                    "phase": hunt.phase,
                    "charm": hunt.charm,
                    "active": hunt.active,
                }, {
                    withCredentials: true,
                });
                props.clearError();
            } catch (err) {
                props.renderError(err);
            }
        }
    };

    return (
        <div className="counter">
            <div className="img-count">
                <img className={props.activeTargetImg === '' ? "hidden" : "target-sprite"} src={props.activeTargetImg} alt="Pokemon Sprite"/>
                <div className="active-count">
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
