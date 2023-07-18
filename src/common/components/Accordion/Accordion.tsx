import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {AccordionSummary} from './AccordionSummary';
import {LayoutChangeEvent, View, Animated, LayoutAnimation} from 'react-native';
import {AccordionProvider} from './AccordionProvider';
import {Typography} from 'components/Typography/Typography';

type AccordionProps = {
  disabled?: boolean;
};

export const Accordion = ({
  children,
  disabled = false,
}: PropsWithChildren<AccordionProps>) => {
  const [summary, ...otherChildren] = React.Children.toArray(
    children,
  ) as ReactElement[];

  const [expanded, setExpanded] = useState(false);
  if (summary.type !== AccordionSummary) {
    throw new Error('No Accordion Summary found !!!');
  }

  const defaultAnimation = {
    duration: 200,
    create: {
      duration: 200,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  };
  return (
    <AccordionProvider
      disabled={disabled}
      expanded={expanded}
      setExpanded={(value: boolean) => {
        setExpanded(value);
        LayoutAnimation.configureNext(defaultAnimation);
      }}>
      <View style={{marginVertical: 12, paddingHorizontal: 2}}>
        <View
          pointerEvents={disabled ? 'none' : 'auto'}
          // style={{opacity: disabled ? 0.5 : 1}}
        >
          {summary}
        </View>
        <Animated.View style={{}}>
          {expanded && <View>{otherChildren}</View>}
        </Animated.View>
      </View>
    </AccordionProvider>
  );
};
