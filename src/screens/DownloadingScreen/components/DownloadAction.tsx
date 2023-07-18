import {Spacer} from 'components/Spacer/Spacer';
import {Typography} from 'components/Typography/Typography';
import {Flex, Progress} from 'native-base';
import React, {useEffect, useState} from 'react';
import {WithProgressArgs} from 'src/api/api';
import {useAppDispatch} from 'src/store';
import {completeStep} from 'src/store/databaseSetupReducer/databaseSetupReducer';

type Props = {
  onFinishAction: () => void;
  action: [string, (args?: WithProgressArgs) => Promise<any>];
};
export const DownloadAction = ({
  action: [key, action],
  onFinishAction,
}: Props) => {
  const [value, setValue] = useState(0);
  const [current, setCurrent] = useState('');
  const [total, setTotal] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    action({
      onDownloadProgress(event) {
        // const total =
        // event.event.target.responseHeaders['content-length']; // total
        const total = event.total ?? 1;
        // const current = event.event.target.response.length;
        const current = event.loaded;
        let percentCompleted = Math.floor(event.progress! * 100);
        const totalInMb = (total / (1024 * 1024)).toFixed(2);
        const currentInMb = (total / (1024 * 1024)).toFixed(2);
        setValue(percentCompleted);
        setTotal(totalInMb);
        setCurrent(currentInMb);
      },
    }).then(() => {
      dispatch(completeStep(key as any));
      onFinishAction();
    });
  }, [action]);

  return (
    <Flex my="10" alignItems="flex-end">
      <Progress w="200" value={value} max={100} colorScheme="error" />
      <Spacer mb="2" />
      <Typography fontWeight={'bold'}>
        {current} mb of {total} mb
      </Typography>
    </Flex>
  );
};
