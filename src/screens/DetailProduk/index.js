import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, Image} from 'react-native';
import {View} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import ImageScroll from './ImageScroll';
import {BottomSheet, Button, Header, Text, ErrorSheet} from '../../components';
import colors from '../../utils/colors';
import {ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {HomeServices, ProductServices} from '../../services';
import {_fetch, _fetch_noerror} from '../../redux/actions/global';
import {actualQty, currencyFormat, Toaster} from '../../helpers';
import {baseRequest, generateHeaders} from '../../services/config';
import {TouchableOpacity} from 'react-native';
import {Dimensions} from 'react-native';
import {StatusBar} from 'react-native';
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import sizes from '../../utils/size';

const DetailProduk = ({route, navigation}) => {
  const {item} = route.params;
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const dispatch = useDispatch();
  const sheetRef = React.useRef();
  const sheetCartRef = React.useRef();
  const [result, setResult] = useState(null);
  const [expand, setExpand] = useState(false);
  const [show, setShow] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [isFavorit, setIsFavorit] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    dispatch(_fetch(ProductServices.getDetailProduct(item.id))).then(res => {
      if (res) {
        setIsFavorit(res.data.isFavourite);
        setResult(res.data);
      }
    });
  }, []);

  // const getProduct = () => {
  //   dispatch(_fetch(ProductServices.getDetailProduct(item.id), false)).then(
  //     (res) => {
  //       if (res) {
  //         // console.log('is favorit', res.data);
  //         // setIsFavorit(res.data.isFavourite);
  //         setResult(res.data);
  //       }
  //     },
  //   );
  // };

  const removeFavorite = id => {
    dispatch(_fetch(ProductServices.removeFavoriteByProduct(id), false)).then(
      res => {
        if (res) {
          setIsFavorit(false);
          Toaster(res.message);
        }
      },
    );
  };

  const addFavorite = id => {
    dispatch(_fetch(ProductServices.addFavorite({productId: id}), false)).then(
      res => {
        if (res) {
          setIsFavorit(true);
          Toaster(res.message);
        }
      },
    );
  };

  const addCart = id => {
    setLoadingCart(true);
    dispatch(_fetch_noerror(ProductServices.addCart({qty: 1}, id), false)).then(
      res => {
        setLoadingCart(false);
        if (res.status != 200) {
          return setIsError(true), setErrorMsg(res.error);
        }
        sheetCartRef.current.open();
      },
    );
  };

  return (
    <>
      <Header
        title="Detail Produk"
        searchbar
        right={
          <View style={styles.row}>
            <Icon
              type="material-community"
              name="share-variant"
              color={colors.grey}
              size={23}
            />
            <View style={{marginHorizontal: 15}}>
              <Icon
                type="material-community"
                name="cart"
                color={colors.grey}
                size={23}
              />
            </View>
            <Icon
              type="material-community"
              name="dots-vertical"
              color={colors.grey}
              size={23}
            />
          </View>
        }
        shadow
      />
      {isLoading || !result ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageScroll data={result.product.images} />
            <View style={styles.wrapperItem}>
              <View style={styles.rowSpace}>
                <View>
                  <Text size={14} type="SemiBold">
                    {result.product.discount > 0
                      ? currencyFormat(
                          result.product.price -
                            (result.product.discount / 100) *
                              result.product.price,
                        )
                      : currencyFormat(result.product.price)}
                  </Text>
                  {result.product.discount > 0 && (
                    <View style={styles.row}>
                      <Text
                        size={sizes.font12}
                        color={colors.white}
                        style={styles.txtDiscount}>
                        {result.product.discount}%
                      </Text>
                      <Text
                        size={sizes.font12}
                        color={colors.grey}
                        style={styles.delText}>
                        {currencyFormat(result.product.price)}
                      </Text>
                    </View>
                  )}
                  <Text size={sizes.font12}>{result.product.nameProduct}</Text>
                </View>
                <Icon
                  type="material-community"
                  name={isFavorit ? 'heart' : 'heart-outline'}
                  onPress={
                    isFavorit
                      ? () => removeFavorite(result.product.id)
                      : () => addFavorite(result.product.id)
                  }
                  color={colors.green}
                />
              </View>
            </View>
            {result.shipping.destination == null ? (
              <View style={styles.wrapperItem}>
                <View style={styles.rowSpace}>
                  <View>
                    <Text type="SemiBold" size={sizes.font14}>
                      Kurir
                    </Text>
                    <Text size={sizes.font12} color={colors.grey}>
                      Atur alamat untuk melihat ongkos kirim
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate('DaftarAlamat')}>
                    <Icon type="material-community" name="chevron-right" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.wrapperItem}>
                <View style={styles.rowSpace}>
                  <View>
                    <Text type="SemiBold" size={sizes.font14}>
                      Kurir
                    </Text>
                    <Text size={sizes.font12} color={colors.grey}>
                      Ongkos kirim mulai dari{' '}
                      {currencyFormat(
                        result.shipping.details[0].costs[0].cost[0].value,
                      )}
                    </Text>
                    <Text size={sizes.font12} color={colors.grey}>
                      Ke{' '}
                      <Text
                        size={sizes.font12}
                        color={colors.grey}
                        type="SemiBold">
                        {result.shipping.destination.city}
                      </Text>
                    </Text>
                  </View>
                  <Icon
                    type="material-community"
                    name="chevron-right"
                    onPress={() => sheetRef.current.open()}
                  />
                </View>
              </View>
            )}
            <View style={styles.wrapperItem}>
              <Text type="SemiBold" size={sizes.font14}>
                Informasi Produk
              </Text>
              <View style={styles.rowSpace}>
                <Text size={sizes.font12}>Berat</Text>
                <Text size={sizes.font12} color={colors.grey}>
                  {result.product.weight > 1000
                    ? result.product.weight / 1000 + ' kg'
                    : result.product.weight + ' gram'}
                </Text>
              </View>
              <View style={styles.rowSpace}>
                <Text size={sizes.font12}>Stok</Text>
                <Text size={sizes.font12} color={colors.grey}>
                  {actualQty(result.product.stock, result.product.qtyBuy)} buah
                </Text>
              </View>
              <View style={styles.rowSpace}>
                <Text size={sizes.font12}>Kategori</Text>
                <Text size={sizes.font12} color={colors.green}>
                  {result.product.category.name}
                </Text>
              </View>
              <View style={styles.rowSpace}>
                <Text size={sizes.font12}>Brand</Text>
                <View style={styles.rowSpace}>
                  <Image
                    source={{uri: result.product.brand.image}}
                    style={styles.brandLogo}
                    resizeMode="contain"
                  />
                  <Text size={sizes.font12} color={colors.grey}>
                    {result.product.brand.name}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.wrapperItem}>
              <Text type="SemiBold" size={sizes.font14}>
                Deskripsi Produk
              </Text>
              {!expand ? (
                <Text
                  size={sizes.font12}
                  color={colors.grey}
                  numberOfLines={expand ? null : 5}
                  style={{lineHeight: 25, whiteSpace: 'pre-wrap'}}
                  align="justify">
                  {result.product.description.split('\\n').map(i => {
                    return i;
                  })}
                </Text>
              ) : (
                result.product.description.split('\\n').map((i, key) => {
                  return (
                    <Text
                      size={sizes.font12}
                      color={colors.grey}
                      // numberOfLines={expand ? null : 3}
                      style={{lineHeight: 25, whiteSpace: 'pre-wrap'}}
                      align="justify">
                      {i}
                    </Text>
                  );
                })
              )}
              <Text
                size={sizes.font12}
                style={{marginTop: sizes.fifTeen}}
                type="Bold"
                color={colors.green}
                onPress={() => setExpand(!expand)}>
                {expand ? 'Lihat Sedikit' : 'Lihat Lainnya'}
              </Text>
            </View>
          </ScrollView>
          {result.shipping.destination !== null && (
            <BottomSheet
              ref={sheetRef}
              // height={Dimensions.get('screen').height / 2}
              closeOnDragDown={true}
              closeOnPressMask={true}
              topBarStyle={{
                width: sizes.thirtyFive,
                height: 5,
                borderRadius: 2.5,
              }}
              closeOnHardwareBack={true}
              // backDropStyle={{elevation: 5}}
              sheetStyle={{borderRadius: sizes.fifTeen}}>
              <View style={{padding: sizes.fifTeen}}>
                {/* <View style={styles.close}>
                  <Text
                    align="center"
                    size={12}
                    onPress={() => sheetRef.current.close()}
                    type="Bold">
                    X
                  </Text>
                </View> */}
                <View style={[styles.rowSpace, {marginBottom: sizes.ten}]}>
                  <View>
                    <Text size={sizes.font12} color={colors.grey}>
                      Dikirim dari:
                    </Text>
                    <Text size={sizes.font12}>
                      {result.shipping.from.city},{' '}
                      {result.shipping.from.province}
                    </Text>
                  </View>
                  <View>
                    <Text size={sizes.font12} color={colors.grey} align="right">
                      Berat:
                    </Text>
                    <Text size={sizes.font12} align="right">
                      {result.product.weight} gram
                    </Text>
                  </View>
                </View>
                <Text size={sizes.font12} type="SemiBold">
                  {result.shipping.destination.nameReceiver}
                </Text>
                <Text size={sizes.font12}>
                  {result.shipping.destination.phoneReceiver}
                </Text>
                <Text size={sizes.font12} align="justify">
                  {result.shipping.destination.address},{' '}
                  {result.shipping.destination.city},{' '}
                  {result.shipping.destination.province},{' '}
                  {result.shipping.destination.zipcode}
                </Text>
                <View style={styles.txtBottomMid}>
                  <View style={styles.row}>
                    <View style={styles.dot} />
                    <Text size={sizes.font12}>
                      Ongkos kirim akan dihitung di halaman checkout
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.dot} />
                    <Text size={sizes.font12}>
                      Perkiraan durasi dihitung sejak barang diserahkan ke kurir
                    </Text>
                  </View>
                </View>
                {result.shipping.details.map((item, index, arr) => {
                  return (
                    <>
                      <View
                        style={{
                          marginVertical: sizes.ten,
                          marginBottom: arr.length - 1 == index ? 0 : sizes.ten,
                        }}>
                        <Text size={sizes.font12} type="SemiBold">
                          {item.name}
                        </Text>
                        {item.costs.map((cost, i) => {
                          return (
                            <View style={styles.rowSpace}>
                              <Text size={sizes.font12}>
                                {cost.service} (
                                {cost.cost[0].etd.includes('HARI')
                                  ? cost.cost[0].etd.split(' ')[0]
                                  : cost.cost[0].etd}{' '}
                                hari)
                              </Text>
                              <Text size={sizes.font12} color={colors.grey}>
                                {currencyFormat(cost.cost[0].value)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                      {arr.length - 1 == index ? null : <Divider />}
                    </>
                  );
                })}
              </View>
            </BottomSheet>
          )}
          <BottomSheet
            ref={sheetCartRef}
            // height={Dimensions.get('screen').height / 2}
            closeOnDragDown={true}
            closeOnPressMask={false}
            topBarStyle={{
              width: sizes.thirtyFive,
              height: sizes.five,
              borderRadius: 2.5,
            }}
            height={ResponsiveScreen.normalize(160)}
            closeOnHardwareBack={true}
            // backDropStyle={{elevation: 5}}
            sheetStyle={{borderRadius: sizes.fifTeen}}>
            <View style={styles.wrapperBottomSheet}>
              {/* <Text
                align="left"
                size={14}
                type="Bold"
                onPress={() => sheetCartRef.current.close()}>
                X
              </Text> */}
              <View style={styles.cardCart}>
                <View style={styles.row}>
                  <Image
                    source={{uri: JSON.parse(result.product.images)[0]}}
                    style={{height: 40, width: 40, marginRight: sizes.ten}}
                    // resizeMode="contain"
                  />
                  <View>
                    <Text type="SemiBold" size={sizes.font14}>
                      Barang berhasil ditambahkan
                    </Text>
                    <Text color={colors.green} size={sizes.font12}>
                      Lihat Keranjang
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </BottomSheet>
          <ErrorSheet
            error={errorMsg}
            visible={isError}
            onDismiss={() => setIsError(false)}
          />
          <View style={styles.footer}>
            {/* <Button
              title="Beli Langsung"
              border
              bg={colors.white}
              color={colors.green}
              style={{
                width: (1 / 2) * Dimensions.get('screen').width - 15,
                marginRight: 10,
              }}
            /> */}
            <Button
              borderbg
              rounded
              title="Tambahkan ke Keranjang"
              // bg={colors.green}
              color={colors.white}
              // style={{width: (1 / 2) * Dimensions.get('screen').width - 15}}
              onPress={() => {
                addCart(result.product.id);
              }}
              loading={loadingCart}
              disabled={loadingCart}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.softgrey,
  },
  wrapperItem: {
    backgroundColor: colors.white,
    padding: sizes.fifTeen,
    marginBottom: sizes.ten,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginLeft: sizes.five,
  },
  txtDiscount: {
    borderRadius: 3,
    paddingHorizontal: sizes.five,
    backgroundColor: colors.green,
  },
  brandLogo: {
    height: sizes.fifTeen,
    width: sizes.thirty,
    marginRight: 7,
  },
  wrapperBottomSheet: {
    // height: Dimensions.get('screen').height - StatusBar.currentHeight,
    margin: sizes.fifTeen,
  },
  txtBottomMid: {
    padding: sizes.ten,
    marginTop: sizes.ten,
  },
  dot: {
    marginRight: sizes.ten,
    height: sizes.five,
    width: sizes.five,
    borderRadius: sizes.five,
    backgroundColor: colors.green,
    alignItems: 'center',
    marginBottom: 2,
  },
  close: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    backgroundColor: colors.white,
    height: sizes.twentyFive,
    width: sizes.twentyFive,
    borderRadius: sizes.thirty,
    marginBottom: sizes.ten,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    backgroundColor: colors.white,
    // flexDirection: 'row',
    // alignItems: 'center',
    padding: sizes.ten,
  },
  cardCart: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderRadius: sizes.five,
    marginTop: sizes.ten,
    backgroundColor: colors.white,
    padding: sizes.five,
  },
});

