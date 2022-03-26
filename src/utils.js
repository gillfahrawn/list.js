import React, { useEffect } from 'react';
import App from './App';
import forceUpdate from './App.js'

const makeId = () =>  {
    let divord = localStorage.getItem('divorder');
    let len = localStorage.length;
    if (divord != null) {
        // console.log("DIVORD pre split: " + divord);
        let divord_arr =  divord.split(','); 

        // console.log(divord_arr + " < DIVORD POST SPLIT");
        for (let i=0; i<divord_arr.length; i++) {
        // // console.log(divord_arr[i] + " " + typeof(divord_arr[i]) + " IS THE " + i + "TH DIVORD ELEM");
        }
        console.log(divord_arr + " < divord_array");
        console.log(len + "< LEN");
        if (divord_arr.includes(String(len)) != false) {
            let i = len;
        while (divord_arr.includes(String(i)) != false) {
            i++;
            // console.log("I IN LOOP: " + i);
        }
        // console.log("THIS IS I: " + i);
        return i;
        }
    }
    return len;
};
  
const getLocalItems = () =>  {
    let out = [];
    let divord = localStorage.getItem('divorder');
    if (divord != null) {
        let divord_arr =  divord.split(','); 
        // console.log(divord_arr + " < DIVORD POST SPLIT");
        for (let i=0; i<divord_arr.length; i++) {
        let value = localStorage.getItem(divord_arr[i]);
        out.push({content : value});
        }
    } 
    // console.log(JSON.stringify(out) + "< OUT ARRAY");
    return out;
};

function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function useOutsideAlerter(ref, outClickedBefore, outClicked, outUpBefore, outUp, setState, count){ //By Ben Bud, 2/14/2017
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
        //   console.log("STATE IS: " + state);
          outClickedBefore = outClicked;
          outClicked=true;
          setState(false);
          forceUpdate();
          count++;
          console.log(outClicked + "> IF-outClicked ");
        //   console.log("STATE IS CHANGED TO: " + state);
        }
        else {
            outClickedBefore = outClicked;
            outClicked = false;
            console.log(outClicked + "> ELSE-OUTCLICK");
        }
      }
      function handleUpOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
        //   console.log("STATE IS: " + state);
            outUpBefore = outUp;
            outUp=true;
            forceUpdate();
            console.log(outUp+ "> IF-outUpPED ");
        //   console.log("STATE IS CHANGED TO: " + state);
        }
        else {
            outUpBefore = outUp;
            outUp = false;
            console.log(outUp + "> ELSE-outUpPED");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("mouseup", handleUpOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("mouseup", handleUpOutside);
      };
    }, [ref]);
  };

  export { makeId, getLocalItems, useOutsideAlerter, arraysEqual };