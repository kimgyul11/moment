import { useState } from "react";

const useInput = (validation) => {
  const [enterdValue, setEnterdValue] = useState("");
  const [inputTouched, setInputTouched] = useState(false);

  const enteredValueIsValid = validation(enterdValue);
  const hasErr = !enteredValueIsValid && inputTouched;
  const complete = !hasErr && inputTouched;

  const onChange = (e) => {
    setEnterdValue(e.target.value);
  };
  const onBlur = () => {
    setInputTouched(true);
  };
  const reset = () => {
    setEnterdValue("");
    setInputTouched(false);
  };

  return {
    enterdValue,
    enteredValueIsValid,
    hasErr,
    onChange,
    onBlur,
    complete,
    reset,
  };
};

export default useInput;
