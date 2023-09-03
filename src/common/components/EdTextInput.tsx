import {IInputProps, Input} from 'native-base';
import React, {useState} from 'react';
import {
  NativeSyntheticEvent,
  ScaledSize,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components/native';

type EdTextInputProps = IInputProps;
export const EdTextInput = ({
  onFocus,
  onBlur,
  px = '11px',
  py = '16px',
  padding = '11px 16px',
  ...props
}: EdTextInputProps) => {
  const [focused, setFocused] = useState(false);

  const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur?.(e);
  };

  const size = useWindowDimensions();

  return (
    <>
      <StyledEdTextInput
        {...props}
        borderColor={'#0000001F'}
        borderWidth={'1'}
        isFullWidth={false}
        _focus={{borderColor: '#5ac0fc', backgroundColor: 'none'}}
        _invalid={{borderWidth: '1'}}
        // _input={{w: '1/2', flex: 0}}
        // _input={{w: '1/2', flex: 0}}
        window={size}
        isFocused={focused}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        padding={padding}
        px={px}
        py={py}
      />
    </>
  );
};

const StyledEdTextInput = styled(Input)<{
  isFocused: boolean;
  window?: ScaledSize;
}>`
  border-radius: 4px;
  /* padding: 11px 16px; */
  min-width: 260px;
  min-width: ${p => (p.window ? `${p.window.width! * 0.32}px` : '260px')};
  color: #000;
`;
