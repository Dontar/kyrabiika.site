import { useState, createContext, useCallback, PropsWithChildren, ReactNode } from 'react';

type message = {
  variant: string;
  text: string;
}

type messageContext = {
  message: message | null;
  writeMessage: (variant: string, text: string) => void;
  closeMessage: () => void;
}

export const APIMessageContext = createContext<messageContext>({} as unknown as messageContext);


function useMessage(): messageContext {
  const [message, setMessage] = useState<message | null>(null);

  const writeMessage = (variant: string, text: string) => {
    setMessage({
      variant: variant,
      text: text,
    });
  };

  const closeMessage = () => {
    setMessage(null);
  };

  return ({
    message,
    writeMessage: useCallback((variant: string, text: string) => writeMessage(variant, text), []),
    closeMessage: useCallback(() => closeMessage(), [])
  });
}

export function APIMessageProvider({ children }: PropsWithChildren<ReactNode>) {
  const contextValue = useMessage();
  return (
    <APIMessageContext.Provider value={contextValue}>
      {children}
    </APIMessageContext.Provider>
  );
}

