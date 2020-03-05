import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Starter } from './Starter';
import { HomeTabs } from './HomeTabs';

const MainStack = createStackNavigator({
  Home: HomeTabs,
});

export const AppNavigator = createAppContainer(
  createSwitchNavigator(
    {
      Starter,
      Main: MainStack,
    },
    {
      initialRouteName: 'Starter',
    },
  ),
);