export default DetailProduk;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   StyleSheet,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Animated,
//   StatusBar,
//   Dimensions,
// } from 'react-native';
// import {Header, Icon, SearchBar} from 'react-native-elements';
// import {SliderBox} from 'react-native-image-slider-box';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
// import {useSelector, useDispatch} from 'react-redux';
// import {HomeServices, ProductServices} from '../../services';
// import {_fetch} from '../../redux/actions/global';
// import {Text, ListProduct, Masonry, ScaledImage} from '../../components';
// import {ScrollView} from 'react-native';
// import {RectButton} from 'react-native-gesture-handler';
// import colors from '../../utils/colors';
// import {RefreshControl} from 'react-native';
// import {currencyFormat} from '../../helpers';
// import ImageScroll from './ImageScroll';

// const Header_Maximum_Height = 220;
// const Header_Minimum_Height = 50;
// const AnimatedStatusBar = Animated.createAnimatedComponent(StatusBar);
// const AnimatedHeader = Animated.createAnimatedComponent(Header);
// const AnimatedIcon = Animated.createAnimatedComponent(Icon);
// const AnimatedSearchBar = Animated.createAnimatedComponent(SearchBar);

// const vpWidth = Dimensions.get('window').width;
// const ratio = 882 / 1233;

// const DetailProduk = ({route, navigation}) => {
//   const {item} = route.params;
//   const isLoading = useSelector((state) => state.global.fullscreenLoading);
//   const dispatch = useDispatch();
//   const [category, setCategoy] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [banner, setBanner] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [brand, setBrand] = useState({});
//   const [allProduct, setAllProduct] = useState([]);
//   const [page, setPage] = useState(1);
//   const AnimatedHeaderValue = new Animated.Value(0);
//   const scroll = new Animated.Value(0);
//   const [dark, setDark] = useState(true);

