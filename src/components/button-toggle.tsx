"use client";

import {useState} from "react";

export default function ToggleButton() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => setIsOn(!isOn)}
      className={`relative w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
        isOn ? "bg-foreground" : "bg-gray-300"
      }`}
    >
      <span
        className={`size-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
          isOn ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}