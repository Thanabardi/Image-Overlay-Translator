import React from "react";
import { render } from "react-dom";

function Popup() {
  return (
    <div>
      <h1>hi</h1>
      <p>this is a popup</p>
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));