import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import CounterHunts from './components/CounterHunts';
import Header from './components/Header';
import SparkleTitle from './components/SparkleTitle';
import Title from './components/Title';
import './styles/Main.css';

function App() {

  /* Dev */
  // const apiUrl = "http://localhost:3001/";
  /* Prod */
  const apiUrl = "https://shinytrackerserver.herokuapp.com/";
  const [activeTargetImg, setActiveTargetImg] = useState("");
  const [activeCounter, setActiveCounter] = useState(0);
  const [hunts, setHunts] = useState([]);
  const [signedIn, setSignedIn] = useState("");

  let handleSignIn = function(isSignedIn){
    setSignedIn(isSignedIn);
  };

  const getPokemon = async (target) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${target}`;
      const res = await axios.get(url);
      clearError();
      return res.data.sprites["front_shiny"];
    } catch (err) {
      renderError(err);
    }
  };

  const activePokemon = (hunt) => {
    setActiveTargetImg(hunt.targetImg);
    setActiveCounter(hunt.count);
  };

  const revertDefault = () => {
    setActiveTargetImg('');
    setActiveCounter(0);
  };

  const updateActiveCounter = (count) => {
    setActiveCounter(count)
  };

  const updateHunts = (newHunts) => {
    setHunts(newHunts);
  };

  const getHunts = async () => {
    try {
      const res = await axios.get(apiUrl + "api/hunt", {
        withCredentials: true,
      });
      let newHunts = [...hunts];
      newHunts = res.data;
      setHunts(newHunts);
      clearError();
    } catch (err) {
      renderError(err);
    }
  };

  const getActiveHunt = async () => {
    try {
        const res = await axios.get(apiUrl + "api/activeHunt", {
          withCredentials: true,
        });
        let hunt = res.data;
        if (hunt !== null) {
          setActiveCounter(hunt.count);
          setActiveTargetImg(hunt.targetImg);
          clearError();
        }
          return hunt;
    } catch (err) {
        renderError(err);
    }
  };

  const renderError = (err) => {
    console.error(err);
    var errorCont = document.querySelector(".error-container");
    errorCont.style.display = 'block';
    var errorBox = document.querySelector(".error-box");
    errorBox.innerHTML = err;
    errorBox.style.visibility = 'visible';
  }

  const clearError = () => {
    var errorCont = document.querySelector(".error-container");
    errorCont.style.display = 'none';
    var errorBox = document.querySelector(".error-box");
    errorBox.style.visibility = 'none';
  }

  useEffect(() => {
    if (signedIn) getActiveHunt();
    clearError();
  }, []);

  return (
    <div className="App">
      <div className="error-container">
          <Alert severity="error" className="error-box"></Alert>
      </div>
      <Header
        getHunts={getHunts}
        getActiveHunt={getActiveHunt}
        renderError={renderError}
        clearError={clearError}
        signedIn={signedIn}
        handleSignIn={handleSignIn}
        apiUrl={apiUrl}
      />
      {!signedIn ?
      <SparkleTitle
        signedIn={signedIn}
      />
      :
      null
      }
      {signedIn ?
        <CounterHunts
          getPokemon={getPokemon}
          activePokemon={activePokemon}
          activeTargetImg={activeTargetImg}
          activeCounter={activeCounter}
          updateActiveCounter={updateActiveCounter}
          revertDefault={revertDefault}
          hunts={hunts}
          updateHunts={updateHunts}
          getHunts={getHunts}
          getActiveHunt={getActiveHunt}
          renderError={renderError}
          clearError={clearError}
          signedIn={signedIn}
          apiUrl={apiUrl}
        />
        :
        <Title/>
      }
    </div>
  );
}

export default App;
