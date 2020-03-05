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
      <Text>This is the Options Screen</Text>
    </View>
  );
};

export const OptionsScreen = withNTSV(Comp, 'Options');
