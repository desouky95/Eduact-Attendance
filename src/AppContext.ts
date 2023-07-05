import { NavigationContainerRef } from "@react-navigation/native";

export const AppContext = {navigationRef: null} as {
  navigationRef: NavigationContainerRef<ReactNavigation.RootParamList> | null;
};
