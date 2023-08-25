import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {getCourseAttendance} from 'src/database/data/attendance.data';
import CenterAttendanceModel from 'src/database/models/CenterAttendanceModel';

type UseCourseAttendanceAnalyticsArgs = {
  center_id: number | null;
  online_id: number | null;
  group_id: number | null;
};

export const useCourseAttendanceAnalytics = ({
  center_id,
  group_id,
  online_id,
}: UseCourseAttendanceAnalyticsArgs) => {
  const [data, setData] = useState<CenterAttendanceModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!center_id) {
        setData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const subscription = getCourseAttendance(
        center_id,
        online_id,
        group_id,
        null,
      ).subscribe(value => {
        setData(prev => value);
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [center_id, online_id, group_id]),
  );

  const center = useMemo(() => {
    return data.filter(_ => _.type === 'center').length;
  }, [data]);

  const online = useMemo(() => {
    return data.filter(_ => _.type === 'online').length;
  }, [data]);

  const absent = useMemo(() => {
    return data.filter(_ => _.type === 'absent').length;
  }, [data]);
  // }, [JSON.stringify(fromPairs(students as any))]);

  return {
    attendance: data,
    total: data.length,
    center,
    online,
    absent,
    isLoading,
  };
};
