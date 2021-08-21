import React, { useState } from 'react';
import axios from 'axios';
import CounterHunts from './components/CounterHunts';

function App() {

  const [activeTarget, setTarget] = useState("pikachu");
  const [activeTargetImg, setTargetImg] = useState("");
  const [step, setStep] = useState(1);
  const [counter, setCounter] = useState(0);
  const [hunts, setHunts] = useState([]);

  const getPokemon = async (target, index) => {
    try {
      console.log(`updating ${index} with ${target}`);
      const url = `https://pokeapi.co/api/v2/pokemon/${target}`;
      const res = await axios.get(url);
      let newHunts = [...hunts];
      let newHunt = {
        target: target,
        targetImg: res.data.sprites["front_shiny"],
        count: 0,
        gen: 2,
        method: "full odds",
        phase: 0,
        charm: false,
        active: false
      };
      if (index === hunts.length)
        newHunts.push(newHunt);
      else
        newHunts[index] = newHunt;
      setHunts(newHunts);
      console.log(res);
    } catch (e) {
      // TODO:
      // Handle error: 404
      // Invalid pokemon name entered -- no sprite
      console.log(e);
    }
  };

  const updateHunt = async () => {
    console.log(counter);
    try {
      const url = "http://localhost:3001/api/hunt";
      const res = await axios.post(url, { 
        "target": activeTarget, 
        "count": counter, 
        withCredentials: true 
      });
      console.log(res);
      console.log(res.headers);
    } catch (e) {
      console.log(e);
    }
  };

  // const getPokemonSprite = async () => {
  //   try {
  //     const url = `https://play.pokemonshowdown.com/sprites/ani-shiny/pikachu.gif`;
  //     const res = await axios.get(url);
  //     console.log(res);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  return (
    <div className="App">
      <CounterHunts
        getPokemon={getPokemon}
        setTarget={setTarget}
        targetImg={activeTargetImg}
        counter={counter}
        setCounter={setCounter}
        step={step}
        setStep={setStep}
        updateHunt={updateHunt}
        hunts={hunts}
        setHunts={setHunts}
      />
    </div>
  );
}

export default App;
