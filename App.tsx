import React from 'react';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';

export const App = () => {
  return (
    <React.Fragment>
      <StatusBar barStyle="default" />
      <AppNavigator />
    </React.Fragment>
  );
};
