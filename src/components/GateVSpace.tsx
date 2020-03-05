import React from 'react';
import { params } from './gateStyles';
import { View } from 'react-native';

export const GateVSpace: React.FC = () => {
  return <View style={{ height: params.vspace.normal }}></View>;
};
