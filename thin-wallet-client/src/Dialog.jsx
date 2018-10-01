import React from 'react';

const Dialog = (props) => {

    let message ={
        notScatterConnected: "We could not pair with your Scatter account. Please ensure that the Scatter desktop application or web estension is signed in before trying again.",
        authRefused: "The request to pair with your Scatter account was refused.",
        transacRefused: "We could not performed the transaction."
    }

    return (
    <div className="Dialog">
        <p>{message[props.error]}</p>
        <button onClick={props.updateState(["error", false])}>OK</button>
    </div>
    )

}

export default Dialog;