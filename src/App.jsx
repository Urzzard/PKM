import { useState } from 'react';
import { NavbarIndex } from './Navbar.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VerPokemon } from './Pokemon.jsx';
import { VerPokedex } from './Pokedex.jsx';

function App() {

  return (
    <>
      <NavbarIndex />
      <Router>
        <Routes>
          <Route path="/Pokemon" element={<VerPokemon/>}/>
          <Route path="/Pokedex" element={<VerPokedex/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
