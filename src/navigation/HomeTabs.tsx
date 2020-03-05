import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { BaseIcon } from '@cpmech/rncomps';
import { AboutScreen } from '../screens/AboutScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { OptionsScreen } from '../screens/OptionsScreen';

const tabIcon = (name: string) => ({ focused }) => (
  <BaseIcon name={name} size={26} color={focused ? '#2f95dc' : '#ccc'} />
);

// HomeStack /////////////////////////////////////////////////////////////////

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: tabIcon('home'),
};

// AboutStack ////////////////////////////////////////////////////////////////

const AboutStack = createStackNavigator({
  About: AboutScreen,
});

AboutStack.navigationOptions = {
  tabBarLabel: 'About',
  tabBarIcon: tabIcon('information-circle-outline'),
};

// OptionsStack //////////////////////////////////////////////////////////////

const OptionsStack = createStackNavigator({
  Options: OptionsScreen,
});

OptionsStack.navigationOptions = {
  tabBarLabel: 'Options',
  tabBarIcon: tabIcon('options'),
};

// HomeTabs //////////////////////////////////////////////////////////////////

export const HomeTabs = createBottomTabNavigator({
  AboutStack,
  HomeStack,
  OptionsStack,
});

(HomeTabs as any).navigationOptions = {
  header: null,
};
