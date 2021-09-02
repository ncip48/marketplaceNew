import React, {useState, useEffect} from 'react';
import {StyleSheet, FlatList, Dimensions} from 'react-native';
import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {ProfileServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {Divider, Icon, CheckBox} from 'react-native-elements';
import {Button, Header, Text} from '../../components';
import colors from '../../utils/colors';
import {Image} from 'react-native';
import {currencyFormat} from '../../helpers';
import {setProfileState} from '../../redux/actions/profile';
import {useFocusEffect} from '@react-navigation/native';

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

  const subtotalCount = () => {
    if (cart) {
      return cart.reduce(
        (sum, item) => sum + (item.checked == 1 ? item.checked : 0),
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
      <View>
        {index !== 0 ? null : (
          <Divider style={{height: 3, backgroundColor: colors.softgrey}} />
        )}
        <View style={[styles.rowUp, {margin: 10}]}>
          <View style={styles.row}>
            <CheckBox
              checked={item.checked == 1 ? true : false}
              value={item.checked == 1 ? true : false}
              onPress={() => selectHandler(index, item.checked)}
              onValueChange={() => selectHandler(index, item.checked)}
              style={{marginRight: 10}}
            />
            <Image
              source={{uri: JSON.parse(item.product.images)[0]}}
              style={styles.img}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <Text size={10}>{item.product.nameProduct}</Text>
            <View style={styles.row}>
              {item.product.discount > 0 && (
                <>
                  <Text
                    size={10}
                    style={styles.txtDiscount}
                    color={colors.white}>
                    {item.product.discount} %
                  </Text>
                  <Text size={10} style={styles.delText} color={colors.grey}>
                    {currencyFormat(item.product.price)}
                  </Text>
                </>
              )}
              <Text size={10} type="SemiBold">
                {item.product.discount > 0
                  ? currencyFormat(
                      item.product.price -
                        (item.product.discount / 100) * item.product.price,
                    )
                  : currencyFormat(item.product.price)}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.rowSpace, {margin: 10}]}>
          <Text size={8} color={colors.green}>
            Tulis catatan untuk barang ini
          </Text>
          <View style={styles.row}>
            <Icon
              type="feather"
              name="trash-2"
              size={15}
              containerStyle={{marginRight: 10}}
            />
            <Text
              size={11}
              style={[
                styles.qty,
                {borderColor: item.qty > 1 ? colors.green : colors.softgrey},
              ]}
              align="center"
              type="SemiBold"
              color={item.qty > 1 ? colors.green : colors.softgrey}>
              -
            </Text>
            <Text size={10} style={{marginHorizontal: 10}}>
              {item.qty}
            </Text>
            <Text
              size={11}
              style={styles.qty}
              align="center"
              type="SemiBold"
              color={colors.green}>
              +
            </Text>
          </View>
        </View>
        {/* {index<Divider style={{height: 3, backgroundColor: colors.softgrey}} />. */}
        {cart.length - 1 == index ? null : (
          <Divider style={{height: 3, backgroundColor: colors.softgrey}} />
        )}
      </View>
    );
  };

  return (
    <>
      <Header
        title="Keranjang"
        right={
          <Icon type="material-community" name="heart" color={colors.grey} />
        }
      />
      <View style={styles.container}>
        <View style={[styles.row, styles.top]}>
          <CheckBox
            checked={selectAll}
            value={selectAll}
            onPress={() => selectHandlerAll(selectAll)}
            onValueChange={() => selectHandlerAll(selectAll)}
            style={{marginRight: 10}}
          />
          <Text size={10}>Pilih Semua</Text>
        </View>
        <FlatList
          data={cart}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onRefresh={() => onRefresh()}
          refreshing={isLoading}
        />
      </View>
      <View style={styles.footer}>
        <View style={{flex: 1}}>
          <Text size={10}>Total Harga</Text>
          <Text size={12} type="SemiBold">
            {currencyFormat(subtotalPrice())}
          </Text>
        </View>
        <Button
          borderbg
          title={`Beli (${subtotalCount()})`}
          bg={colors.green}
          color={colors.white}
          style={{width: (33 / 100) * Dimensions.get('screen').width - 15}}
          onPress={() => addCart(result.product.id)}
          // loading={loadingCart}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
