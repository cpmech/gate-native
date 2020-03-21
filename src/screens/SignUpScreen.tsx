import React from 'react';
import { FontWeight, withScrollKeysAware } from '@cpmech/rncomps';
import { GateStore, LocalGateStore } from '@cpmech/gate';
import { GateSignUpView, LocalGateSignUpView, IFonts } from '../components';
import { gate, isLocal } from '../service';
import { colors, params } from '../styles';

const props = {
  colorIcon: colors.lightenOrange50pct,
  colorText: '#ffffff',
  colorLink: 'yellow',
  colorError: '#ff1919',
  styleInput: {
    color: '#ffffff',
    bgColor: colors.orange,
    borderColor: colors.lightenOrange50pct,
    hlColor: '#ffffff',
    mutedColor: colors.lightenOrange50pct,
    errorColor: '#ff1919',
  },
  styleButton: {
    color: colors.orange,
    backgroundColor: '#ffffff',
    fontWeight: 'bold' as FontWeight,
    fontSize: 16,
  },
};

const Comp: React.FC = () => {
  if (isLocal) {
    return <LocalGateSignUpView gate={gate as LocalGateStore} ignoreErrors={true} {...props} />;
  }
  return <GateSignUpView gate={gate as GateStore} {...props} />;
};

export const SignUpScreen = withScrollKeysAware(Comp, {
  contentMaxHeight: 540,
  contentMaxWidth: 340,
  paddingTop: params.vpadding.normal,
  paddingHoriz: params.hpadding.normal,
  backgroundColor: colors.orange,
});
