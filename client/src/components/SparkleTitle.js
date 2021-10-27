import React from 'react';
import sparkle from '../media/shiny-sparkle.gif';
import '../styles/SparkleTitle.css';

export default function SparkleTitle(props) {

    const handleLoadClick = () => {
        props.setLoaded(true);
    }

    return(
        <div className={props.loaded ? "fade-out" : "sparkle-container"} onClick={handleLoadClick}>
            <img className="shiny-sparkle" src={sparkle} alt="shiny sparkles"/>
        </div>
    );

}