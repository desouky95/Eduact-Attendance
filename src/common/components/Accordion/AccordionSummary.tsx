import React, {PropsWithChildren} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAccordion} from './AccordionProvider';

export const AccordionSummary = ({children}: PropsWithChildren) => {
  const {setExpanded, expanded} = useAccordion();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setExpanded(!expanded)}
      style={{
        backgroundColor: '#FFF',
        padding: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View style={{flex: 1, width: '100%'}}>{children}</View>
      <Icon
        style={{transform: expanded ? [{rotate: '180deg'}] : []}}
        size={25}
        color={'#5AC0FC'}
        name="keyboard-arrow-down"
      />
    </TouchableOpacity>
  );
};
