// Root
declare type RootStackParamList = {
  Login: {};
  HomeRoot: {};
  Downloading: {};
};

declare type RootProps =
  import('@react-navigation/native-stack').NativeStackNavigationProp<RootStackParamList>;

// Home
declare type HomeRootStackParamList = {
  Home: {};
  Classrooms: {};
  ClassroomRoot: {
    params: {
      current: number;
    };
    screen: keyof ClassroomRootTabParamList;
  };
  StudentsRoot: {};
};

// Classroom Root

declare type ClassroomRootTabParamList = {
  Classroom: {current: number};
  Attendance: {};
  Reference: {};
};

declare type StudentsRootTabParamList = {
  Students: {};
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
