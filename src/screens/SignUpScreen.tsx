import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GateStore } from '@cpmech/gate';
import { GateSignUpView } from '../components';
import { gate } from '../service';
import { colors, params } from '../styles';
import { ScrollView } from 'react-native-gesture-handler';

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
    // justifyContent: 'center',
    // justifyContent: 'flex-end',
    minHeight: 800,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxHeight: 500,
    maxWidth: 340,
  },
});

export const SignUpScreen: React.FC = () => (
  <KeyboardAwareScrollView>
    <ScrollView>
      <View style={s.root}>
        <View style={s.wrapper}>
          <View style={s.content}>
            <GateSignUpView
              gate={gate as GateStore}
              // colorButtonBg="#ffffff"
              // colorButtonFg={colors.orange}
              colorEye={colors.lightenOrange50pct}
              colorText="#ffffff"
              colorError="#ff1919"
              styleInput={{
                color: '#ffffff',
                bgColor: colors.orange,
                borderColor: colors.lightenOrange50pct,
                hlColor: '#ffffff',
                mutedColor: colors.lightenOrange50pct,
                errorColor: '#ff1919',
              }}
              styleButton={{
                color: colors.orange,
                backgroundColor: '#ffffff',
                fontWeight: 'bold',
              }}
              styleLink={{
                color: 'yellow',
                darkBackground: true,
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  </KeyboardAwareScrollView>
);
