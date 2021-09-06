import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, Switch, ScrollView} from 'react-native';
import {View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {Button, Header, InputOutline, Text, TextInput} from '../../components';
import colors from '../../utils/colors';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import sizes from '../../utils/size';
import {setProfileState} from '../../redux/actions/profile';
import {updateUserInfo} from '../../redux/actions/auth';
import {Toaster} from '../../helpers';

const UbahProfile = ({navigation, route}) => {
  const {params} = route;
  const dispatch = useDispatch();
  const {userInfo} = useSelector(state => state.auth);
  const {address} = useSelector(state => state.profile);
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const [photo, setPhoto] = useState(userInfo.photoProfile);

  const updateAction = payload => {
    dispatch(
      _fetch(
        ProfileServices.updateProfile({
          ...payload,
          photoProfile: photo,
        }),
      ),
    ).then(res => {
      if (res) {
        if (res) {
          Toaster(res.message);
          dispatch(updateUserInfo(res.data));
          navigation.goBack();
        }
      }
    });
  };

  return (
    <>
      <Header title="Ubah Profile" center shadow />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Formik
          initialValues={{
            username: userInfo.username,
            password: '',
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            gender: userInfo.gender,
            phone: userInfo.phone,
            photoProfile: userInfo.photoProfile,
            address: userInfo.address,
          }}
          onSubmit={(values, {resetForm}) => {
            updateAction(values);
          }}
          validationSchema={yup.object().shape({
            username: yup.string().required(),
            password: yup.string(),
            email: yup.string().email().required(),
            firstName: yup.string().required(),
            phone: yup.string().required(),
            address: yup.string().required().min(8),
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
              <TextInput
                placeholder="Mis. akusiapa"
                label="Username"
                value={values.username}
                onChangeText={handleChange('username')}
                errorMessage={
                  touched.username && errors.username && errors.username
                }
              />
              <TextInput
                placeholder="Mis. akuimuet"
                label="Password Baru"
                value={values.password}
                onChangeText={handleChange('password')}
                errorMessage={
                  touched.password && errors.password && errors.password
                }
              />
              <TextInput
                placeholder="Mis. aku@siapa.com"
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                errorMessage={touched.email && errors.email && errors.email}
              />
              <TextInput
                placeholder="Mis. Herly"
                label="Nama Depan"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                errorMessage={
                  touched.firstName && errors.firstName && errors.firstName
                }
              />
              <TextInput
                placeholder="Mis. Chahya"
                label="Nama Belakang"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                errorMessage={
                  touched.lastName && errors.lastName && errors.lastName
                }
              />
              <TextInput
                placeholder="Mis. 085156842765"
                label="No HP"
                value={values.phone}
                onChangeText={handleChange('phone')}
                errorMessage={touched.phone && errors.phone && errors.phone}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Mis. Jl Kepo"
                label="Alamat"
                value={values.address}
                onChangeText={handleChange('address')}
                errorMessage={
                  touched.address && errors.address && errors.address
                }
              />
              <Button
                title="Simpan"
                loading={isLoading}
                disabled={isLoading}
                style={styles.btn}
                onPress={handleSubmit}
                border
                rounded
              />
            </>
          )}
        </Formik>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: sizes.five,
    paddingTop: sizes.ten,
  },
  btn: {
    marginHorizontal: sizes.ten,
  },
  def: {
    marginHorizontal: sizes.ten,
  },
  rowdef: {
    marginBottom: sizes.twenty,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default UbahProfile;
