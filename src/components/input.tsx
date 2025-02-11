// "use client";

import {EyeIcon, EyeSlashIcon, XCircleIcon} from "@heroicons/react/24/solid";
import React, {InputHTMLAttributes, useRef, useState} from "react";

interface InputProps {
  label: string;
  defaultValue?: string;
  errors?: string[];
}

export default function Input({label, errors, defaultValue, name, type, ...rest}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  const [inputResetBtnVisible, setInputResetBtnVisible] = useState(!!defaultValue);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = () => {
    if (inputRef.current) {
      setInputResetBtnVisible(inputRef.current.value.length > 0);
    }
  };


  const onResetBtnClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setInputResetBtnVisible(false);
    }
  };

  const togglePasswordVisible = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold">{label}</label>
      <div className="border border-gray-300 rounded-md overflow-hidden relative">
        <input
          {...rest}
          name={name}
          id={name}
          type={ name ==="password" ? (passwordVisible ? "text" : "password") : type}
          className={`block w-full py-2 pl-3 ${inputResetBtnVisible ? "pr-10" : "pr-3"}`}
          defaultValue={defaultValue}
          ref={inputRef}
          onChange={onInputChange}
          autoComplete="off"
        />
        {
          inputResetBtnVisible ?
          <XCircleIcon
            className="size-5 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            onClick={onResetBtnClick}
          /> :
          null
        }
        {
          name === "password" && (inputRef.current?.value !== "") ?
          <div className="absolute right-11 top-1/2 -translate-y-1/2 cursor-pointer *:size-4" onClick={togglePasswordVisible}>
            {
              passwordVisible ?
              <EyeIcon className="" /> :
              <EyeSlashIcon className="" />
            }
          </div>
          :
          null
        }
      </div>
      <div>
        {
          errors?.map((error) => (
            <p key={error} className="text-red-500">{error}</p>
          ))
        }
      </div>
    </div>
  );
}