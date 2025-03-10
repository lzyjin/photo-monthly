import {CalendarDaysIcon} from "@heroicons/react/24/solid";
import React, {forwardRef} from "react";

interface InputProps {
  errors?: string[];
  value?: string;
  onClick?(e: React.MouseEvent<SVGSVGElement | HTMLInputElement>): void;
}

export const DatepickerInput = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onClick, errors }, ref) => {
    return (
      <div className="flex flex-col gap-3 w-full pointer-events-none">
        <label htmlFor="date" className="text-sm">날짜</label>
        <div className="border border-foreground overflow-hidden relative">
          <input
            name="date"
            id="date"
            type="text"
            className="block w-full p-3 text-sm pointer-events-auto"
            ref={ref}
            onClick={(e) => onClick?.(e)}
            value={value}
            autoComplete="off"
            readOnly
            required
          />

          <CalendarDaysIcon
            onClick={(e) => onClick?.(e)}
            className="size-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto"
          />
        </div>
        {
          errors && (
            <div>
              {
                errors?.map((error) => (
                  <p key={error} className="text-[#ff0000] text-xs">{error}</p>
                ))
              }
            </div>
          )
        }
      </div>
    );
  }
);

DatepickerInput.displayName = "DatepickerInput";