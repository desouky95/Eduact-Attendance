import {useLinkProps, useRoute, RouteProp} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';

export const ClassroomScreen = () => {
  const {params} = useRoute<ClassroomScreenProp>();

  console.log(params);

  return (
    <View style={{paddingHorizontal: 20}}>
      <Text>{params.classroom_id}</Text>
    </View>
  );
};
