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
  defaultStyleTypeA,
} from '@cpmech/rncomps';
import { withUseGateObserver } from './withUseGateObserver';

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

export interface IFonts {
  size?: {
    message?: number;
    error?: number;
    header?: number;
    subHeader?: number;
    footnote?: number;
    smallFootnote?: number;
  };
  familiy?: {
    message?: string;
    error?: string;
    header?: string;
    subHeader?: string;
    footnote?: string;
    smallFootnote?: string;
    link?: string;
  };
}

export interface IGateSignUpViewProps {
  gate: GateStore;
  iniEmail?: string;
  simplePassword?: boolean;
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
}

export const GateSignUpView: React.FC<IGateSignUpViewProps> = ({
  gate,
  iniEmail = '',
  simplePassword = true,
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
    familiy: {
      message: '',
      error: '',
      header: '',
      subHeader: '',
      footnote: '',
      smallFootnote: '',
      link: '',
    },
  },
  //
}) => {
  //
  const useObserver = withUseGateObserver(gate);
  const {
    error,
    needToConfirm,
    resetPasswordStep2,
    processing,
    doneSendCode,
    doneResetPassword,
  } = useObserver('@cpmech/gate-native/GateSignUpView');

  const [isSignIn, setIsSignIn] = useState(true);
  const [wantToConfirm, setWantToConfirm] = useState(false);
  const [resetPasswordStep1, setResetPasswordStep1] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedButtons, setTouchedButtons] = useState(false);
  const [values, setValues] = useState<ISignUpValues>({ email: iniEmail, password: '', code: '' });
  const [vErrors, setVerrors] = useState<ISignUpErrors>({ email: '', password: '', code: '' });

  const isConfirm = wantToConfirm || needToConfirm;
  const isResetPassword = resetPasswordStep1 || resetPasswordStep2;
  const atNextPage = isConfirm || isResetPassword;

  const clearNotifications = () => {
    !!error && gate.notify({ error: '' });
    !!doneSendCode && gate.notify({ doneSendCode: false });
    !!doneResetPassword && gate.notify({ doneResetPassword: false });
    setTouchedButtons(false);
    setVerrors({ email: '', password: '', code: '' });
  };

  const validate = (ignore?: { [key in keyof Partial<ISignUpErrors>]: boolean }): boolean => {
    const res = signUpValues2errors(values, ignore, simplePassword);
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
      clearNotifications();
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
      const res = signUpValues2errors(newValues, {}, simplePassword);
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

  const txtMessage = {
    fontFamily: fonts?.familiy?.message,
    fontSize: fonts?.size?.message,
    color: colorText,
  };
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
  };
  const linkSmallFootnote = {
    color: colorLink,
    fontSize: fonts?.size?.smallFootnote,
    fontFamily: fonts?.familiy?.link,
  };

  return (
    <React.Fragment>
      <View style={{ marginTop }} />

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
        <React.Fragment>
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
        </React.Fragment>
      )}

      {/* ----------------------- input code ------------------------- */}
      {(isConfirm || resetPasswordStep2) && (
        <React.Fragment>
          <View style={styles.inputContainer}>
            <InputTypeA
              disabled={processing}
              label={t('confirmationCode')}
              value={values.code}
              onChangeText={(v) => setValue('code', v)}
              error={vErrors.code}
              factorFontsize2width={0.55}
              keyboardType="numeric"
              {...styleInput}
            />
          </View>
          <View style={styles.inputErrorContainer}>
            <FormErrorField error={vErrors.code} color={colorError} />
          </View>
        </React.Fragment>
      )}

      {/* --------------------- input password ----------------------- */}
      {!(isConfirm || resetPasswordStep1) && (
        <React.Fragment>
          <View style={styles.inputContainer}>
            <InputTypeA
              disabled={processing}
              label={resetPasswordStep2 ? t('newPassword') : t('password')}
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
        </React.Fragment>
      )}

      {/* ----------------------- control ---------------------- */}
      <View style={styles.controlContainer}>
        {/* --------- go back and button ---------  */}
        <View style={styles.buttonContainer}>
          {/* ....... footnote: go back ....... */}
          {atNextPage && (
            <View style={styles.buttonLeft}>
              <View style={styles.leftContainer}>
                <BaseLink
                  disabled={processing}
                  text={t('back')}
                  onPress={() => {
                    clearNotifications();
                    wantToConfirm && setWantToConfirm(false);
                    needToConfirm && gate.notify({ needToConfirm: false });
                    resetPasswordStep1 && setResetPasswordStep1(false);
                    resetPasswordStep2 && gate.notify({ resetPasswordStep2: false });
                  }}
                  {...linkFootnote}
                />
              </View>
            </View>
          )}

          {/* ....... footnote: signIn or signUp ....... */}
          {!atNextPage && (
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
          )}

          {/* ....... submit ....... */}
          <View style={{ ...styles.buttonRight, minWidth: buttonMinWidth }}>
            <BaseButton
              spinning={processing}
              onPress={async () => await submit()}
              borderRadius={buttonBorderRadius}
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

        {/* ....... notifications ....... */}
        <View style={styles.notifications}>
          {!!error && <Text style={[styles.notificationsText, txtError]}>{error}</Text>}
          {doneSendCode && (
            <Text style={[styles.notificationsText, txtMessage]}>{t('doneSendCode')}</Text>
          )}
          {doneResetPassword && (
            <Text style={[styles.notificationsText, txtMessage]}>{t('doneResetPassword')}</Text>
          )}
        </View>
      </View>

      {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
      {resetPasswordStep2 && (
        <View style={styles.footnote}>
          <Text style={txtSmallFootnote}>{t('lostCode')}&nbsp;</Text>
          <BaseLink
            disabled={processing}
            text={t('resendCode')}
            onPress={async () => await resendCodeInResetPwdView()}
            {...linkSmallFootnote}
          />
        </View>
      )}

      {/* ----------------- footnote: reset password ----------------- */}
      {isSignIn && !atNextPage && (
        <View style={styles.footnote}>
          <Text style={txtSmallFootnote}>{t('forgotPassword')}&nbsp;</Text>
          <BaseLink
            disabled={processing}
            text={t('resetPassword')}
            onPress={() => {
              clearNotifications();
              setResetPasswordStep1(true);
            }}
            {...linkSmallFootnote}
          />
        </View>
      )}

      {/* ----------------- footnote: resend code -------------------- */}
      {isConfirm && (
        <View style={styles.footnote}>
          <Text style={txtSmallFootnote}>{t('lostCode')}&nbsp;</Text>
          <BaseLink
            disabled={processing}
            text={t('resendCode')}
            onPress={async () => await resendCodeInConfirmView()}
            {...linkSmallFootnote}
          />
        </View>
      )}

      {/* ----------------- footnote: want to confirm ---------------- */}
      {!atNextPage && (
        <View style={styles.footnote}>
          <Text style={txtSmallFootnote}>{t('wantToConfirm')}&nbsp;</Text>
          <BaseLink
            disabled={processing}
            text={t('gotoConfirm')}
            onPress={() => {
              clearNotifications();
              setWantToConfirm(true);
            }}
            {...linkSmallFootnote}
          />
        </View>
      )}
    </React.Fragment>
  );
};
