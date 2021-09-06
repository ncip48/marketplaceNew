import React from 'react';
import {TouchableOpacity, Image, StyleSheet, View} from 'react-native';
import CustomText from './CustomText';
import {useNavigation} from '@react-navigation/native';
import {currencyFormat, formatNumber, getPriceDiskon} from '../helpers';
import sizes from '../utils/size';
import {RFPercentage} from 'react-native-responsive-fontsize';
import colors from '../utils/colors';

const ListProduct = ({data, terlaris}) => {
  const navigation = useNavigation();
  const navigate = (to, payload) => e => navigation.navigate(to, payload);
  const {images, nameProduct, price, discount, countBuy, qtyBuy} = data;
  // const countBuy = 11000;
  return (
    <TouchableOpacity
      onPress={navigate('DetailProduk', {
        item: data,
      })}
      style={styles.wrapper}
      activeOpacity={1}>
      {data.discount != 0 && (
        <CustomText
          style={{
            position: 'absolute',
            zIndex: 1,
            backgroundColor: colors.red,
            paddingHorizontal: 5,
            paddingTop: 2,
            borderRadius: 99,
            top: 8,
            left: 8,
          }}
          color={colors.white}
          type="SemiBold"
          size={sizes.font12}>
          -{data.discount}%
        </CustomText>
      )}
      <Image
        style={styles.image}
        source={{
          uri: JSON.parse(images)[0],
        }}
        resizeMode="contain"
      />
      <View style={styles.containerTitle}>
        <CustomText
          style={styles.title}
          // type="SemiBold"
          color="#000"
          numberOfLines={2}
          size={sizes.font14}>
          {/* {nameProduct.length > 15
          ? nameProduct.substring(0, 15) + '...'
          : nameProduct} */}
          {nameProduct}
        </CustomText>
        <View>
          {discount > 0 && (
            <CustomText
              // style={{marginBottom: sizes.five, marginRight: -5}}
              style={{marginHorizontal: sizes.ten, marginBottom: -2}}
              // color="#cc0000"
              color={colors.black}
              type="Bold"
              size={sizes.font12}>
              {currencyFormat(getPriceDiskon(discount, price))}
            </CustomText>
          )}
          <CustomText
            style={discount > 0 ? styles.priceStrike : styles.price}
            color={discount > 0 ? colors.gray : colors.black}
            size={discount > 0 ? sizes.font10 : sizes.font12}
            type={discount > 0 ? 'Regular' : 'Bold'}>
            {discount > 0
              ? currencyFormat(parseInt(price))
              : currencyFormat(parseInt(price))}
          </CustomText>
        </View>
        {terlaris && (
          <CustomText
            style={{marginBottom: sizes.five, marginHorizontal: sizes.ten}}
            color={colors.grey}
            size={sizes.font12}>
            Terjual{' '}
            {qtyBuy > 1000 ? String(qtyBuy).slice(0, 2) + ' rb' : qtyBuy}
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // elevation: 3,
    margin: 5,
    marginTop: 0,
    marginBottom: 0,
    height: RFPercentage(35),
  },
  wrapperMulti: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    margin: sizes.ten,
  },
  image: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    borderRadius: 5,
    // height: RFPercentage(25),
    // backgroundColor: 'red',
    // width: '100%',
    width: RFPercentage(20),
    overflow: 'hidden',
  },
  title: {
    marginTop: sizes.five,
    marginHorizontal: sizes.ten,
  },
  price: {
    marginBottom: sizes.five,
    marginHorizontal: sizes.ten,
  },
  priceStrike: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginBottom: sizes.five,
    marginHorizontal: sizes.ten,
  },
  containerTitle: {flex: 1, width: RFPercentage(20)},
});

export default ListProduct;
