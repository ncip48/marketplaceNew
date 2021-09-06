import React, {useState} from 'react';
import {
  StyleSheet,
  FlatList,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {View} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {Button, Header, Text, TextInput} from '../../components';
import colors from '../../utils/colors';
import {Icon} from 'react-native-elements';
import sizes from '../../utils/size';
import {deleteAddress, updateAddress} from '../../redux/actions/profile';

const EditAlamat = ({navigation, route}) => {
  const {item} = route.params;
  const {params} = route;
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const userInfo = useSelector(state => state.auth.userInfo);

  const addAddress = payload => {
    const province = params.province
      ? params.province.split('#')[0]
      : payload.province.split('#')[0];
    const provinceName = params.province
      ? params.province.split('#')[1]
      : payload.province.split('#')[1];
    const city = params.city
      ? params.city.split('#')[0]
      : payload.city.split('#')[0];
    const cityName = params.city
      ? params.city.split('#')[1]
      : payload.city.split('#')[1];
    const isMain = payload.isMain ? 1 : 0;
    const zipcode = parseInt(payload.zipcode);
    const isDeleted = payload.isDeleted;

    dispatch(
      _fetch(
        ProfileServices.editAddress(
          {
            ...payload,
            province,
            city,
            provinceName,
            cityName,
            isMain,
            zipcode,
            isDeleted,
          },
          item.id,
        ),
      ),
    ).then(res => {
      if (res) {
        dispatch(updateAddress(res.data));
        navigation.goBack();
      }
    });
  };

  const handleRemove = () => {
    let id = item.id;
    dispatch(_fetch(ProfileServices.deleteAddress(id), false)).then(res => {
      if (res) {
        dispatch(deleteAddress(id));
        navigation.goBack();
      }
    });
  };

  return (
    <>
      <Header title="Edit Alamat" center shadow />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Formik
          initialValues={{
            address: item.address,
            province: item.province + '#' + item.provinceName,
            city: item.city + '#' + item.cityName,
            zipcode: item.zipcode.toString(),
            tag: item.tag,
            nameReceiver: item.nameReceiver,
            phoneReceiver: item.phoneReceiver,
            isMain: item.isMain == 1 ? true : false,
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
            setFieldTouched,
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
                  navigation.navigate('PilihProvinsi', {
                    source: 'EditAlamat',
                    item,
                  })
                }>
                <TextInput
                  label="Pilih Provinsi"
                  editable={false}
                  value={
                    params?.province
                      ? params.province.split('#')[1]
                      : values.province.split('#')[1]
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
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate('PilihKota', {
                    province_id: params?.province
                      ? params?.province.split('#')[0]
                      : values.province.split('#')[0],
                    source: 'EditAlamat',
                    province: params?.province ?? values.province,
                    item: item,
                  })
                }>
                <TextInput
                  label="Pilih Kota"
                  editable={false}
                  value={
                    params?.city
                      ? params.city.split('#')[1]
                      : values.city.split('#')[1]
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
              <View>
                <Button
                  title="Hapus Alamat"
                  // loading={isLoading}
                  // disabled={isLoading}
                  style={[styles.btn, {marginBottom: sizes.five}]}
                  onPress={() => handleRemove()}
                  // border
                  rounded
                  bg={colors.white}
                  color={colors.red}
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
              </View>
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

export default EditAlamat;
