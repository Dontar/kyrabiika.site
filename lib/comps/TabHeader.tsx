import { ReactNode } from "react";
import { Stack } from "react-bootstrap";

export interface TabHeaderProps {
  title: string;
  button?: ReactNode | [ReactNode];
}

export function TabHeader({ title, button = undefined }: TabHeaderProps) {

  return (
    <Stack direction="horizontal" gap={3}>
      <div className="flex-grow-1">
        <h4>{title}</h4>
        <hr />
      </div>
      {
        Array.isArray(button)
          ? button.map((element, i) => (
            <div key={i} className="flex-grow-0">
              {element}
            </div>
          ))
          : <div className="flex-grow-0">
            {button}
          </div>
      }
    </Stack>
  );
}
