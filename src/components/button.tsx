"use client";

import {useFormStatus} from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({text}: ButtonProps) {
  const status = useFormStatus();

  return (
    <button className="btn">{status.pending ? "진행중..." : text}</button>
  );
}