import React from 'react';
import { params } from './gateStyles';
import { BaseSpacer } from '@cpmech/rncomps';

export const GateVSpace: React.FC = () => {
  return <BaseSpacer space={params.vspace.normal} />;
};
