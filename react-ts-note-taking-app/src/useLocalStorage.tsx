import { useEffect, useState } from "react";

// this hook:
//  -accepts a generic type <T>
//  -takes 2 parameters
//      1. a key of type string
//      2. an initial value that may be of type:
//          - <T>
//          - a function that returns a type <T>

// note: initial value has two possible types because 
// useState can accept either a type or function for it's initialValue
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {

    // this useState hook will check if the 
    // data with the label is in local storage 
    //  - if its not set value to the initial value
    //  - else return what was in local storage
    const [value, setValue] = useState<T>(() => {
        // jsonValue will be set to the value of 
        // whats retrieved from local storage, if anything
        const jsonValue = localStorage.getItem(key)

        // if data does not exist in local storage
        if(jsonValue == null) {

            // then check if initialValue is a function
            if (typeof initialValue === "function"){
                // if it is, execute initialValue as a 
                // function that returns a generic type T
                return (initialValue as () => T)();
            }
            // else we know initialValue is of type <T>
            // so return initialValue
            else{
                return initialValue;
            }

        // else data exists so...
        }else{
            // return JSON object of that data
            return JSON.parse(jsonValue);
        }
    })

    // save value and key, anytime either one of them changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value, key])

    // return useState hook
    return [value, setValue] as [T, typeof setValue];
}