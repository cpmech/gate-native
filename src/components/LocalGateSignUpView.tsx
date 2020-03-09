import React, { useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { ISignUpValues, ISignUpErrors, signUpValues2errors, t, LocalGateStore } from '@cpmech/gate';
import {
  IStyleButton,
  IStyleTypeA,
  BaseButton,
  BaseIcon,
  BaseLink,
  FormErrorField,
  InputTypeA,
  Popup,
  defaultStyleTypeA,
  IStyleLink,
} from '@cpmech/rncomps';
import { useGateObserver } from './useGateObserver';
import { fonts, params } from './gateStyles';

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
  },
  footnotes: {
    flex: 0.7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footnote: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footnoteLeft: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLeft: {
    flex: 1,
  },
  buttonRight: {
    flex: 1.2,
  },
  wantToConfirm: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface ILocalGateSignUpViewProps {
  gate: LocalGateStore;
  iniEmail?: string;
  colorText?: string;
  colorTitleLoading?: string;
  colorSpinner?: string;
  colorEye?: string;
  colorEyeHover?: string;
  colorError?: string;
  styleInput?: IStyleTypeA;
  styleButton?: IStyleButton;
  styleLink?: IStyleLink;
  buttonMinWidth?: number;

  ignoreErrors?: boolean;
}

export const LocalGateSignUpView: React.FC<ILocalGateSignUpViewProps> = ({
  gate,
  iniEmail = '',
  colorText = '#484848',
  colorTitleLoading = '#236cd2',
  colorSpinner = '#236cd2',
  colorEye = defaultStyleTypeA.mutedColor,
  colorEyeHover = '#efefef',
  colorError,
  styleInput,
  styleButton,
  styleLink,
  buttonMinWidth,

  ignoreErrors,
}) => {
  const { error, processing } = useGateObserver(gate, '@cpmech/gate-native/GateSignUpView');

  const [isSignIn, setIsSignIn] = useState(false);
  const [isClearStorage, setIsClearStorage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({ email: iniEmail, password: '', code: '' });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

  const clearErrors = () => {
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
      clearErrors();
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

  const renderPasswordIcon = (
    <TouchableHighlight
      onPress={() => setShowPassword(!showPassword)}
      underlayColor={colorEyeHover}
    >
      {showPassword ? (
        <BaseIcon name="eye-off" size={20} color={colorEye} />
      ) : (
        <BaseIcon name="eye" size={20} color={colorEye} />
      )}
    </TouchableHighlight>
  );

  const txtHeader = { fontSize: fonts.header, color: colorText };
  const txtFootnote = { fontSize: fonts.footnote, color: colorText };

  return (
    <React.Fragment>
      {/* --------------------- header -- normal -------------------- */}
      <View style={styles.header}>
        <Text style={txtHeader}>
          {isClearStorage ? t('clearLocalStorage') : isSignIn ? t('signIn') : t('createAccount')}
        </Text>
      </View>

      {/* ----------------------- input email ------------------------ */}
      {!isClearStorage && (
        <View style={styles.inputContainer}>
          <InputTypeA
            label="Email"
            value={values.email}
            onChangeText={v => setValue('email', v)}
            error={vErrors.email}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            {...styleInput}
          />
          <FormErrorField error={vErrors.email} color={colorError} />
        </View>
      )}

      {/* --------------------- input password ----------------------- */}
      {!isClearStorage && (
        <View style={styles.inputContainer}>
          <InputTypeA
            label={t('password')}
            value={values.password}
            suffix={renderPasswordIcon}
            onChangeText={v => setValue('password', v)}
            error={vErrors.password}
            autoCorrect={false}
            textContentType="password"
            secureTextEntry={!showPassword}
            {...styleInput}
          />
          <FormErrorField error={vErrors.password} color={colorError} />
        </View>
      )}

      {/* ----------------------- submit button ---------------------- */}
      <View style={styles.buttonContainer}>
        {/* ....... footnote: go back ....... */}
        {isClearStorage && (
          <View style={styles.buttonLeft}>
            <View style={styles.footnoteLeft}>
              <BaseLink
                onPress={() => {
                  clearErrors();
                  setIsClearStorage(false);
                }}
                message={t('back')}
                fontSize={fonts.button}
                {...styleLink}
              />
            </View>
          </View>
        )}

        {/* ....... footnote: signIn or signUp ....... */}
        {!isClearStorage && (
          <View style={styles.buttonLeft}>
            <View style={styles.footnoteLeft}>
              <Text style={txtFootnote}>
                {isSignIn ? t('noAccount') : t('haveAnAccount')}&nbsp;
              </Text>
              <BaseLink
                onPress={() => {
                  clearErrors();
                  setIsSignIn(!isSignIn);
                }}
                message={isSignIn ? t('signUp') : t('gotoSignIn')}
                fontSize={fonts.footnote}
                {...styleLink}
              />
            </View>
          </View>
        )}

        {/* ....... submit ....... */}
        <View style={{ ...styles.buttonRight, minWidth: buttonMinWidth }}>
          <BaseButton
            onPress={async () => await submit()}
            borderRadius={300}
            fontSize={fonts.button}
            height={params.buttonHeight}
            text={
              isClearStorage
                ? t('clear')
                : isSignIn
                ? t('enter').toUpperCase()
                : t('signUp').toUpperCase()
            }
            {...styleButton}
          />
        </View>
      </View>

      <View style={styles.footnotes}>
        {/* ----------------- footnote: remove account ----------------- */}
        <View style={styles.footnote}>
          <BaseLink
            onPress={() => {
              clearErrors();
              setIsClearStorage(true);
            }}
            message={t('clearLocalStorage')}
            fontSize={fonts.smallFootnote}
            {...styleLink}
          />
        </View>
      </View>

      <Popup
        visible={processing}
        title={t('loading')}
        isLoading={true}
        colorTitleLoading={colorTitleLoading}
        colorSpinner={colorSpinner}
      />

      <Popup
        visible={!!error}
        title={t('error')}
        onClose={() => gate.notify({ error: '' })}
        isError={true}
        message={error}
      />
    </React.Fragment>
  );
};
