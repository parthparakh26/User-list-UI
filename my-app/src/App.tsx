import React from 'react';
import './App.css';
import Accordion from './components/Accordion/Accordion';
import SearchBar from './components/SearchBar/SearchBar';

function App() {
  return (
    <div className="App">
      <>
      <SearchBar />
      <Accordion />
      </>
    </div>
  );
}

export default App;
