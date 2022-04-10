import React, { useState } from 'react';
import sparkle from '../media/shiny-sparkle.gif';
import '../styles/SparkleTitle.css';

export default function SparkleTitle(props) {

    const [loaded, setLoaded] = useState(false);

    const handleLoadClick = () => {
        setLoaded(true);
    }

    return(
        <div className={loaded ? "fade-out" : "sparkle-container"} onClick={handleLoadClick}>
            <img className="shiny-sparkle" src={sparkle} alt="shiny sparkles"/>
        </div>
    );

}