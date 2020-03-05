import React, { useState } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { GateStore, ISignUpValues, ISignUpErrors, signUpValues2errors, t } from '@cpmech/gate';
import { BaseIcon } from '@cpmech/rncomps';
import { useGateObserver } from '../components/useGateObserver';
import { colors } from '../components/gateParams';

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
  buttonBgColor = '#5d5c61',
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
      <Text>{t('resetPassword')}</Text>
    </View>
  );
};
