import React, { useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { LocalGateStore, ISignUpValues, ISignUpErrors, signUpValues2errors, t } from '@cpmech/gate';
import {
  IStyleButton,
  IStyleTypeA,
  IconKind,
  BaseButton,
  BaseIcon,
  BaseLink,
  FormErrorField,
  InputTypeA,
  defaultStyleTypeA,
} from '@cpmech/rncomps';
import { withUseGateObserver } from './withUseGateObserver';
import { IFonts } from './GateSignUpView';

const styles = StyleSheet.create({
  header: {
    flex: 1.2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputErrorContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLeft: {
    flex: 1,
  },
  buttonRight: {
    flex: 1.2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifications: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsText: {
    textAlign: 'center',
  },
  footnote: {
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface ILocalGateSignUpViewProps {
  gate: LocalGateStore;
  iniEmail?: string;

  marginTop?: number;
  colorIcon?: string;
  colorText?: string;
  colorLink?: string;
  colorError?: string;
  styleInput?: IStyleTypeA;
  styleButton?: IStyleButton;
  buttonHeight?: number;
  buttonBorderRadius?: number;
  buttonMinWidth?: number;
  iconKind?: IconKind;
  fonts?: IFonts;

  ignoreErrors?: boolean;
}

export const LocalGateSignUpView: React.FC<ILocalGateSignUpViewProps> = ({
  gate,
  iniEmail = '',

  marginTop = 30,
  colorIcon = defaultStyleTypeA.mutedColor,
  colorText = '#484848',
  colorLink = '#484848',
  colorError = 'red',
  styleInput,
  styleButton,
  buttonHeight = 45,
  buttonBorderRadius = 1000,
  buttonMinWidth,
  iconKind = 'line',
  fonts = {
    size: {
      message: 18,
      error: 18,
      header: 22,
      subHeader: 20,
      footnote: 16,
      smallFootnote: 14,
    },
  },

  ignoreErrors,
  //
}) => {
  //
  const useObserver = withUseGateObserver(gate);
  const { error, processing } = useObserver('@cpmech/gate-native/LocalGateSignUpView');

  const [isSignIn, setIsSignIn] = useState(false);
  const [isClearStorage, setIsClearStorage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({ email: iniEmail, password: '', code: '' });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

  const clearNotifications = () => {
    !!error && gate.notify({ error: '' });
    setTouchedButtons(false);
    setVerrors({ email: '', password: '', code: '' });
  };

  const validate = (ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean }): boolean => {
    if (ignoreErrors) {
      return true;
    }
    const res = signUpValues2errors(values, ignore);
    setVerrors(res.errors);
    return !res.hasError;
  };

  const submit = async () => {
    setTouchedButtons(true);

    // remove account
    if (isClearStorage) {
      await gate.clearStorage();
      setValues({ email: '', password: '', code: '' });
      clearNotifications();
      setIsClearStorage(false);
      return;
    }

    // signIn
    if (isSignIn) {
      if (!validate({ code: true })) {
        return;
      }
      await gate.signIn(values.email, values.password);
      return;
    }

    // signUp
    if (!validate({ code: true })) {
      return;
    }
    await gate.signUp(values.email, values.password);
  };

  const setValue = <K extends keyof ISignUpValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value.trim() };
    setValues(newValues);
    if (touchedButtons && !ignoreErrors) {
      const res = signUpValues2errors(newValues);
      setVerrors({ ...vErrors, [key]: (res as any)[key] });
    }
  };

  const iconSize = styleInput?.fontSize || defaultStyleTypeA.fontSize;

  const renderPasswordIcon = (
    <TouchableHighlight
      disabled={processing}
      onPress={() => setShowPassword(!showPassword)}
      underlayColor="transparent"
    >
      {showPassword ? (
        <BaseIcon name="eye-off" kind={iconKind} size={iconSize} color={colorIcon} />
      ) : (
        <BaseIcon name="eye" kind={iconKind} size={iconSize} color={colorIcon} />
      )}
    </TouchableHighlight>
  );

  const txtError = {
    fontFamily: fonts?.familiy?.error,
    fontSize: fonts?.size?.error,
    color: colorError,
  };
  const txtHeader = {
    fontFamily: fonts?.familiy?.header,
    fontSize: fonts?.size?.header,
    color: colorText,
  };
  const txtFootnote = {
    fontFamily: fonts?.familiy?.footnote,
    fontSize: fonts?.size?.footnote,
    color: colorText,
  };
  const linkFootnote = {
    color: colorLink,
    fontSize: fonts?.size?.footnote,
    fontFamily: fonts?.familiy?.link,
  };
  const linkSmallFootnote = {
    color: colorLink,
    fontSize: fonts?.size?.smallFootnote,
    fontFamily: fonts?.familiy?.link,
  };

  return (
    <React.Fragment>
      <View style={{ marginTop }} />

      {/* --------------------- header -- normal -------------------- */}
      <View style={styles.header}>
        <Text style={txtHeader}>{isSignIn ? t('signIn') : t('createAccount')}</Text>
      </View>

      {/* ----------------------- input email ------------------------ */}
      <View style={styles.inputContainer}>
        <InputTypeA
          disabled={processing}
          label="Email"
          value={values.email}
          onChangeText={(v) => setValue('email', v)}
          error={vErrors.email}
          autoCompleteType="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          {...styleInput}
        />
      </View>
      <View style={styles.inputErrorContainer}>
        <FormErrorField error={vErrors.email} color={colorError} />
      </View>

      {/* --------------------- input password ----------------------- */}
      <View style={styles.inputContainer}>
        <InputTypeA
          disabled={processing}
          label={t('password')}
          value={values.password}
          suffix={renderPasswordIcon}
          onChangeText={(v) => setValue('password', v)}
          error={vErrors.password}
          autoCorrect={false}
          textContentType="password"
          secureTextEntry={!showPassword}
          {...styleInput}
        />
      </View>
      <View style={styles.inputErrorContainer}>
        <FormErrorField error={vErrors.password} color={colorError} />
      </View>

      {/* ----------------------- control ---------------------- */}
      <View style={styles.controlContainer}>
        {/* --------- go back and button ---------  */}
        <View style={styles.buttonContainer}>
          {/* ....... footnote: signIn or signUp ....... */}
          <View style={styles.buttonLeft}>
            <View style={styles.leftContainer}>
              <Text style={txtFootnote}>{isSignIn ? t('noAccount') : t('haveAnAccount')}</Text>
              <BaseLink
                disabled={processing}
                text={isSignIn ? t('signUp') : t('gotoSignIn')}
                onPress={() => {
                  clearNotifications();
                  setIsSignIn(!isSignIn);
                }}
                {...linkFootnote}
              />
            </View>
          </View>

          {/* ....... submit ....... */}
          <View style={{ ...styles.buttonRight, minWidth: buttonMinWidth }}>
            <BaseButton
              spinning={processing}
              onPress={async () => await submit()}
              borderRadius={buttonBorderRadius}
              height={buttonHeight}
              text={isSignIn ? t('enter').toUpperCase() : t('signUp').toUpperCase()}
              {...styleButton}
            />
          </View>
        </View>

        {/* ....... notifications ....... */}
        <View style={styles.notifications}>
          {!!error && <Text style={[styles.notificationsText, txtError]}>{error}</Text>}
        </View>
      </View>

      {/* ----------------- footnote: clear local storage ---------------- */}
      <View style={styles.footnote}>
        <BaseLink
          disabled={processing}
          text={t('clearLocalStorage')}
          onPress={() => {
            clearNotifications();
            setIsClearStorage(true);
          }}
          {...linkSmallFootnote}
        />
      </View>
    </React.Fragment>
  );
};
