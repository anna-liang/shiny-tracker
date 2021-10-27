import React from 'react';
import '../styles/Title.css';
import pokeball from '../media/pokeball.png';

export default function Title() {
    return (
        <div className="title-container">
            <img className="pokeball" src={pokeball} alt="pokeball"/>
            <h1 className="title">Welcome to <span className="shiny">Shiny</span> Tracker</h1>
            <p className="tagline">Never lose track of your shiny hunts ever again</p>
        </div>
    );
}