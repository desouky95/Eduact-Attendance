import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeHeader} from 'src/layout/headers/HomeHeader';
import {StudentHistoryScreen} from 'src/screens/StudentHistoryScreen/StudentHistoryScreen';
import {StudentsScreen} from 'src/screens/StudentsScreen/StudentsScreen';

const Stack = createNativeStackNavigator<StudentsRootTabParamList>();

export const StudentsRoot = () => {
  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerShown: true,
        header: props => <HomeHeader {...props} />,
      })}
      // tabBar={props => <TabBar {...props} />}

      initialRouteName="Students">
      <Stack.Screen name="Students" component={StudentsScreen} />
      <Stack.Screen name="StudentHistory" component={StudentHistoryScreen} />
    </Stack.Navigator>
  );
};
