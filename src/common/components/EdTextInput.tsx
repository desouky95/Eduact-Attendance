import {IInputProps, Input} from 'native-base';
import React, {useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import styled from 'styled-components/native';

type EdTextInputProps = IInputProps;
export const EdTextInput = ({onFocus, onBlur, ...props}: EdTextInputProps) => {
  const [focused, setFocused] = useState(false);

  const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <>
      <StyledEdTextInput
        {...props}
        borderColor={'#0000001F'}
        borderWidth={'1'}
        isFullWidth={false}
        _focus={{borderColor: '#5ac0fc', backgroundColor: 'none'}}
        _invalid={{borderWidth: '1'}}
        _input={{w: '1/2', flex: 0}}
        isFocused={focused}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
    </>
  );
};

const StyledEdTextInput = styled(Input)<{isFocused: boolean}>`
  border-radius: 4px;
  padding: 11px 16px;
  min-width: 260px;
  color: #000;
`;
