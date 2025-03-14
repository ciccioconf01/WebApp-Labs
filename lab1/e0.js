"use strict"

function f1(stringa){
    let stringa2 = '';
    let n = stringa.length;

    if (n < 2){
        return undefined;
    }

    stringa2 = stringa[0] + stringa[1] + stringa[n-2] + stringa[n-1];
    return stringa2;
}


let stringa = 'ciao';

let stringa2 = f1(stringa);
console.log(stringa2);