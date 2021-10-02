import React, { useState } from 'react';
import axios from 'axios';
import CounterHunts from './components/CounterHunts';
import Header from './components/Header';

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
    method: "full-odds",
    phase: 0,
    charm: false,
    active: false
  }]);

  const getPokemon = async (target) => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${target}`;
      const res = await axios.get(url);
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
        "method": "full-odds",
        "phase": 0,
        "charm": false,
        "active": false,
      });
      let newHunts = [...hunts];
      if (index === hunts.length)
        newHunts.push(res.data);
      else
        newHunts[index] = res.data;
      // if (index === activeIndex)
      //   setActiveTargetImg(res.data.targetImg);
      setHunts(newHunts);
      console.log(res);
      console.log(res.headers);
    } catch (e) {
      console.log(e);
    }
  };

  const updateTarget = async (target, index) => {
    let hunt = hunts[index];
    let targetImg = await getPokemon(target);
    try {
      const url = "http://localhost:3001/api/hunt";
      const res = await axios.patch(url, { 
        "id": hunt.id,
        "target": target, 
        "targetImg": targetImg,
        "count": hunt.count,
        "gen": hunt.gen,
        "method": hunt.method,
        "phase": hunt.phase,
        "charm": hunt.charm,
        "active": hunt.active,
      });
      let newHunts = [...hunts];
      newHunts[index].target = target;
      newHunts[index].targetImg = targetImg;
      setHunts(newHunts);
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
      <Header/>
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
      />
    </div>
  );
}

export default App;