//   const [image, setImage] = useState([]);

//   useEffect(() => {
//     // makeRequest();
//     // getAllProduct();
//     dispatch(_fetch(ProductServices.getDetailProduct(item.id))).then(
//       (res) => res && setImage(res.data.product.images),
//     );
//   }, []);

//   // const makeRequest = () => {
//   //   dispatch(_fetch(HomeServices.getHome())).then((res) => {
//   //     if (res) {
//   //       setCategoy(res.data.categories);
//   //       setBrands(res.data.brands.splice(1, res.data.brands.length));
//   //       setBrand(res.data.brands[0]);
//   //       setProduct(res.data.products);
//   //       addBanner(res.data.banners);
//   //     }
//   //   });
//   // };

//   const _onRefresh = () => {
//     makeRequest();
//     setPage(1);
//   };

//   const handleLoadMore = () => {
//     setPage(page + 1);
//   };

//   const addBanner = (banners) => {
//     const length = banners.length;
//     banner.splice(0, banner.length);
//     for (var i = 0; i < length; i++) {
//       banner.push(banners[i].urlImage);
//     }
//   };

//   const changeStatusBar = ({nativeEvent}) => {
//     let y = nativeEvent.contentOffset.y;
//     scroll.setValue(y); // set scroll animation value here
//     let scrollValue = y;
//     if (scrollValue > 100 && dark) {
//       setDark(false);
//     }
//     if (scrollValue < 100 && !dark) {
//       setDark(true);
//     }
//   };

