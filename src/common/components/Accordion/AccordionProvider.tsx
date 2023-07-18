import React, {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
} from 'react';

type AccordionContextArgs = {
  expanded: boolean;
  setExpanded: Dispatch<boolean>;
  disabled?: boolean;
};

const AccordionContext = createContext<AccordionContextArgs | null>(null);

export const AccordionProvider = ({
  children,
  ...props
}: PropsWithChildren<AccordionContextArgs>) => (
  <AccordionContext.Provider value={props}>
    {children}
  </AccordionContext.Provider>
);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('No Accordion Provider found');
  return context;
};
