import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
    // maxHeight: 500,
    // maxWidth: 340,
  },
});

export const SignUpScreen: React.FC = () => (
  <ScrollView style={{ backgroundColor: colors.orange }}>
    <View style={s.root}>
      <View style={s.content}>
        <GateSignUpView
          gate={gate as GateStore}
          // colorButtonBg="#ffffff"
          // colorButtonFg={colors.orange}
          colorEye="#e5e5e5"
          colorText="#ffffff"
          styleInput={{
            color: '#ffffff',
            bgColor: colors.orange,
            borderColor: colors.lightenOrange50pct,
            hlColor: '#ffffff',
            mutedColor: '#e5e5e5',
          }}
          styleButton={{
            color: colors.orange,
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
          }}
          styleLink={{
            color: 'yellow',
          }}
        />
      </View>
    </View>
  </ScrollView>
);
