import React, { useState } from 'react';
import axios from 'axios';
import CounterHunts from './components/CounterHunts';

function App() {

  const [target, setTarget] = useState("pikachu");
  const [targetImg, setTargetImg] = useState("");
  const [step, setStep] = useState(1);
  const [counter, setCounter] = useState(0);
  const [hunts, setHunts] = useState([]);

  const getPokemon = async () => {
    try {
      const url = `https://pokeapi.co/api/v2/pokemon/${target}`;
      const res = await axios.get(url);
      setTargetImg(res.data.sprites["front_shiny"]);
      console.log(res);
    } catch (e) {
      // Handle error: 404
      // Invalid pokemon name entered -- no sprite
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
        targetImg={targetImg}
        counter={counter}
        setCounter={setCounter}
        step={step}
        setStep={setStep}
      />
    </div>
  );
}

export default App;
