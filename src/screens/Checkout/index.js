import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View} from 'react-native';
import {Button, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {useSelector, useDispatch} from 'react-redux';
import {_fetch} from '../../redux/actions/global';
import {CheckoutServices} from '../../services';

const payload = {
  items: [
    {
      id: '6',
      nameProduct: 'Corsair HX1200',
      qty: '1',
      price: 4320000,
      discount: 20,
    },
  ],
  bank: null,
  type: 'gopay',
  total: 4320000,
  ongkir: 216000,
  courier: 'jne REG',
  address: 5,
};

const Checkout = ({navigation}) => {
  const dispatch = useDispatch();

  const clickAction = async () => {
    await dispatch(
      _fetch(CheckoutServices.createCheckout(payload), false),
    ).then((res) => {
      if (res) {
        navigation.navigate('PembayaranDetail', {result: res.data});
      }
    });
  };

  return (
    <>
      <Header title="Checkout" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 15,
        }}>
        <Text>{JSON.stringify(payload)}</Text>
        <Button title="Checkout" onPress={() => clickAction()} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default Checkout;
