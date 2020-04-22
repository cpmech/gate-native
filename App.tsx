import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BaseSpinnerScreen } from '@cpmech/rncomps';
import { withUseGateObserver } from './src/components';
import { NavMain, NavSignUp } from './src/navigation';
import { colors } from './src/styles';
import { gate } from './src/service';

// TEMPORARY /////////////////////////////////////////////////////////////////////////////////
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: AsyncStorage has been extracted from react-native core']);
//////////////////////////////////////////////////////////////////////////////////////////////

export const App = () => {
  const useObserver = withUseGateObserver(gate);
  const { ready, hasAccess } = useObserver('gate-native/App');

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.orange} barStyle="light-content" />
      {ready ? (
        // AWS Amplify has been initialized/configured
        hasAccess ? (
          // user has signed-up/signed-in already
          <NavMain />
        ) : (
          // sign-up/sign-in needed
          <NavSignUp />
        )
      ) : (
        // still initializing...
        <BaseSpinnerScreen darkColor={colors.orange} />
      )}
    </NavigationContainer>
  );
};
