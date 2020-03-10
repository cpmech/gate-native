import React, { useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { GateStore, ISignUpValues, ISignUpErrors, signUpValues2errors, t } from '@cpmech/gate';
import {
  IStyleButton,
  IStyleTypeA,
  IconKind,
  BaseButton,
  BaseIcon,
  BaseLink,
  FormErrorField,
  InputTypeA,
  Popup,
  defaultStyleTypeA,
} from '@cpmech/rncomps';
import { useGateObserver } from '../components/useGateObserver';

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

export interface IFonts {
  size?: {
    header?: number;
    subHeader?: number;
    footnote?: number;
    smallFootnote?: number;
    input?: number;
    button?: number;
  };
  familiy?: {
    header?: string;
    subHeader?: string;
    footnote?: string;
    smallFootnote?: string;
    input?: string;
    button?: string;
    link?: string;
  };
}

export interface IGateSignUpViewProps {
  gate: GateStore;
  iniEmail?: string;

  colorIcon?: string;
  colorText?: string;
  colorLink?: string;
  colorTitleLoading?: string;
  colorSpinner?: string;
  colorError?: string;
  styleInput?: IStyleTypeA;
  styleButton?: IStyleButton;
  buttonHeight?: number;
  buttonBorderRadius?: number;
  buttonMinWidth?: number;
  linkDarkBackground?: boolean;
  iconKind?: IconKind;
  fonts?: IFonts;
}

export const GateSignUpView: React.FC<IGateSignUpViewProps> = ({
  gate,
  iniEmail = '',

  colorIcon = defaultStyleTypeA.mutedColor,
  colorText = '#484848',
  colorLink = '#484848',
  colorTitleLoading = '#236cd2',
  colorSpinner = '#236cd2',
  colorError,
  styleInput,
  styleButton,
  buttonHeight = 45,
  buttonBorderRadius = 1000,
  buttonMinWidth,
  linkDarkBackground,
  iconKind = 'line',
  fonts = {
    size: {
      header: 22,
      subHeader: 20,
      footnote: 16,
      smallFootnote: 14,
      input: 18,
      button: 16,
    },
  },
  //
}) => {
  //
  const {
    error,
    needToConfirm,
    resetPasswordStep2,
    processing,
    doneSendCode,
    doneResetPassword,
  } = useGateObserver(gate, '@cpmech/gate-native/GateSignUpView');

  const [isSignIn, setIsSignIn] = useState(false);
  const [wantToConfirm, setWantToConfirm] = useState(false);
  const [resetPasswordStep1, setResetPasswordStep1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({ email: iniEmail, password: '', code: '' });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

  const isConfirm = wantToConfirm || needToConfirm;
  const isResetPassword = resetPasswordStep1 || resetPasswordStep2;
  const atNextPage = isConfirm || isResetPassword;

  const clearErrors = () => {
    setTouchedButtons(false);
    setVerrors({ email: '', password: '', code: '' });
  };

  const validate = (ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean }): boolean => {
    const res = signUpValues2errors(values, ignore);
    setVerrors(res.errors);
    return !res.hasError;
  };

  const submit = async () => {
    setTouchedButtons(true);

    // resetPasswordStep2
    if (resetPasswordStep2) {
      if (!validate()) {
        return;
      }
      await gate.forgotPasswordStep2(values.email, values.password, values.code);
      return;
    }

    // resetPasswordStep1
    if (resetPasswordStep1) {
      if (!validate({ password: true, code: true })) {
        return;
      }
      setValues({ ...values, password: '' });
      setResetPasswordStep1(false);
      await gate.forgotPasswordStep1(values.email);
      return;
    }

    // wantToConfirm
    if (wantToConfirm) {
      if (!validate({ password: true })) {
        return;
      }
      await gate.confirmSignUpOnly(values.email, values.code);
      setValues({ email: '', password: '', code: '' });
      clearErrors();
      setWantToConfirm(false);
      setIsSignIn(true);
      return;
    }

    // needToConfirm
    if (needToConfirm) {
      if (!validate()) {
        return;
      }
      await gate.confirmSignUpAndSignIn(values.email, values.password, values.code);
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

  const resendCodeInResetPwdView = async () => await gate.forgotPasswordStep1(values.email);

  const resendCodeInConfirmView = async () => {
    setTouchedButtons(true);
    if (validate({ password: true, code: true })) {
      await gate.resendCode(values.email);
    }
  };

  const setValue = <K extends keyof ISignUpValues>(key: K, value: string) => {
    const newValues = { ...values, [key]: value.trim() };
    setValues(newValues);
    if (touchedButtons) {
      const res = signUpValues2errors(newValues);
      setVerrors({ ...vErrors, [key]: (res as any)[key] });
    }
  };

  const iconSize = styleInput?.fontSize || defaultStyleTypeA.fontSize;

  const renderPasswordIcon = (
    <TouchableHighlight onPress={() => setShowPassword(!showPassword)} underlayColor="transparent">
      {showPassword ? (
        <BaseIcon name="eye-off" kind={iconKind} size={iconSize} color={colorIcon} />
      ) : (
        <BaseIcon name="eye" kind={iconKind} size={iconSize} color={colorIcon} />
      )}
    </TouchableHighlight>
  );

  const txtHeader = {
    fontFamily: fonts?.familiy?.header,
    fontSize: fonts?.size?.header,
    color: colorText,
  };
  const txtSubheader = {
    fontFamily: fonts?.familiy?.subHeader,
    fontSize: fonts?.size?.subHeader,
    color: colorText,
  };
  const txtFootnote = {
    fontFamily: fonts?.familiy?.footnote,
    fontSize: fonts?.size?.footnote,
    color: colorText,
  };
  const txtSmallFootnote = {
    fontFamily: fonts?.familiy?.smallFootnote,
    fontSize: fonts?.size?.smallFootnote,
    color: colorText,
  };
  const linkFootnote = {
    color: colorLink,
    fontSize: fonts?.size?.footnote,
    fontFamily: fonts?.familiy?.link,
    darkBackground: linkDarkBackground,
  };
  const linkSmallFootnote = {
    color: colorLink,
    fontSize: fonts?.size?.smallFootnote,
    fontFamily: fonts?.familiy?.link,
    darkBackground: linkDarkBackground,
  };

  return (
    <React.Fragment>
      {/* ----------------- header -- reset password ---------------- */}
      {isResetPassword && (
        <View style={styles.header}>
          <Text style={txtHeader}>{t('resetPassword')}</Text>
          <Text style={txtSubheader}>
            {resetPasswordStep1 ? t('resetPassword1') : t('resetPassword2')}
          </Text>
        </View>
      )}

      {/* --------------------- header -- normal -------------------- */}
      {!isResetPassword && (
        <View style={styles.header}>
          <Text style={txtHeader}>
            {isConfirm ? t('confirmSignUp') : isSignIn ? t('signIn') : t('createAccount')}
          </Text>
        </View>
      )}

      {/* ----------------------- input email ------------------------ */}
      {!resetPasswordStep2 && (
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

      {/* ----------------------- input code ------------------------- */}
      {(isConfirm || resetPasswordStep2) && (
        <View style={styles.inputContainer}>
          <InputTypeA
            label={t('confirmationCode')}
            value={values.code}
            onChangeText={v => setValue('code', v)}
            error={vErrors.code}
            factorFontsize2width={0.55}
            keyboardType="numeric"
            {...styleInput}
          />
          <FormErrorField error={vErrors.code} color={colorError} />
        </View>
      )}

      {/* --------------------- input password ----------------------- */}
      {!(isConfirm || resetPasswordStep1) && (
        <View style={styles.inputContainer}>
          <InputTypeA
            label={resetPasswordStep2 ? t('newPassword') : t('password')}
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
        {atNextPage && (
          <View style={styles.buttonLeft}>
            <View style={styles.footnoteLeft}>
              <BaseLink
                onPress={() => {
                  clearErrors();
                  wantToConfirm && setWantToConfirm(false);
                  needToConfirm && gate.notify({ needToConfirm: false });
                  resetPasswordStep1 && setResetPasswordStep1(false);
                  resetPasswordStep2 && gate.notify({ resetPasswordStep2: false });
                }}
                message={t('back')}
                color={colorLink}
                fontSize={fonts?.size?.button}
                fontFamily={fonts?.familiy?.link}
                darkBackground={linkDarkBackground}
              />
            </View>
          </View>
        )}

        {/* ....... footnote: signIn or signUp ....... */}
        {!atNextPage && (
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
                {...linkFootnote}
              />
            </View>
          </View>
        )}

        {/* ....... submit ....... */}
        <View style={{ ...styles.buttonRight, minWidth: buttonMinWidth }}>
          <BaseButton
            onPress={async () => await submit()}
            borderRadius={buttonBorderRadius}
            fontSize={fonts?.size?.button}
            height={buttonHeight}
            text={
              isConfirm
                ? t('confirm').toUpperCase()
                : resetPasswordStep1
                ? t('sendCode').toUpperCase()
                : resetPasswordStep2
                ? t('submit').toUpperCase()
                : isSignIn
                ? t('enter').toUpperCase()
                : t('signUp').toUpperCase()
            }
            {...styleButton}
          />
        </View>
      </View>

      <View style={styles.footnotes}>
        {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
        {resetPasswordStep2 && (
          <View style={styles.footnote}>
            <Text style={txtSmallFootnote}>{t('lostCode')}&nbsp;</Text>
            <BaseLink
              onPress={async () => await resendCodeInResetPwdView()}
              message={t('resendCode')}
              {...linkSmallFootnote}
            />
          </View>
        )}

        {/* ----------------- footnote: reset password ----------------- */}
        {isSignIn && !atNextPage && (
          <View style={styles.footnote}>
            <Text style={txtSmallFootnote}>{t('forgotPassword')}&nbsp;</Text>
            <BaseLink
              onPress={() => {
                clearErrors();
                setResetPasswordStep1(true);
              }}
              message={t('resetPassword')}
              {...linkSmallFootnote}
            />
          </View>
        )}

        {/* ----------------- footnote: resend code -------------------- */}
        {isConfirm && (
          <View style={styles.footnote}>
            <Text style={txtSmallFootnote}>{t('lostCode')}&nbsp;</Text>
            <BaseLink
              onPress={async () => await resendCodeInConfirmView()}
              message={t('resendCode')}
              {...linkSmallFootnote}
            />
          </View>
        )}

        {/* ----------------- footnote: want to confirm ---------------- */}
        {!atNextPage && (
          <View style={styles.wantToConfirm}>
            <Text style={txtSmallFootnote}>{t('wantToConfirm')}&nbsp;</Text>
            <BaseLink
              onPress={() => {
                clearErrors();
                setWantToConfirm(true);
              }}
              message={t('gotoConfirm')}
              {...linkSmallFootnote}
            />
          </View>
        )}
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

      <Popup
        visible={doneSendCode}
        title={t('success')}
        onClose={() => gate.notify({ doneSendCode: false })}
        message={t('doneSendCode')}
      />

      <Popup
        visible={doneResetPassword}
        title={t('success')}
        onClose={() => gate.notify({ doneResetPassword: false })}
        message={t('doneResetPassword')}
      />
    </React.Fragment>
  );
};
