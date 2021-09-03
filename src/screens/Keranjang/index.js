import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, Dimensions} from 'react-native';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {Divider, Icon, CheckBox, Image} from 'react-native-elements';
import {Button, Card, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {currencyFormat, getPriceDiskon} from '../../helpers';
import {setProfileState} from '../../redux/actions/profile';
import {useFocusEffect} from '@react-navigation/native';
import {sizes} from '../../utils';
import {ActivityIndicator} from 'react-native-paper';

const Keranjang = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const {cart} = useSelector(state => state.profile);
  // const [cart, setCart] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // getCart();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // makeRequest();
      getCart();
    }, []),
  );

  const selectHandler = (index, value) => {
    const newItems = [...cart]; // clone the array
    newItems[index]['checked'] = value == 1 ? 0 : 1; // set the new value
    // console.log(newItems);
    // setCart(newItems);
    dispatch(setProfileState('cart', newItems));
  };

  const getCart = () => {
    dispatch(_fetch(ProfileServices.getCart(), false)).then(res => {
      if (res) {
        dispatch(setProfileState('cart', res.data));
      }
    });
  };

  const onRefresh = () => {
    getCart();
  };

  const subtotalPrice = () => {
    if (cart) {
      return cart.reduce(
        (sum, item) => sum + (item.checked == 1 ? item.totalPrice : 0),
        0,
      );
    }
    return 0;
  };

  console.log(cart);

  const subtotalCount = () => {
    if (cart) {
      return cart.reduce(
        (sum, item) => sum + (item.checked == 1 ? item.qty : 0),
        0,
      );
    }
    return 0;
  };

  const selectHandlerAll = value => {
    const newItems = [...cart]; // clone the array
    newItems.map((item, index) => {
      newItems[index]['checked'] = value == true ? 0 : 1; // set the new value
    });
    // this.setState({ cartItems: newItems, selectAll: (value == true ? false : true) }); // set new state
    setCart(newItems);
    setSelectAll(value == true ? false : true);
  };

  const renderItem = ({item, index}) => {
    return (
      <Card style={{margin: sizes.ten}}>
        <View style={[styles.row]}>
          <View style={styles.row}>
            <CheckBox
              checked={item.checked == 1 ? true : false}
              value={item.checked == 1 ? true : false}
              onPress={() => selectHandler(index, item.checked)}
              onValueChange={() => selectHandler(index, item.checked)}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="red"
              style={{padding: 0, margin: 0}}
              containerStyle={{
                padding: 0,
                margin: 0,
                paddingHorizontal: 0,
              }}
              wrapperStyle={{padding: 0, margin: 0}}
            />
            <Image
              source={{uri: JSON.parse(item.product.images)[0]}}
              style={{
                width: sizes.twentyFive * 3,
                height: sizes.twentyFive * 3,
                // borderRadius: 8,
                // backgroundColor: 'red',
              }}
              placeholderStyle={{backgroundColor: colors.white}}
              PlaceholderContent={
                <ActivityIndicator color={colors.red} size={sizes.fifTeen} />
              }
              resizeMode="stretch"
            />
          </View>
          <View style={{padding: sizes.ten, flex: 1}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text size={sizes.font14} type="Regular" style={{flex: 1}}>
                {item.product.nameProduct}
              </Text>
              <Icon
                type="material-community"
                name="close"
                size={sizes.twenty}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: sizes.ten,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon
                  size={sizes.twenty}
                  type="material-community"
                  name="minus-circle-outline"
                />
                <Text size={sizes.font12} style={{marginHorizontal: 10}}>
                  {item.qty}
                </Text>
                <Icon
                  size={sizes.twenty}
                  type="material-community"
                  name="plus-circle-outline"
                />
              </View>
              <View>
                {item.product.discount > 0 && (
                  <Text
                    color={colors.black}
                    type="Bold"
                    align="right"
                    size={sizes.font12}>
                    {currencyFormat(
                      getPriceDiskon(item.product.discount, item.product.price),
                    )}
                  </Text>
                )}
                <Text
                  align="right"
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
                  {item.product.discount > 0
                    ? currencyFormat(parseInt(item.product.price))
                    : currencyFormat(parseInt(item.product.price))}
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
      <Header noBack bg={colors.bg} />
      <View style={styles.container}>
        <View style={{paddingHorizontal: sizes.fifTeen}}>
          <Text size={sizes.twentyFive} type="SemiBold">
            Keranjang
          </Text>
        </View>
        <FlatList
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={() => onRefresh()}
          refreshing={false}
          style={{
            paddingVertical: sizes.five,
            paddingHorizontal: sizes.five,
            paddingTop: 0,
          }}
          ListFooterComponent={
            <View
              style={{
                paddingHorizontal: sizes.fifTeen,
                paddingVertical: sizes.ten,
                // backgroundColor: colors.white,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: sizes.ten,
                }}>
                <Text size={sizes.font12} color={colors.gray}>
                  Total Harga:{' '}
                </Text>
                <Text size={sizes.font12}>
                  {currencyFormat(subtotalPrice())}
                </Text>
              </View>
              <Button
                borderbg
                title={`Checkout (${subtotalCount()})`}
                bg={colors.red}
                color={colors.white}
                onPress={() => addCart(result.product.id)}
                // loading={loadingCart}
                rounded
              />
            </View>
          }
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  img: {
    height: 75,
    width: 75,
    overflow: 'hidden',
    borderRadius: 5,
  },
  txtDiscount: {
    borderRadius: 3,
    paddingHorizontal: 5,
    backgroundColor: colors.grey,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowUp: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rowSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  delText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 5,
  },
  footer: {
    marginTop: 1,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowColor: '#000000',
    elevation: 4,

    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 15,
  },
  top: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 4,
    margin: 10,
  },
  qty: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Keranjang;
