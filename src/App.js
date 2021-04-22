import './App.css';
import DeckGL from '@deck.gl/react';
import { OrbitView } from '@deck.gl/core';


function App() {
  return (
    <div className="App">
      <DeckGL
        parameters={{
          clearColor: [0, 0, 0, 1]
        }}
        initialViewState={{
          rotationX: 45,
          rotationOrbit: -45,
          zoom: 5,
          pitch: 0
        }}
        views={new OrbitView({
          minZoom: 0.1,
          maxZoom: 10,
          minRotationX: -90,
          maxRotationX: 90,
          target: [0, 0, 0]
        })}
        controller={true}
      />
    </div>
  );
}

export default App;
