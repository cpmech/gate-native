import React from 'react';
import { withScrollView } from '@cpmech/rncomps';
import { GateStore } from '@cpmech/gate';
import { GateSignUpView } from '../components';
import { gate } from '../service';

const Comp: React.FC = () => {
  return <GateSignUpView gate={gate as GateStore} />;
};

export const SignUpScreen = withScrollView(Comp);
