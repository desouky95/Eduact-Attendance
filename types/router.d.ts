// Root
declare type RootStackParamList = {
  Login: {};
  HomeRoot: {};
  Downloading: {};
  Settings: {};
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
  Settings: {};
};

// Classroom Root

declare type ClassroomRootTabParamList = {
  ClassroomStack: {current: number};
  AttendanceStack: {};
  ReferenceStack: {};
};

declare type StudentsRootTabParamList = {
  Students: {};
  StudentHistory: {
    id: string;
  };
};

declare type ClassroomRootProps =
  import('@react-navigation/native').CompositeNavigationProp<
    import('@react-navigation/native-stack').NativeStackNavigationProp<
      HomeRootStackParamList,
      'ClassroomRoot'
    >,
    import('@react-navigation/bottom-tabs').BottomTabNavigationProp<ClassroomRootTabParamList>
  >;

declare type StudentHistoryProps =
  import('@react-navigation/native').CompositeNavigationProp<
    import('@react-navigation/native-stack').NativeStackNavigationProp<
      StudentsRootTabParamList,
      'StudentHistory'
    >,
    import('@react-navigation/bottom-tabs').BottomTabNavigationProp<ClassroomRootTabParamList>
  >;

declare type ClassroomScreenProps =
  import('@react-navigation/native-stack').NativeStackScreenProps<
    ClassroomRootTabParamList,
    'ClassroomStack'
  >;
declare type ClassroomScreenProp = RouteProp<
  ClassroomRootTabParamList,
  'ClassroomStack'
>;

declare type StudentHistoryScreenProp = RouteProp<
  StudentsRootTabParamList,
  'StudentHistory'
>;
