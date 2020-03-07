import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignUpScreen } from '../screens';

const Stack = createStackNavigator();

export const NavSignUp: React.FC = () => (
  <Stack.Navigator initialRouteName="SignUp">
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);
