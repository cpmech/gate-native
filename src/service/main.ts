import AsyncStorage from '@react-native-community/async-storage';
import { LocalGateStore, GateStore, IStorage, gateLocale, t } from '@cpmech/gate';

gateLocale.setLocale('pt');

export const isLocal = false;

const storage: IStorage = {
  getItem: async (key: string) => await AsyncStorage.getItem(`gatenative#${key}`),
  setItem: async (key: string, val: string) => await AsyncStorage.setItem(`gatenative#${key}`, val),
  removeItem: async (key: string) => await AsyncStorage.removeItem(`gatenative#${key}`),
};

export const gate = isLocal
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
