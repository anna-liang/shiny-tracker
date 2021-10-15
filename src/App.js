import React, { useState } from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import CounterHunts from './components/CounterHunts';
import Header from './components/Header';
import './styles/Main.css';

function App() {

  const [activeTarget, setActiveTarget] = useState("pikachu");
  const [activeTargetImg, setActiveTargetImg] = useState("");
  const [step, setStep] = useState(1);
  const [activeCounter, setActiveCounter] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hunts, setHunts] = useState([]);

  let getUsername = function(){
    return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  };

  const getPokemon = async (target) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${target}`;
      const res = await axios.get(url);
      clearError();
      return res.data.sprites["front_shiny"];
    } catch (e) {
      // TODO:
      // Handle error: 404
      // Invalid pokemon name entered -- no sprite
      renderError(e);
    }
  };

  const newHunt = async (target, index) => {
    console.log(`updating ${index} with ${target}`);
    let targetImg = await getPokemon(target);
    console.log(targetImg);
    try {
      const url = "http://localhost:3001/api/hunt";
      const res = await axios.post(url, { 
        "target": target, 
        "targetImg": targetImg,
        "count": 0,
        "gen": 2,
        "method": "full-odds",
        "phase": 0,
        "charm": false,
        "active": false,
      }, {
        withCredentials: true,
      });
      let newHunts = [...hunts];
      if (index === hunts.length)
        newHunts.push(res.data);
      else
        newHunts[index] = res.data;
      // if (index === activeIndex)
      //   setActiveTargetImg(res.data.targetImg);
      setHunts(newHunts);
      clearError();
      console.log(res);
      console.log(res.headers);
    } catch (e) {
      renderError(e);
    }
  };

  const updateTarget = async (target, index) => {
    let hunt = hunts[index];
    console.log(hunt);
    let targetImg = await getPokemon(target);
    if (targetImg !== undefined) {
      try {
        const url = "http://localhost:3001/api/hunt/" + hunt._id + "/";
        await axios.patch(url, { 
          "target": target, 
          "targetImg": targetImg,
          "count": hunt.count,
          "gen": hunt.gen,
          "method": hunt.method,
          "phase": hunt.phase,
          "charm": hunt.charm,
          "active": hunt.active,
        }, {
          withCredentials: true,
        });
        let newHunts = [...hunts];
        newHunts[index].target = target;
        newHunts[index].targetImg = targetImg;
        setHunts(newHunts);
        clearError();
      } catch (e) {
        renderError(e);
      }
    }
  };

  const activePokemon = (hunt, index) => {
    console.log(hunt, index);
    setActiveTarget(hunt.target);
    setActiveTargetImg(hunt.targetImg);
    console.log(hunt.count);
    setActiveCounter(hunt.count);
    setActiveIndex(index);
    console.log("set active target to ", hunt.target, hunt.active);
  };

  const revertDefault = () => {
    setActiveTarget('');
    setActiveTargetImg('');
    setActiveCounter(0);
    setActiveIndex(0);
    console.log("reverting to default");
  };

  const getHunts = async () => {
    console.log("called getHunts");
    try {
      const url = "http://localhost:3001/api/hunt";
      const res = await axios.get(url, {
        withCredentials: true,
      });
      console.log(hunts);
      let newHunts = [...hunts];
      newHunts = res.data;
      // console.log(res.data);
      console.log(newHunts);
      setHunts(newHunts);
      clearError();
    } catch (e) {
      renderError(e);
    }
  };

  const getActiveHunt = async () => {
    try {
        const url = "http://localhost:3001/api/activeHunt";
        const res = await axios.get(url, {
          withCredentials: true,
        });
        let hunt = res.data;
        console.log(hunt);
        setActiveCounter(hunt.count);
        setActiveTargetImg(hunt.targetImg);
        clearError();
        return hunt;
    } catch (e) {
        renderError(e);
    }
  };

  const renderError = (e) => {
    console.error(e);
    var errorCont = document.querySelector(".error-container");
    errorCont.style.display = 'block';
    var errorBox = document.querySelector(".error-box");
    errorBox.innerHTML = e;
    errorBox.style.visibility = 'visible';
  }

  const clearError = () => {
    var errorCont = document.querySelector(".error-container");
    errorCont.style.display = 'none';
    var errorBox = document.querySelector(".error-box");
    errorBox.style.visibility = 'none';
  }

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
        getUsername={getUsername}
      />
      {getUsername() ?
        <CounterHunts
          newHunt={newHunt}
          setActiveTarget={setActiveTarget}
          activePokemon={activePokemon}
          activeTargetImg={activeTargetImg}
          activeCounter={activeCounter}
          setActiveCounter={setActiveCounter}
          revertDefault={revertDefault}
          step={step}
          setStep={setStep}
          updateTarget={updateTarget}
          hunts={hunts}
          setHunts={setHunts}
          activeIndex={activeIndex}
          getHunts={getHunts}
          getActiveHunt={getActiveHunt}
          renderError={renderError}
          clearError={clearError}
          getUsername={getUsername}
        />
        :
        <h1>Welcome to Shiny Tracker!</h1>
      }
    </div>
  );
}

export default App;
