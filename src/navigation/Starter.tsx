import React, { useEffect } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { BaseSpinnerScreen } from '@cpmech/rncomps';

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

export const Starter: React.FC<IProps> = ({ navigation }) => {
  useEffect(() => {
    const to = setTimeout(() => navigation.navigate('Main'), 100);
    return function cleanup() {
      clearTimeout(to);
    };
  }, []);

  return <BaseSpinnerScreen darkBackground={false} />;
};
