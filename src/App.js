import React, { useState } from 'react';
import axios from 'axios';
import CounterHunts from './components/CounterHunts';
import Login from './components/Login';

function App() {

  const [activeTarget, setActiveTarget] = useState("pikachu");
  const [activeTargetImg, setActiveTargetImg] = useState("");
  const [step, setStep] = useState(1);
  const [activeCounter, setActiveCounter] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hunts, setHunts] = useState([{
    target: '',
    targetImg: '',
    count: 0,
    gen: 2,
    method: "full odds",
    phase: 0,
    charm: false,
    active: false
  }]);

  const getPokemon = async (target) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${target}`;
      const res = await axios.get(url);
      // let newHunts = [...hunts];
      // let newHunt = {
      //   target: target,
      //   targetImg: res.data.sprites["front_shiny"],
      //   count: 0,
      //   gen: 2,
      //   method: "full odds",
      //   phase: 0,
      //   charm: false,
      //   active: false
      // };
      // if (index === hunts.length)
      //   newHunts.push(newHunt);
      // else
      //   newHunts[index] = newHunt;
      // if (index === activeIndex)
      //   setActiveTargetImg(newHunt.targetImg);
      // setHunts(newHunts);
      // console.log(res);
      return res.data.sprites["front_shiny"];
    } catch (e) {
      // TODO:
      // Handle error: 404
      // Invalid pokemon name entered -- no sprite
      console.log(e);
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
        "method": "full odds",
        "phase": 0,
        "charm": false,
        "active": false,
        // withCredentials: true 
      });
      let newHunts = [...hunts];
      // newHunt = res.data;
      if (index === hunts.length)
        newHunts.push(res.data);
      else
        newHunts[index] = res.data;
      if (index === activeIndex)
        setActiveTargetImg(res.data.targetImg);
      setHunts(newHunts);
      console.log(res);
      console.log(res.headers);
    } catch (e) {
      console.log(e);
    }
  };

  const updateHunt = async () => {
    console.log(activeCounter);
    try {
      const url = "http://localhost:3001/api/hunt";
      const res = await axios.post(url, { 
        "target": activeTarget, 
        "count": activeCounter, 
        // withCredentials: true 
      });
      console.log(res);
      console.log(res.headers);
    } catch (e) {
      console.log(e);
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
    // console.log(newHunts);
  };

  const revertDefault = () => {
    setActiveTarget('');
    setActiveTargetImg('');
    setActiveCounter(0);
    setActiveIndex(0);
    console.log("reverting to default");
  }

  return (
    <div className="App">
      <Login/>
      <CounterHunts
        getPokemon={newHunt}
        setActiveTarget={setActiveTarget}
        activePokemon={activePokemon}
        activeTargetImg={activeTargetImg}
        activeCounter={activeCounter}
        setActiveCounter={setActiveCounter}
        revertDefault={revertDefault}
        step={step}
        setStep={setStep}
        updateHunt={updateHunt}
        hunts={hunts}
        setHunts={setHunts}
        activeIndex={activeIndex}
      />
    </div>
  );
}

export default App;
