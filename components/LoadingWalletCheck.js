import React, {useState} from "react";
export default function CheckingForWallet () {
    const string = "Checking for wallet...";
    
    return (
      <div className="loader">
        <img src="/loader.gif" />
        <p>
          {string}
        </p>
      </div>
    );
};
  
  