import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./SearchBar.css";

const SearchBar: React.FC = () => {
  const [input, setInput] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" style={{color:"grey"}}/>
      <input
        placeholder="Search User"
        value={input}
        onChange={handleChange}
        className="input-search"
      />
    </div>
  );
};

export default SearchBar;
