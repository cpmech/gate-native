import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { BaseButton, withScrollView } from '@cpmech/rncomps';
import { View, Text } from 'react-native';
import { gate } from '../service';
import { colors } from '../styles';
import { useGateObserver } from '../components/useGateObserver';

interface IProps {
  navigation: StackNavigationProp<any, any>;
}

export const Comp: React.FC<IProps> = ({ navigation }) => {
  const { processing } = useGateObserver(gate, '@cpmech/gate-native/HomeScreen');
  return (
    <View style={{ backgroundColor: colors.orange }}>
      <Text style={{ fontSize: 20 }}>WELCOME</Text>
      <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 100 }}>
        You can now access this App
      </Text>
      <BaseButton spinning={processing} onPress={() => gate.signOut()} text="Sign out" />
    </View>
  );
};

export const HomeScreen = withScrollView(Comp);
