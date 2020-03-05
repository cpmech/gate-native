import { IStyles } from '@cpmech/rncomps';

export const colors = {
  blue: '#236cd2',
  darkRed: '#c01626',
  darkGrey: '#343434',
};

export const params = {
  vspace: {
    tiny: 5,
    small: 10,
    normal: 20,
    medium: 30,
    large: 50,
    huge: 80,
  },
  hspace: {
    small: 15,
    normal: 25,
    medium: 35,
    large: 55,
    huge: 85,
  },
  vpadding: {
    small: 5,
    normal: 10,
    large: 20,
    huge: 30,
  },
  hpadding: {
    small: 10,
    normal: 20,
    large: 40,
    huge: 60,
  },
  orLineVertSpace: 40,
  orLineVertSpaceLarge: 80,
  inputWidth: 300,
  buttonHeight: 45,
};

export const stylesFederatedButtons: IStyles = {
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: params.hpadding.normal,
    paddingRight: params.hpadding.normal,
    marginTop: 30,
    width: params.inputWidth,
  },

  rowCen: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 200,
  },

  facebook: {
    fontSize: 16,
    color: 'white',
    backgroundColor: '#4267b2',
    height: params.buttonHeight,
    textAlign: 'center',
    width: '100%',
    borderWidth: 0,
    borderRadius: 200,
  },

  google: {
    fontSize: 16,
    color: 'white',
    backgroundColor: '#aaaaaa',
    height: params.buttonHeight,
    textAlign: 'center',
    width: '100%',
    borderWidth: 0,
    borderRadius: 200,
    marginTop: 30,
  },

  orLineContainer: {
    width: 275,
    textAlign: 'center',
    // borderBottom: 1px solid #bbb
    color: '#828282',
    marginTop: params.orLineVertSpace,
  },

  orLine: {
    backgroundColor: '#ffffff',
    // padding: 0 25px
    fontSize: 14,
  },
};

export const stylesSignUpForm: IStyles = {
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: params.hpadding.normal,
    paddingRight: params.hpadding.normal,
  },

  container: {
    marginTop: params.orLineVertSpace,
    width: params.inputWidth,
  },

  centered: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  header: {
    fontSize: 20,
    color: '#484848',
  },

  subheader: {
    fontSize: 16,
    color: '#484848',
  },

  smallFootnote: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontSize: 14,
    color: '#484848',
  },

  footnote: {
    flex: 1,
    flexDirection: 'column',
    fontSize: 16,
    color: '#484848',
  },

  submitButton: {
    width: 180,
  },
};
