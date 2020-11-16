import React from "react";

export default function Button({ onClick, text}) {
    return (
        <button onClick={onClick}>
            <h1>{text}</h1>
        </button>
    ); 
}