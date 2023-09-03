import {CourseHeader} from 'components/CourseHeader/CourseHeader';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useClassroomDropdown} from 'src/hooks/useClassroomDropdown';
import {useAppSelector} from 'src/store';
import {OfflineOptions} from './components/OfflineOptions';
import {OnlineOptions} from './components/OnlineOptions';
import {createReference, getReference} from 'src/database/data/reference.data';
import CourseReferenceModel from 'src/database/models/CourseReferenceModel';
import {useObservableState} from 'observable-hooks';
import {first, lastValueFrom, mergeMap, of} from 'rxjs';
import {bind, state, useStateObservable} from '@react-rxjs/core';
import {useObservable} from 'src/hooks/useObservable';
import {ReferenceForm} from './components/ReferenceForm';

export const ReferenceScreen = () => {
  const {current} = useAppSelector(s => s.course);

  const data = useObservable(getReference(current?.sid).observable);

  useEffect(() => {
    if (data || !current) return;
    createReference(current.sid);
  }, [data]);

  return (
    <View
      style={{
        //   paddingHorizontal: 20,
        flex: 1,
        width: '100%',
        // backgroundColor: 'red',
      }}>
      {data && <ReferenceForm reference={data} />}
    </View>
  );
};