//   const navigate = (to, payload) => (e) => navigation.navigate(to, payload);

//   const renderCategory = ({item}) => {
//     return (
//       <View style={styles.listWrapper}>
//         <RectButton
//           rippleColor={'#F0F0F0'}
//           style={[
//             styles.listButton,
//             {
//               backgroundColor:
//                 '#' +
//                 ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
//             },
//           ]}>
//           <Text color={colors.white} align="center" size={9}>
//             {item.name}
//           </Text>
//         </RectButton>
//       </View>
//     );
//   };

//   const renderProduct = ({item}) => {
//     return <ListProduct data={item} />;
//   };

//   const renderProductAll = (item, key) => {
//     return (
//       <View key={key} style={styles.wrapperMansory}>
//         <ScaledImage
//           // style={{
//           //   height: vpWidth * ratio,
//           //   width: '100%',
//           //   backgroundColor: 'red',
//           // }}
//           // source={{uri: item.imagePhoto}}
//           // resizeMode="contain"
//           uri={JSON.parse(item.images)[0]}
//           width={vpWidth * 0.5 - 14}
//           // height={200}
//         />
//         <View style={styles.containerTitle}>
//           <Text style={styles.title} type="SemiBold" color="#000" size={10}>
//             {item.nameProduct}
//           </Text>
//           <Text style={styles.price} color="#cc0000" size={8}>
//             {currencyFormat(parseInt(item.price))}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderBrand = ({item, index}) => {
//     return (
//       <View
//         style={
//           index % 2 == 0 ? styles.brandContainer : styles.brandContainerEven
//         }>
//         <View style={styles.brandImageContainer}>
//           <Image
//             style={styles.brandImage}
//             source={{uri: item.image}}
//             resizeMode="contain"
//           />
//         </View>
//         <View style={styles.brandTitleContainer}>
//           <Text size={10} align="center" type="Bold">
//             {item.name}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <>
//       <View style={styles.container}>
//         {isLoading ? (
//           <SkeletonPlaceholder>
//             <SkeletonPlaceholder.Item>
//               <SkeletonPlaceholder.Item height={250} />
//             </SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item margin={10}>
//               <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 3 - 10}
//                   padding={15}
//                   borderRadius={3}
//                 />
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 3 - 10}
//                   padding={15}
//                   borderRadius={3}
//                   marginHorizontal={5}
//                 />
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 3 - 10}
//                   padding={15}
//                   borderRadius={3}
//                 />
//               </SkeletonPlaceholder.Item>
//               <SkeletonPlaceholder.Item
//                 flexDirection="row"
//                 alignItems="center"
//                 marginTop={5}>
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 3 - 10}
//                   padding={15}
//                   borderRadius={3}
//                 />
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 3 - 10}
//                   padding={15}
//                   borderRadius={3}
//                   marginHorizontal={5}
//                 />
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 3 - 10}
//                   padding={15}
//                   borderRadius={3}
//                 />
//               </SkeletonPlaceholder.Item>
//             </SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item marginHorizontal={10}>
//               <SkeletonPlaceholder.Item padding={15} borderRadius={3} />
//             </SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item margin={10}>
//               <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 2 - 15}
//                   height={250}
//                   borderRadius={8}
//                 />
//                 <SkeletonPlaceholder.Item
//                   width={Dimensions.get('window').width / 2 - 15}
//                   height={250}
//                   borderRadius={8}
//                   marginLeft={10}
//                 />
//               </SkeletonPlaceholder.Item>
//             </SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item marginHorizontal={10}>
//               <SkeletonPlaceholder.Item height={150} borderRadius={8} />
//             </SkeletonPlaceholder.Item>
//           </SkeletonPlaceholder>
//         ) : (
//           <>
//             <View style={{position: 'absolute'}}>
//               <View style={{zIndex: 1}}>
//                 <AnimatedStatusBar
//                   translucent
//                   barStyle={!dark ? 'dark-content' : 'light-content'}
//                 />
//                 <AnimatedHeader
//                   statusBarProps={{translucent: true}}
//                   placement="left"
//                   centerComponent={
//                     <TouchableOpacity
//                       onPress={() => navigation.navigate('CariProduk')}
//                       activeOpacity={1}
//                       style={[
//                         styles.searchbar,
//                         {
//                           backgroundColor: AnimatedHeaderValue.interpolate({
//                             inputRange: [
//                               0,
//                               Header_Maximum_Height - Header_Minimum_Height,
//                             ],
//                             outputRange: [colors.white, colors.softgrey],
//                             extrapolate: 'clamp',
//                           }),
//                         },
//                       ]}>
//                       <Text size={10}>Cari produk disini...</Text>
//                     </TouchableOpacity>
//                   }
//                   rightComponent={
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                       }}>
//                       <TouchableOpacity activeOpacity={1}>
//                         <AnimatedIcon
//                           name="heart"
//                           type="material-community"
//                           color={AnimatedHeaderValue.interpolate({
//                             inputRange: [
//                               0,
//                               Header_Maximum_Height - Header_Minimum_Height,
//                             ],
//                             outputRange: [colors.white, colors.grey],
//                             extrapolate: 'clamp',
//                           })}
//                           size={23}
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={styles.bellIcon}
//                         activeOpacity={1}>
//                         <AnimatedIcon
//                           name="email"
//                           type="material-community"
//                           color={AnimatedHeaderValue.interpolate({
//                             inputRange: [
//                               0,
//                               Header_Maximum_Height - Header_Minimum_Height,
//                             ],
//                             outputRange: [colors.white, colors.grey],
//                             extrapolate: 'clamp',
//                           })}
//                           size={23}
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity activeOpacity={1}>
//                         <AnimatedIcon
//                           name="bell"
//                           type="material-community"
//                           color={AnimatedHeaderValue.interpolate({
//                             inputRange: [
//                               0,
//                               Header_Maximum_Height - Header_Minimum_Height,
//                             ],
//                             outputRange: [colors.white, colors.grey],
//                             extrapolate: 'clamp',
//                           })}
//                           size={23}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   }
//                   backgroundColor={AnimatedHeaderValue.interpolate({
//                     inputRange: [
//                       0,
//                       Header_Maximum_Height - Header_Minimum_Height,
//                     ],
//                     outputRange: ['transparent', 'white'],
//                     extrapolate: 'clamp',
//                   })}
//                   containerStyle={{
//                     padding: 0,
//                     width: Dimensions.get('window').width,
//                     borderBottomColor: 'transparent',
//                   }}
//                 />
//               </View>
//             </View>
//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               onScroll={Animated.event(
//                 [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
//                 {
//                   listener: (event) => {
//                     changeStatusBar(event);
//                   },
//                 },
//               )}
//               // scrollEventThrottle={400}
//               refreshControl={
//                 <RefreshControl refreshing={isLoading} onRefresh={_onRefresh} />
//               }>
//               <ImageScroll data={item.images} />
//             </ScrollView>
//           </>
//         )}
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   Card: {
//     backgroundColor: 'white',
//     marginBottom: 10,
//   },
//   categoryContainer: {
//     marginBottom: 15,
//     backgroundColor: 'white',
//     paddingVertical: 15,
//   },
//   kategoriWrapper: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     marginHorizontal: 15,
//   },
//   kategoriRight: {
//     marginLeft: 'auto',
//     textDecorationLine: 'underline',
//   },
//   wrapperItem: {
//     paddingHorizontal: 10,
//     paddingVertical: 0,
//     margin: 0,
//   },
//   wrapperProduct: {
//     flex: 1,
//     backgroundColor: 'white',
//     paddingTop: 20,
//   },
//   txtSemua: {
//     marginHorizontal: 5,
//     marginBottom: 10,
//     marginTop: 5,
//   },
//   listWrapper: {
//     flexDirection: 'row',
//     width: '33.333%',
//     paddingVertical: 2.5,
//     paddingHorizontal: 2.5,
//     borderRadius: 3,
//   },
//   listButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 3,
//   },
//   bellIcon: {marginHorizontal: 15},
//   searchbar: {
//     width: '100%',
//     left: -15,
//     padding: 10,
//     borderRadius: 5,
//   },
//   brandWrapper: {
//     backgroundColor: colors.green,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   brandWrapperLeft: {
//     height: 200,
//     justifyContent: 'center',
//     padding: 15,
//   },
//   brandContainer: {
//     borderColor: colors.grey,
//     borderLeftWidth: 0.3,
//     borderRightWidth: 0.3,
//     width: '50%',
//     height: 100,
//     justifyContent: 'space-between',
//   },
//   brandContainerEven: {
//     width: '50%',
//     height: 100,
//     justifyContent: 'space-between',
//   },
//   brandImageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
//   brandImage: {height: 50, width: 100},
//   brandTitleContainer: {
//     backgroundColor: colors.blue,
//     marginHorizontal: 1,
//   },
//   wrapperMansory: {
//     margin: 4,
//     width: vpWidth * 0.5 - 14,
//     shadowColor: '#0000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     backgroundColor: colors.white,
//     borderRadius: 5,
//   },
//   title: {
//     marginTop: 5,
//     marginHorizontal: 10,
//   },
//   price: {
//     marginBottom: 5,
//     marginHorizontal: 10,
//   },
//   containerTitle: {flex: 1},
// });

// export default DetailProduk;
