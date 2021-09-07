import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  FlatList,
  ScrollView,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {BottomSheet, Button, Card, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {useSelector, useDispatch} from 'react-redux';
import {_fetch} from '../../redux/actions/global';
import {CheckoutServices} from '../../services';
import {sizes} from '../../utils';
import {ActivityIndicator} from 'react-native-paper';
import {Icon, Image} from 'react-native-elements';
import {
  currencyFormat,
  getCourierImage,
  getPriceDiskon,
  isEmptyArray,
} from '../../helpers';
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import {Divider} from 'react-native-elements/dist/divider/Divider';

const courierTemp = [
  {
    code: 'jne',
    name: 'JNE',
  },
  {
    code: 'pos',
    name: 'POS',
  },
  {
    code: 'tiki',
    name: 'Tiki',
  },
  {
    code: 'jnt',
    name: 'JNT',
  },
  {
    code: 'sicepat',
    name: 'Sicepat',
  },
  {
    code: 'anteraja',
    name: 'Anteraja',
  },
  {
    code: 'sap',
    name: 'SAP Express',
  },
];

const Checkout = ({navigation, route}) => {
  const {prevPayload} = route.params;
  console.log(prevPayload);
  const sheetCourierRef = React.useRef();
  const {address} = useSelector(state => state.profile);
  const [selectedAddress, setSelectedAddress] = useState(
    address.filter(res => res.isMain == 1)[0],
  );
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  console.log(selectedAddress);
  const dispatch = useDispatch();

  const clickAction = async () => {
    const payload = {};
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
                  <Text color={colors.black} type="Regular" size={sizes.font12}>
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
                  type={item.product.discount > 0 ? 'Regular' : 'Regular'}>
                  {currencyFormat(parseInt(item.product.price))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  console.log(selectedCourier);

  return (
    <>
      <Header title="Checkout" center bg={colors.bg} bold />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text type="SemiBold" size={sizes.font14}>
          Alamat Pengiriman
        </Text>
        <Card style={{padding: sizes.fifTeen, marginHorizontal: 1}}>
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
            marginHorizontal: -sizes.fifTeen + 1,
          }}
        />
        <Text type="SemiBold" size={sizes.font14}>
          Metode Pembayaran
        </Text>
        <Card style={{padding: sizes.fifTeen, marginHorizontal: 1}}>
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
        <Card
          style={{
            padding: sizes.fifTeen,
            marginBottom: sizes.twenty,
            marginHorizontal: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {isEmptyArray(selectedCourier) ? (
              <Text size={sizes.font12}>Pilih Kurir</Text>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={{uri: getCourierImage(selectedCourier.code)}}
                  style={{
                    height: sizes.twentyFive * 1.5,
                    width: sizes.thirtyFive * 1.5,
                    marginRight: sizes.twenty,
                  }}
                  resizeMode="contain"
                  placeholderStyle={{backgroundColor: colors.white}}
                  PlaceholderContent={
                    <ActivityIndicator
                      color={colors.red}
                      size={sizes.fifTeen}
                    />
                  }
                />
                <Text size={sizes.font12}>{selectedCourier.name}</Text>
              </View>
            )}
            <Icon
              type="material-community"
              name="chevron-right"
              onPress={() => sheetCourierRef.current.open()}
            />
          </View>
        </Card>
      </ScrollView>
      <View style={[styles.container, {flex: 0, paddingVertical: sizes.ten}]}>
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
            marginTop: sizes.five / 2,
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
            marginVertical: sizes.five / 2,
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
      <BottomSheet
        ref={sheetCourierRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        topBarStyle={{
          width: sizes.thirtyFive,
          height: sizes.five,
          borderRadius: 2.5,
        }}
        // height={Dimensions.get('screen').height / 1.5}
        height={ResponsiveScreen.normalize(400)}
        closeOnHardwareBack={true}
        sheetStyle={{borderRadius: sizes.fifTeen}}>
        <View style={{padding: sizes.ten}}>
          <View>
            <FlatList
              data={courierTemp}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              style={{
                paddingVertical: sizes.five,
                paddingHorizontal: sizes.five,
                paddingTop: 0,
              }}
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: sizes.fifTeen,
              }}
              renderItem={({item, index}) => {
                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => {
                        setSelectedCourier(item);
                        sheetCourierRef.current.close();
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: sizes.five,
                      }}>
                      <Image
                        source={{uri: getCourierImage(item.code)}}
                        style={{
                          height: sizes.twentyFive * 1.5,
                          width: sizes.thirtyFive * 1.5,
                          marginRight: sizes.thirty,
                        }}
                        resizeMode="contain"
                        placeholderStyle={{backgroundColor: colors.white}}
                        PlaceholderContent={
                          <ActivityIndicator
                            color={colors.red}
                            size={sizes.fifTeen}
                          />
                        }
                      />
                      <Text size={sizes.font12} type="SemiBold">
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    <Divider />
                  </>
                );
              }}
            />
          </View>
          {/* <Button style={{bottom: 0}} title="Pilih" rounded /> */}
        </View>
      </BottomSheet>
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
