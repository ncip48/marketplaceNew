import React, {useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import {AuthServices} from '../../services';
import {_fetch, _fetch_noerror} from '../../redux/actions/global';
import {Divider, Icon} from 'react-native-elements';
import {
  Button,
  ErrorSheet,
  Header,
  InputOutline,
  Text,
  TextInput,
} from '../../components';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import colors from '../../utils/colors';
import {login} from '../../redux/actions/auth';
import sizes from '../../utils/size';
import {RFPercentage} from 'react-native-responsive-fontsize';

const Masuk = ({navigation}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.global.fullscreenLoading);

  const [hide, setHide] = useState(true);
  const [error, setError] = useState(null);
  const [errorSheet, setErrorSheet] = useState(false);

  const changeHide = () => () => {
    setHide(!hide);
  };

  const loginAction = async payload => {
    console.log(payload);
    const res = await dispatch(
      _fetch_noerror(
        AuthServices.loginAction({
          ...payload,
        }),
      ),
    );
    if (res.status == 200) {
      dispatch(login(res.data));
    } else {
      setError(res.error);
      setErrorSheet(true);
    }
  };

  // console.log(RFPercentage(4.6));
  const loginGoogleAction = async () => {
    //6A:44:A6:09:BC:79:B7:BA:41:EC:0D:35:1E:5C:33:38:D9:90:B7:36
    console.log('waiting');
    try {
      await GoogleSignin.configure();
      await GoogleSignin.hasPlayServices();
      const userGoogle = await GoogleSignin.signIn();
      console.log(userGoogle);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
      console.log(error);
    }
  };

  return (
    <>
      {/* <Header title="Masuk" right={<Text color={colors.green}>Daftar</Text>} /> */}
      <Header bg={colors.bg} noBack />
      <View style={styles.container}>
        <Text
          size={RFPercentage(4.6)}
          type="Bold"
          style={{
            marginHorizontal: sizes.ten,
            marginBottom: RFPercentage(10),
          }}>
          Login
        </Text>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={(values, {resetForm}) => {
            loginAction(values);
          }}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .required('Email harus diisi')
              .email('Masukkan email yang benar'),
            password: yup
              .string()
              .required('Password harus diisi')
              .min(8, 'Password minimal 8 karakter'),
          })}>
          {({
            values,
            handleChange,
            errors,
            touched,
            handleSubmit,
            setFieldValue,
          }) => (
            <>
              <InputOutline
                label="Email"
                placeholder="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                errorMessage={touched.email && errors.email && errors.email}
                style={{marginHorizontal: sizes.ten}}
              />
              <InputOutline
                label="Password"
                placeholder="Password"
                password={hide ? true : false}
                value={values.password}
                onChangeText={handleChange('password')}
                errorMessage={
                  touched.password && errors.password && errors.password
                }
                style={{marginHorizontal: sizes.ten}}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={hide ? 'eye-off' : 'eye'}
                    color={colors.grey}
                    onPress={changeHide()}
                  />
                }
              />
              <Text size={sizes.font12} align="right" style={styles.txtLost}>
                Lupa Kata Sandi?
              </Text>
              <Button
                rounded
                title="Masuk"
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit}
                style={styles.btn}
              />
            </>
          )}
        </Formik>
        <View style={styles.txtLoginWith}>
          {/* <View style={styles.divider} /> */}
          <Text size={sizes.font12}>atau masuk dengan</Text>
          {/* <View style={styles.divider} /> */}
        </View>
        <Button
          title="Akun Media Sosial"
          border
          bg={colors.white}
          color={colors.green}
          // loading={isLoading}
          //         disabled={isLoading}
          style={styles.btn}
          rounded
          onPress={() => loginGoogleAction()}
        />
        <Text
          color={colors.softgrey}
          size={sizes.font10}
          align="center"
          style={styles.txtDaftar}>
          Belum punya akun?{' '}
          <Text color={colors.green} size={sizes.font10}>
            Daftar
          </Text>
        </Text>
      </View>
      <ErrorSheet
        error={error}
        visible={errorSheet}
        onDismiss={() => setErrorSheet(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: sizes.five,
    paddingTop: sizes.ten,
  },
  btn: {
    marginHorizontal: sizes.ten,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLoginWith: {
    marginVertical: sizes.ten,
    marginTop: RFPercentage(17),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    backgroundColor: colors.softgrey,
    height: 1,
    marginHorizontal: sizes.ten,
    width: '30%',
  },
  txtDaftar: {
    marginVertical: sizes.ten,
  },
  txtLost: {
    marginHorizontal: sizes.ten,
    marginTop: sizes.ten,
    marginBottom: sizes.ten,
  },
});

export default Masuk;
