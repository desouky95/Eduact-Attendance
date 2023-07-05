import {BottomTabHeaderProps} from '@react-navigation/bottom-tabs';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {logo} from 'assets/index';
import React from 'react';
import {BackHandler, Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const HomeHeader = ({
  back,
  navigation,
  route,
}: NativeStackHeaderProps) => {
  return (
    <View
      style={{
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        elevation: 4,
        shadowColor: '#000',
        // paddingVertical : 20,
      }}>
      <View style={{minWidth: 40, alignItems: 'center'}}>
        {back && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.5}>
            <Icon name="chevron-left" size={22} color={'#5AC0FC'} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          height: 30,
          alignItems: 'center',
          overflow: 'scroll',
        }}>
        <Image resizeMode="contain" style={{height: '100%'}} source={logo} />
      </View>

      <View style={{minWidth: 40, alignItems: 'center'}}>
        <Icon name="sync" size={22} color={'#5AC0FC'} />
      </View>
    </View>
  );
};
