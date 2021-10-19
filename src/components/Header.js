import React from 'react';
import Login from './Login';
import '../styles/Header.css';

export default function Header(props) {

    return (
        <div className="header-container">
            <Login
                getHunts={props.getHunts}
                getActiveHunt={props.getActiveHunt}
                renderError={props.renderError}
                clearError={props.clearError}
                getUsername={props.getUsername}
            />
        </div>
    );

};