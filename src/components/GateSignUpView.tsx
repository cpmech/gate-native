import React, { useState } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { GateStore, ISignUpValues, ISignUpErrors, signUpValues2errors, t } from '@cpmech/gate';
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
import { useGateObserver } from '../components/useGateObserver';
import { fonts, params, stylesSignUpForm } from './gateStyles';
import { GateVSpace } from './GateVSpace';
import { GateVSpaceSmall } from './GateVSpaceSmall';
import { GateVSpaceLarge } from './GateVSpaceLarge';

const s = stylesSignUpForm;

interface IGateSignUpViewProps {
  gate: GateStore;
  iniEmail?: string;
  colorText?: string;
  colorTitleLoading?: string;
  colorSpinner?: string;
  colorEye?: string;
  styleInput?: IStyleTypeA;
  styleButton?: IStyleButton;
  styleLink?: IStyleLink;
  widthButton?: number;
}

export const GateSignUpView: React.FC<IGateSignUpViewProps> = ({
  gate,
  iniEmail = '',
  colorText = '#484848',
  colorTitleLoading = '#236cd2',
  colorSpinner = '#236cd2',
  colorEye = defaultStyleTypeA.mutedColor,
  styleInput,
  styleButton,
  styleLink,
  widthButton = 180,
}) => {
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

  const renderPasswordIcon = (
    <TouchableHighlight onPress={() => setShowPassword(!showPassword)}>
      {showPassword ? (
        <BaseIcon name="eye" size={20} color={colorEye} />
      ) : (
        <BaseIcon name="eye-off" size={20} color={colorEye} />
      )}
    </TouchableHighlight>
  );

  const txtHeader = { fontSize: fonts.header, color: colorText };
  const txtSubheader = { fontSize: fonts.subheader, color: colorText };
  const txtFootnote = { fontSize: fonts.footnote, color: colorText };
  const txtSmallFootnote = { fontSize: fonts.smallFootnote, color: colorText };

  return (
    <React.Fragment>
      {/* ----------------- header -- reset password ---------------- */}
      {isResetPassword && (
        <View style={s.centered}>
          <Text style={txtHeader}>{t('resetPassword')}</Text>
          <Text style={txtSubheader}>
            {resetPasswordStep1 ? t('resetPassword1') : t('resetPassword2')}
          </Text>
        </View>
      )}

      {/* --------------------- header -- normal -------------------- */}
      {!isResetPassword && (
        <View style={s.centered}>
          <Text style={txtHeader}>
            {isConfirm ? t('confirmSignUp') : isSignIn ? t('signIn') : t('createAccount')}
          </Text>
        </View>
      )}

      {/* ----------------------- input email ------------------------ */}
      {!resetPasswordStep2 && (
        <React.Fragment>
          <GateVSpace />
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
            error={vErrors.code}
            factorFontsize2width={0.55}
            keyboardType="numeric"
            {...styleInput}
          />
          <FormErrorField error={vErrors.code} />
        </React.Fragment>
      )}

      {/* ----- footnote: resend code -- (resetPasswordStep2) -------- */}
      {resetPasswordStep2 && (
        <React.Fragment>
          <GateVSpaceSmall />
          <View style={s.smallFootnote}>
            <Text style={txtSmallFootnote}>{t('lostCode')}&nbsp;</Text>
            <BaseLink
              onPress={async () => await resendCodeInResetPwdView()}
              message={t('resendCode')}
              fontSize={fonts.smallFootnote}
              {...styleLink}
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
            suffix={renderPasswordIcon}
            onChangeText={v => setValue('password', v)}
            error={vErrors.password}
            autoCorrect={false}
            textContentType="password"
            secureTextEntry={!showPassword}
            {...styleInput}
          />
          <FormErrorField error={vErrors.password} />
        </React.Fragment>
      )}

      {/* ----------------- footnote: reset password ----------------- */}
      {isSignIn && !atNextPage && (
        <React.Fragment>
          <GateVSpace />
          <View style={s.smallFootnote}>
            <Text style={txtSmallFootnote}>{t('forgotPassword')}&nbsp;</Text>
            <BaseLink
              onPress={() => {
                clearErrors();
                setResetPasswordStep1(true);
              }}
              message={t('resetPassword')}
              fontSize={fonts.smallFootnote}
              {...styleLink}
            />
          </View>
        </React.Fragment>
      )}

      {/* ----------------- footnote: resend code -------------------- */}
      {isConfirm && (
        <React.Fragment>
          <GateVSpace />
          <View style={s.smallFootnote}>
            <Text style={txtSmallFootnote}>{t('lostCode')}&nbsp;</Text>
            <BaseLink
              onPress={async () => await resendCodeInConfirmView()}
              message={t('resendCode')}
              fontSize={fonts.smallFootnote}
              {...styleLink}
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
          <View style={{ width: '50%' }}>
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
                fontSize={fonts.button}
                {...styleLink}
              />
            </View>
          </View>
        )}

        {/* ....... footnote: signIn or signUp ....... */}
        {!atNextPage && (
          <View style={{ width: '50%' }}>
            <View style={s.footnoteCenter}>
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
        <GateVSpace />
        <View style={{ width: '50%' }}>
          <BaseButton
            onPress={async () => await submit()}
            borderRadius={300}
            fontSize={fonts.button}
            height={params.buttonHeight}
            width={widthButton}
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

      {/* ----------------- footnote: want to confirm ---------------- */}
      {!atNextPage && (
        <React.Fragment>
          <GateVSpaceLarge />
          <View style={s.smallFootnote}>
            <Text style={txtSmallFootnote}>{t('wantToConfirm')}&nbsp;</Text>
            <BaseLink
              onPress={() => {
                clearErrors();
                setWantToConfirm(true);
              }}
              message={t('gotoConfirm')}
              fontSize={fonts.smallFootnote}
              {...styleLink}
            />
          </View>
        </React.Fragment>
      )}

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
