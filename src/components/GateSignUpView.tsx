import React, { useState } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { GateStore, ISignUpValues, ISignUpErrors, signUpValues2errors, t } from '@cpmech/gate';
import {
  BaseButton,
  BaseIcon,
  BaseLink,
  InputTypeA,
  FormErrorField,
  IStyle,
} from '@cpmech/rncomps';
import { useGateObserver } from '../components/useGateObserver';
import { fonts, params, colors, stylesSignUpForm } from './gateStyles';
import { GateVSpace } from './GateVSpace';
import { GateVSpaceSmall } from './GateVSpaceSmall';
import { GateVSpaceLarge } from './GateVSpaceLarge';

const s = stylesSignUpForm;

interface IGateSignUpViewProps {
  gate: GateStore;
  iniEmail?: string;
  buttonBgColor?: string;
  colorTitleLoading?: string;
  colorSpinner?: string;
  hlColor?: string;
}

export const GateSignUpView: React.FC<IGateSignUpViewProps> = ({
  gate,
  iniEmail = '',
  buttonBgColor,
  colorTitleLoading = '#236cd2',
  colorSpinner = '#236cd2',
  hlColor = colors.blue,
}) => {
  const { error, needToConfirm, resetPasswordStep2, processing } = useGateObserver(
    gate,
    '@cpmech/gate-native/GateSignUpView',
  );

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

  const passwordIcon = (
    <TouchableHighlight onPress={() => setShowPassword(!showPassword)}>
      {showPassword ? <BaseIcon name="eye" size={20} /> : <BaseIcon name="eye-off" size={20} />}
    </TouchableHighlight>
  );

  const renderResetPasswordHeader = () => (
    <View>
      <View>{t('resetPassword')}</View>
      <View>{resetPasswordStep1 ? t('resetPassword1') : t('resetPassword2')}</View>
    </View>
  );

  return (
    <View>
      <View>
        {/* ----------------------- show header ------------------------ */}
        <View style={s.centered}>
          <Text style={s.header}>
            {isConfirm
              ? t('confirmSignUp')
              : isResetPassword
              ? renderResetPasswordHeader()
              : isSignIn
              ? t('signIn')
              : t('createAccount')}
          </Text>
        </View>
      </View>

      {/* ----------------------- input email ------------------------ */}
      {!resetPasswordStep2 && (
        <React.Fragment>
          <GateVSpace />
          <InputTypeA
            label="Email"
            value={values.email}
            onChangeText={v => setValue('email', v)}
            hlColor={hlColor}
            error={vErrors.email}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormErrorField error={vErrors.email} />
        </React.Fragment>
      )}

      {/* ----------------------- input code ------------------------- */}
      {(isConfirm || resetPasswordStep2) && (
        <React.Fragment>
          <GateVSpace />
          <InputTypeA
            label={t('confirmationCode')}
            value={values.code}
            onChangeText={v => setValue('code', v)}
            hlColor={hlColor}
            error={vErrors.code}
            factorFontsize2width={0.55}
          />
          <FormErrorField error={vErrors.code} />
        </React.Fragment>
      )}

      {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
      {resetPasswordStep2 && (
        <React.Fragment>
          <GateVSpaceSmall />
          <View style={s.smallFootnote}>
            <Text>{t('lostCode')}&nbsp;</Text>
            <BaseLink
              onPress={async () => await resendCodeInResetPwdView()}
              message={t('resendCode')}
            />
          </View>
        </React.Fragment>
      )}

      {/* --------------------- input password ----------------------- */}
      {!(isConfirm || resetPasswordStep1) && (
        <React.Fragment>
          <GateVSpace />
          <InputTypeA
            label={resetPasswordStep2 ? t('newPassword') : t('password')}
            value={values.password}
            suffix={passwordIcon}
            onChangeText={v => setValue('password', v)}
            hlColor={hlColor}
            error={vErrors.password}
            autoCorrect={false}
            textContentType="password"
            secureTextEntry={!showPassword}
          />
          <FormErrorField error={vErrors.password} />
        </React.Fragment>
      )}

      {/* ----------------- footnote: reset password ----------------- */}
      {isSignIn && !atNextPage && (
        <React.Fragment>
          <GateVSpace />
          <View style={s.smallFootnote}>
            <Text style={s.smallFootnoteText}>{t('forgotPassword')}&nbsp;</Text>
            <BaseLink
              onPress={() => {
                clearErrors();
                setResetPasswordStep1(true);
              }}
              message={t('resetPassword')}
              fontSize={fonts.smallFootnote}
            />
          </View>
        </React.Fragment>
      )}

      {/* ----------------- footnote: resend code -------------------- */}
      {isConfirm && (
        <React.Fragment>
          <GateVSpace />
          <View style={s.smallFootnote}>
            <Text style={s.smallFootnoteText}>{t('lostCode')}&nbsp;</Text>
            <BaseLink
              onPress={async () => await resendCodeInConfirmView()}
              message={t('resendCode')}
              fontSize={fonts.smallFootnote}
            />
          </View>
        </React.Fragment>
      )}

      {resetPasswordStep1 && <GateVSpaceLarge />}

      {/* ----------------------- submit button ---------------------- */}
      <GateVSpaceLarge />
      <View style={s.row}>
        {/* ....... footnote: go back ....... */}
        {atNextPage && (
          <React.Fragment>
            <GateVSpace />
            <View style={s.footnote}>
              <BaseLink
                onPress={() => {
                  clearErrors();
                  wantToConfirm && setWantToConfirm(false);
                  needToConfirm && gate.notify({ needToConfirm: false });
                  resetPasswordStep1 && setResetPasswordStep1(false);
                  resetPasswordStep2 && gate.notify({ resetPasswordStep2: false });
                }}
                message={t('back')}
              />
            </View>
          </React.Fragment>
        )}

        {/* ....... footnote: signIn or signUp ....... */}
        {!atNextPage && (
          <React.Fragment>
            <GateVSpace />
            <View style={s.footnoteCenter}>
              <Text style={s.footnoteText}>
                {isSignIn ? t('noAccount') : t('haveAnAccount')}&nbsp;
              </Text>
              <BaseLink
                onPress={() => {
                  clearErrors();
                  setIsSignIn(!isSignIn);
                }}
                message={isSignIn ? t('signUp') : t('gotoSignIn')}
                fontSize={fonts.footnote}
              />
            </View>
          </React.Fragment>
        )}

        {/* ....... submit ....... */}
        <GateVSpace />
        <BaseButton
          onPress={async () => await submit()}
          borderRadius={300}
          fontSize={fonts.button}
          width={175}
          height={params.buttonHeight}
          backgroundColor={buttonBgColor}
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
        />
      </View>

      {/* ----------------- footnote: want to confirm ---------------- */}
      {!atNextPage && (
        <React.Fragment>
          <GateVSpaceLarge />
          <View style={s.smallFootnote}>
            <Text style={s.smallFootnoteText}>{t('wantToConfirm')}&nbsp;</Text>
            <BaseLink
              onPress={() => {
                clearErrors();
                setWantToConfirm(true);
              }}
              message={t('gotoConfirm')}
              fontSize={fonts.smallFootnote}
            />
          </View>
        </React.Fragment>
      )}
    </View>
  );
};
