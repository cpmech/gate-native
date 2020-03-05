import React from 'react';
import { View, Text } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { withNTSV } from '@cpmech/rncomps';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

const Comp: React.FC<IProps> = ({ navigation }) => {
  return (
    <View>
      <Text>This is the Home Screen</Text>
    </View>
  );
};

export const HomeScreen = withNTSV(Comp, 'Home');
