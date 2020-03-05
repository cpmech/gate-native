import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { withNTSV, Popup, BaseButton } from '@cpmech/rncomps';
import { GateSignUpView, useGateObserver } from '../components';
import { LocalGateStore, GateStore, IStorage, gateLocale, t } from '@cpmech/gate';
import { View, Text } from 'react-native';

gateLocale.setLocale('pt');

const isLocal = false;

const storage: IStorage = {
  getItem: async (key: string) => await AsyncStorage.getItem(`gatenative#${key}`),
  setItem: async (key: string, val: string) => await AsyncStorage.setItem(`gatenative#${key}`, val),
  removeItem: async (key: string) => await AsyncStorage.removeItem(`gatenative#${key}`),
};

const gate = isLocal
  ? new LocalGateStore('@cpmech/gate', storage)
  : new GateStore(
      {
        userPoolId: 'us-east-1_dCZGZU74z',
        userPoolWebClientId: '5cdculovevq2kqdhj5forn2288',
        oauthDomain: 'azcdk.auth.us-east-1.amazoncognito.com',
        redirectSignIn: 'https://localhost:3000/',
        redirectSignOut: 'https://localhost:3000/',
        awsRegion: 'us-east-1',
      },
      // ['testers'],
    );

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

const Comp: React.FC<IProps> = ({ navigation }) => {
  const { ready, hasAccess } = useGateObserver(gate, '@cpmech/gate-native/Home');

  const renderSignUpForm = () => {
    if (isLocal) {
      return null;
    }
    return <GateSignUpView gate={gate as GateStore} />;
  };

  return (
    <React.Fragment>
      <Popup
        visible={!ready}
        title={t('initializing')}
        isLoading={true}
        colorSpinner="#ea8a2e"
        colorTitleLoading="#ea8a2e"
      />
      {!hasAccess && renderSignUpForm()}
      {ready && hasAccess && (
        <View>
          <Text style={{ fontSize: 20 }}>WELCOME</Text>
          <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 100 }}>
            You can now access this App
          </Text>
          <BaseButton onPress={() => gate.signOut()} text="Sign out" />
        </View>
      )}
    </React.Fragment>
  );
};

export const HomeScreen = withNTSV(Comp, {
  title: 'Home',
  backgroundColor: '#ffffff',
});
