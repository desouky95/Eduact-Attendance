import React, {useEffect, useState, useMemo} from 'react';
import {getCourseAttendance} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';

import {database} from 'src/database';
import {useFocusEffect} from '@react-navigation/native';
import {jsonReplacer} from 'src/utils/jsonReplacer';

type UseCourseAttendanceArgs = {
  center_id: number | null;
  online_id: number | null;
  group_id: number | null;
  type: string | null;
};

export const useCourseAttendance = ({
  center_id,
  group_id,
  online_id,
  type,
}: UseCourseAttendanceArgs) => {
  const [data, setData] = useState<CenterAttendanceModel[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!center_id) {
        setData([]);
        return;
      }
      setIsLoading(true);
      const subscription = getCourseAttendance(
        center_id,
        online_id,
        group_id,
        type,
      ).subscribe(value => {
        setData(value);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    }, [center_id, online_id, group_id, type]),
  );

  return {
    attendance: data,
    total: data.length,
    isLoading,
  };
};
