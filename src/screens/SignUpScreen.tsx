import React from 'react';
import { View, StyleSheet } from 'react-native';
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
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: 400,
    maxWidth: 340,
    backgroundColor: 'red',
  },
});

export const SignUpScreen: React.FC = () => (
  <View style={s.root}>
    <View style={s.wrapper}>
      <View style={s.content}>
        <GateSignUpView
          gate={gate as GateStore}
          // colorButtonBg="#ffffff"
          // colorButtonFg={colors.orange}
          colorEye={colors.lightenOrange50pct}
          colorText="#ffffff"
          styleInput={{
            color: '#ffffff',
            bgColor: colors.orange,
            borderColor: colors.lightenOrange50pct,
            hlColor: '#ffffff',
            mutedColor: colors.lightenOrange50pct,
          }}
          styleButton={{
            color: colors.orange,
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
          }}
          styleLink={{
            color: 'yellow',
          }}
          buttonMinWidth={180}
        />
      </View>
    </View>
  </View>
);
