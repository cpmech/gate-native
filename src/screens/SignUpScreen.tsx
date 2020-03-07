import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withScrollView } from '@cpmech/rncomps';
import { GateStore } from '@cpmech/gate';
import { GateSignUpView } from '../components';
import { gate } from '../service';
import { colors, params } from '../styles';

const s = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: params.vpadding.large,
    paddingBottom: params.vpadding.normal,
    paddingLeft: params.hpadding.normal,
    paddingRight: params.hpadding.normal,
    backgroundColor: colors.orange,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: 500,
    maxWidth: 340,
  },
});

const Comp: React.FC = () => (
  <View style={s.root}>
    <View style={s.content}>
      <GateSignUpView gate={gate as GateStore} backgroundColor={colors.orange} />
    </View>
  </View>
);

export const SignUpScreen = withScrollView(Comp);
