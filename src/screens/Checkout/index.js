import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, ScrollView, View} from 'react-native';
import {Button, Card, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {useSelector, useDispatch} from 'react-redux';
import {_fetch} from '../../redux/actions/global';
import {CheckoutServices} from '../../services';
import {sizes} from '../../utils';
import {ActivityIndicator} from 'react-native-paper';
import {Icon, Image} from 'react-native-elements';
import {currencyFormat, getPriceDiskon} from '../../helpers';

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

const Checkout = ({navigation, route}) => {
  const {prevPayload} = route.params;
  console.log(prevPayload);
  const {address} = useSelector(state => state.profile);
  const [selectedAddress, setSelectedAddress] = useState(
    address.filter(res => res.isMain == 1)[0],
  );
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  console.log(selectedAddress);
  const dispatch = useDispatch();

  const clickAction = async () => {
    await dispatch(
      _fetch(CheckoutServices.createCheckout(payload), false),
    ).then(res => {
      if (res) {
        navigation.navigate('PembayaranDetail', {result: res.data});
      }
    });
  };

  const totalBelanja = () => {
    if (prevPayload.item) {
      return prevPayload.item.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    return 0;
  };

  const renderItem = ({item, index}) => {
    return (
      <Card style={{margin: sizes.ten}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: JSON.parse(item.product.images)[0]}}
              style={{
                width: sizes.twentyFive * 3,
                height: sizes.twentyFive * 3,
                // borderRadius: 8,
                // backgroundColor: 'red',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              placeholderStyle={{backgroundColor: colors.white}}
              PlaceholderContent={
                <ActivityIndicator color={colors.red} size={sizes.fifTeen} />
              }
              resizeMode="contain"
            />
          </View>
          <View style={{padding: sizes.ten, flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                size={sizes.font14}
                type="Regular"
                style={{flex: 1}}
                numberOfLines={2}>
                {item.product.nameProduct}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: sizes.ten,
              }}>
              <Text size={sizes.font12} style={{marginHorizontal: 10}}>
                x{item.qty}
              </Text>
              <View>
                {item.product.discount > 0 && (
                  <Text color={colors.black} type="Bold" size={sizes.font12}>
                    {currencyFormat(
                      getPriceDiskon(item.product.discount, item.product.price),
                    )}
                  </Text>
                )}
                <Text
                  style={
                    item.product.discount > 0
                      ? {
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid',
                          // marginBottom: sizes.five,
                          // marginHorizontal: sizes.ten,
                        }
                      : {}
                  }
                  color={item.product.discount > 0 ? colors.gray : colors.black}
                  size={item.product.discount > 0 ? sizes.font10 : sizes.font12}
                  type={item.product.discount > 0 ? 'Regular' : 'Bold'}>
                  {currencyFormat(parseInt(item.product.price))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <>
      <Header title="Checkout" center bg={colors.bg} bold />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text type="SemiBold" size={sizes.font14}>
          Alamat Pengiriman
        </Text>
        <Card style={{padding: sizes.fifTeen}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text type="SemiBold" size={sizes.font12}>
                {selectedAddress.nameReceiver}{' '}
              </Text>
              <Text type="Regular" size={sizes.font12}>
                ({selectedAddress.tag})
              </Text>
            </View>
            <Text
              color={colors.red}
              size={sizes.font12}
              onPress={() => navigation.navigate('PilihAlamat')}>
              Ganti Alamat
            </Text>
          </View>
          <Text type="Light" size={sizes.font12}>
            {selectedAddress.phoneReceiver}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text size={sizes.font12} style={{flex: 1}} align="justify">
              {selectedAddress.address}, {selectedAddress.cityName},{' '}
              {selectedAddress.provinceName}, {selectedAddress.zipcode}
            </Text>
          </View>
        </Card>
        <Text type="SemiBold" size={sizes.font14}>
          Produk
        </Text>
        <FlatList
          data={prevPayload.item}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={{
            paddingVertical: sizes.five,
            paddingHorizontal: sizes.five,
            paddingTop: 0,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 0,
            marginHorizontal: -sizes.fifTeen,
          }}
        />
        <Text type="SemiBold" size={sizes.font14}>
          Metode Pembayaran
        </Text>
        <Card style={{padding: sizes.fifTeen}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {selectedPayment ? (
              <Text size={sizes.font12}>Go-Pay</Text>
            ) : (
              <Text size={sizes.font12}>Pilih Metode Pembayaran</Text>
            )}
            <Icon type="material-community" name="chevron-right" />
          </View>
        </Card>
        <Text type="SemiBold" size={sizes.font14}>
          Kurir
        </Text>
        <Card style={{padding: sizes.fifTeen, marginBottom: sizes.twenty}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {setSelectedCourier ? (
              <Text size={sizes.font12}>JNE REG</Text>
            ) : (
              <Text size={sizes.font12}>Pilih Kurir</Text>
            )}
            <Icon type="material-community" name="chevron-right" />
          </View>
        </Card>
      </ScrollView>
      <View style={[styles.container, {flex: 0}]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text size={sizes.font12} color={colors.gray}>
            Belanja :{' '}
          </Text>
          <Text type="SemiBold" size={sizes.font12}>
            {currencyFormat(totalBelanja())}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: sizes.five,
          }}>
          <Text size={sizes.font12} color={colors.gray}>
            Ongkos Kirim :{' '}
          </Text>
          <Text type="SemiBold" size={sizes.font12}>
            {currencyFormat(20000)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: sizes.five,
          }}>
          <Text size={sizes.font12} color={colors.gray}>
            Total Belanja :{' '}
          </Text>
          <Text type="SemiBold" size={sizes.font12}>
            {currencyFormat(totalBelanja() + 20000)}
          </Text>
        </View>
        {/* <Text>{JSON.stringify(payload)}</Text> */}
        <Button title="Buat Pesanan" onPress={() => clickAction()} rounded />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: sizes.fifTeen,
  },
});

export default Checkout;
