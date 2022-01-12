import { ReactNode } from "react";
import { Stack } from "react-bootstrap";

export interface TabHeaderProps {
  title: string;
  button: ReactNode;
}

export function TabHeader({ title, button }: TabHeaderProps) {
  return (
    <Stack direction="horizontal" gap={3}>
      <div className="flex-grow-1">
        <h4>{title}</h4>
        <hr />
      </div>
      <div className="flex-grow-0">
        {button}
      </div>
    </Stack>
  );
}
