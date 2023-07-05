// Root
declare type RootStackParamList = {
  Login: {};
  HomeRoot: {};
};

declare type RootProps =
  import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>;

// Home
declare type HomeRootStackParamList = {
  Home: {};
  Classrooms: {};
  ClassroomRoot: {
    params: {};
    screen: keyof ClassroomRootTabParamList;
  };
  Students: {};
  Downloading: {};
};

// Classroom Root

declare type ClassroomRootTabParamList = {
  Classroom: {classroom_id: number};
  Attendance: {};
  Reference: {};
};

declare type ClassroomRootProps =
  import('@react-navigation/native').CompositeNavigationProp<
    import('@react-navigation/native-stack').NativeStackNavigationProp<
      HomeRootStackParamList,
      'ClassroomRoot'
    >,
    import('@react-navigation/bottom-tabs').BottomTabNavigationProp<ClassroomRootTabParamList>
  >;

declare type ClassroomScreenProp = RouteProp<
  ClassroomRootTabParamList,
  'Classroom'
>;
