import {Button, IButtonProps, useTheme} from 'native-base';
import React, {PropsWithChildren} from 'react';

import {ButtonProps, StyleSheet, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

export const EdButton = ({
  children,
  onPress,
  bgColor = 'primary.main',
  ...props
}: IButtonProps) => {
  return (
    <StyledButton {...props} bgColor={bgColor} onPress={onPress}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  border-radius: 25px;
  min-width: 136px;
  min-width: 33%;
  padding: 11px 0;
  background-color: #5ac0fc;
  elevation: 4;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  align-self: center;
`;
