import React from "react";
export default function CheckingForWallet () {
    const string = "Verifying credentials...";
    
    return (
      <div className="loader">
        <img src="/loader.gif" />
        <p>
          {string}
        </p>
      </div>
    );
};
  
  