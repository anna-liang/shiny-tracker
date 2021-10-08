import React from 'react';
import Login from './Login';
import '../styles/Header.css';

export default function Header(props) {

    return (
        <div className="header-container">
            <Login
                getActiveHunt={props.getActiveHunt}
                getHunts={props.getHunts}
            />
        </div>
    );

};