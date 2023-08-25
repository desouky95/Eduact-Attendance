import {useNavigation} from '@react-navigation/native';
import {EdButton} from 'components/EdButton/EdButton';
import {EdTextInput} from 'components/EdTextInput';
import {Spacer} from 'components/Spacer/Spacer';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Image, StyleSheet, View} from 'react-native';
import {object, string} from 'yup';
import {login} from 'src/api/auth/auth.api';
import {store, useAppDispatch} from 'src/store';
import {addUser} from 'src/store/authReducer/authReducer';
import {LoginSchema} from './login.schema';
import {Button, FormControl} from 'native-base';
import {api} from 'src/api/api';
import {useSnackbar} from 'src/hooks/useSnackbar';
import {isAxiosError} from 'axios';

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    paddingHorizontal: 30,
    paddingVertical: 30,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});

export const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AuthPayload>({
    defaultValues: {},
    mode: 'all',
    resolver: yupResolver(LoginSchema),
  });

  const dispatch = useAppDispatch();
  const {openSnackbar} = useSnackbar();

  const handle = handleSubmit(
    async formData => {
      try {
        
        const {data} = await login(formData);

        dispatch(addUser(data.data));
      } catch (error) {
        if (isAxiosError(error)) {
          console.error('error', error);
          if (error.code === 'ERR_NETWORK')
            openSnackbar({
              variant: 'error',
              message: 'No Internet Connection',
            });
          else
            openSnackbar({
              variant: 'error',
              message: error?.response?.data['message'],
            });
        }
      }
    },
    e => {
      console.log(e);
      throw new Error(e);
    },
  );


  return (
    <View style={Styles.container}>
      <Image source={require('assets/full-logo.png')} />
      <Spacer marginBottom={53} />
      <Controller
        control={control}
        name="identifier"
        render={({field: {value, onChange}}) => {
          return (
            <FormControl
              // minWidth={'200px'}
              isInvalid={!!errors.identifier}
              flex={0}
              // w="xs"
            >
              <EdTextInput
                placeholder="Username or email"
                inputMode="email"
                value={value}
                autoCorrect
                onChangeText={text => onChange(text)}
                isInvalid={!!errors.identifier}
              />
              <FormControl.ErrorMessage>
                {errors.identifier?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          );
        }}
      />
      <Spacer marginBottom={5} />
      <Controller
        control={control}
        name="password"
        render={({field: {value, onChange}}) => (
          <FormControl
            isInvalid={!!errors.password}
            flex={0}
            // w="xs"
          >
            <EdTextInput
              placeholder="Password"
              secureTextEntry
              autoComplete="password"
              value={value}
              onChangeText={text => onChange(text)}
            />
            <FormControl.ErrorMessage>
              {errors.password?.message}
            </FormControl.ErrorMessage>
          </FormControl>
        )}
      />
      <Spacer marginBottom={43} />
      <EdButton _pressed={{opacity: 0.8}} onPress={handle}>
        Login
      </EdButton>
    </View>
  );
};
