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

const TambahAlamat = ({navigation, route}) => {
  const {params} = route;
  const dispatch = useDispatch();
  const {address} = useSelector(state => state.profile);
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const userInfo = useSelector(state => state.auth.userInfo);

  // console.log(params);

  const addAddress = payload => {
    const province = params.province.split('#')[0];
    const provinceName = params.province.split('#')[1];
    const city = params.city.split('#')[0];
    const cityName = params.city.split('#')[1];
    const isMain = payload.isMain ? 1 : 0;
    const zipcode = parseInt(payload.zipcode);
    const isDeleted = payload.isDeleted;

    dispatch(
      _fetch(
        ProfileServices.addAddress({
          ...payload,
          province,
          city,
          provinceName,
          cityName,
          isMain,
          zipcode,
          isDeleted,
        }),
      ),
    ).then(res => {
      if (res) {
        if (res.status == 200) {
          dispatch(setProfileState('address', [...address, res.data]));
          navigation.goBack();
        }
      }
    });
  };

  return (
    <>
      <Header title="Tambah Alamat" center shadow />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Formik
          initialValues={{
            address: '',
            province: 'Pilih Provinsi',
            city: 'Pilih Kota',
            zipcode: '',
            tag: '',
            nameReceiver: userInfo.firstName + ' ' + userInfo.lastName,
            phoneReceiver: userInfo.phone,
            isMain: false,
            isDeleted: false,
          }}
          onSubmit={(values, {resetForm}) => {
            addAddress(values);
          }}
          validationSchema={yup.object().shape({
            address: yup.string().required().min(8),
            zipcode: yup.string().required(),
            tag: yup.string().required(),
            nameReceiver: yup.string().required(),
            phoneReceiver: yup.string().required(),
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
                placeholder="Mis. Jl. Trunojoyo"
                label="Detail Alamat"
                value={values.address}
                onChangeText={handleChange('address')}
                errorMessage={
                  touched.address && errors.address && errors.address
                }
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate('PilihProvinsi', {source: 'TambahAlamat'})
                }>
                <TextInput
                  label="Pilih Provinsi"
                  editable={false}
                  value={
                    params?.province
                      ? params.province.split('#')[1]
                      : values.province
                  }
                  rightIcon={
                    <Icon
                      type="material-community"
                      name="chevron-down"
                      color={colors.black}
                      size={18}
                    />
                  }
                />
              </TouchableOpacity>
              {params?.province && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate('PilihKota', {
                      province_id: params?.province.split('#')[0],
                      source: 'TambahAlamat',
                      province: params?.province,
                    })
                  }>
                  <TextInput
                    label="Pilih Kota"
                    editable={false}
                    value={
                      params?.city ? params.city.split('#')[1] : values.city
                    }
                    rightIcon={
                      <Icon
                        type="material-community"
                        name="chevron-down"
                        color={colors.black}
                        size={18}
                      />
                    }
                  />
                </TouchableOpacity>
              )}
              <TextInput
                placeholder="Mis. 63213"
                label="Kode Pos"
                value={values.zipcode}
                onChangeText={handleChange('zipcode')}
                errorMessage={
                  touched.zipcode && errors.zipcode && errors.zipcode
                }
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Mis. Rumah"
                label="Label Alamat"
                value={values.tag}
                onChangeText={handleChange('tag')}
                errorMessage={touched.tag && errors.tag && errors.tag}
              />
              <TextInput
                label="Nama Penerima"
                value={values.nameReceiver}
                onChangeText={handleChange('nameReceiver')}
                errorMessage={
                  touched.nameReceiver &&
                  errors.nameReceiver &&
                  errors.nameReceiver
                }
              />
              <TextInput
                label="No Ponsel"
                value={values.phoneReceiver}
                onChangeText={handleChange('phoneReceiver')}
                errorMessage={
                  touched.phoneReceiver &&
                  errors.phoneReceiver &&
                  errors.phoneReceiver
                }
                keyboardType="numeric"
              />
              <View style={styles.rowdef}>
                <Text size={12} style={styles.def}>
                  Jadikan Alamat Utama?
                </Text>
                <Switch
                  value={values.isMain}
                  onValueChange={value => setFieldValue('isMain', value)}
                />
              </View>
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

export default TambahAlamat;
