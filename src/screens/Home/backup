import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {SliderBox} from 'react-native-image-slider-box';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useSelector, useDispatch} from 'react-redux';
import {HomeServices, ProductServices} from '../../services';
import {_fetch} from '../../redux/actions/global';
import {Text, ListProduct, Masonry, ScaledImage} from '../../components';
import {ScrollView} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import colors from '../../utils/colors';
import {RefreshControl} from 'react-native';
import {currencyFormat, formatNumber, getPriceDiskon} from '../../helpers';
import sizes from '../../utils/size';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {setHomeState} from '../../redux/actions/home';

const Header_Maximum_Height = 220;
const Header_Minimum_Height = 50;
// const FuncHeader = React.forwardRef((props, ref) => <Header ref={ref} />);
// const AnimatedHeader = Animated.createAnimatedComponent(Header);
// const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const vpWidth = Dimensions.get('window').width;
const ratio = 882 / 1233;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const Home = ({navigation}) => {
  const isLoading = useSelector(state => state.global.fullscreenLoading);
  const {banner, discount, newestProducts, terlaris} = useSelector(
    state => state.home,
  );
  const name = useSelector(state => state.auth.userInfo.name);
  const dispatch = useDispatch();
  const [category, setCategoy] = useState([]);
  const [product, setProduct] = useState([]);
  const [productDiscount, setProductDiscount] = useState([]);
  const [productNewest, setProductNewest] = useState([]);
  const [banners, setBanners] = useState([]);
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState({});
  const [allProduct, setAllProduct] = useState([]);
  const [page, setPage] = useState(1);
  const AnimatedHeaderValue = new Animated.Value(0);
  const scroll = new Animated.Value(0);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    // makeRequest();
    addBanner(banner);
    // setProductDiscount(discount);
    // setProductNewest(newestProducts);
    // makeRequest();
    // getAllProduct();
  }, []);

  // useEffect(() => {
  //   getAllProduct(page);
  // }, [page]);

  // console.log(RFPercentage(41));

  const makeRequest = () => {
    dispatch(_fetch(HomeServices.getHome(), false)).then(res => {
      if (res) {
        addBanner(res.data.banners);
        dispatch(setHomeState('banner', res.data.banners));
        dispatch(setHomeState('discount', res.data.discount));
        dispatch(setHomeState('newestProducts', res.data.newestProduct));
        dispatch(setHomeState('terlaris', res.data.terlaris));
      }
    });
  };

  const getAllProduct = () => {
    dispatch(_fetch(ProductServices.getAllProduct())).then(
      res => res && setAllProduct(res.data),
    );
  };

  const _onRefresh = () => {
    makeRequest();
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const addBanner = bannerss => {
    const length = bannerss.length;
    banners.splice(0, banners.length);
    for (var i = 0; i < length; i++) {
      banners.push(bannerss[i].urlImage);
    }
  };

  const changeStatusBar = ({nativeEvent}) => {
    let y = nativeEvent.contentOffset.y;
    scroll.setValue(y); // set scroll animation value here
    let scrollValue = y;
    if (scrollValue > 100 && dark) {
      setDark(false);
    }
    if (scrollValue < 100 && !dark) {
      setDark(true);
    }
  };

  const navigate = (to, payload) => e => navigation.navigate(to, payload);

  const renderCategory = ({item}) => {
    return (
      <View style={styles.listWrapper}>
        <RectButton
          rippleColor={'#F0F0F0'}
          style={[
            styles.listButton,
            {
              backgroundColor:
                '#' +
                ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
            },
          ]}>
          <Text color={colors.white} align="center" size={9}>
            {item.name}
          </Text>
        </RectButton>
      </View>
    );
  };

  const renderProduct = ({item}) => {
    return <ListProduct data={item} terlaris />;
  };

  const renderProductAll = (item, key) => {
    return (
      <View key={key} style={styles.wrapperMansory}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 1,
            top: 8,
            left: 8,
          }}>
          {(key < 2 || (key / 2) % 2 == 0 > 1) && (
            <Text
              style={{
                // position: 'absolute',
                // zIndex: 1,
                // top: 8,
                // left: 8,
                backgroundColor: colors.black,
                paddingHorizontal: 5,
                paddingTop: 2,
                borderRadius: 99,
                marginRight: 3,
              }}
              color={colors.white}
              type="SemiBold"
              size={sizes.font12}>
              Baru
            </Text>
          )}
          {item.discount != 0 && (
            <Text
              style={{
                // position: 'absolute',
                // zIndex: 1,
                // top: 8,
                // left: 8,
                backgroundColor: colors.red,
                paddingHorizontal: 5,
                paddingTop: 2,
                borderRadius: 99,
              }}
              color={colors.white}
              type="SemiBold"
              size={sizes.font12}>
              -{item.discount}%
            </Text>
          )}
        </View>
        <ScaledImage
          // style={{
          //   height: vpWidth * ratio,
          //   width: '100%',
          //   backgroundColor: 'red',
          // }}
          // source={{uri: item.imagePhoto}}
          // resizeMode="contain"
          uri={JSON.parse(item.images)[0]}
          width={vpWidth * 0.5 - sizes.twentyFive}
          // height={200}
        />
        <View style={styles.containerTitle}>
          <Text
            style={styles.title}
            // type="SemiBold"
            // color="#000"
            size={sizes.font14}>
            {item.nameProduct}
          </Text>
        </View>
        <View>
          {item.discount > 0 && (
            <Text
              // style={{marginBottom: sizes.five, marginRight: -5}}
              style={{marginHorizontal: sizes.ten, marginBottom: -2}}
              // color="#cc0000"
              color={colors.black}
              type="Bold"
              size={sizes.font12}>
              {currencyFormat(getPriceDiskon(item.discount, item.price))}
            </Text>
          )}
          <Text
            style={item.discount > 0 ? styles.priceStrike : styles.price}
            color={item.discount > 0 ? colors.gray : colors.black}
            size={item.discount > 0 ? sizes.font10 : sizes.font12}
            type={item.discount > 0 ? 'Regular' : 'Bold'}>
            {item.discount > 0
              ? currencyFormat(parseInt(item.price))
              : currencyFormat(parseInt(item.price))}
          </Text>
          <Text
            style={{marginBottom: sizes.ten, marginHorizontal: sizes.ten}}
            color={colors.grey}
            size={sizes.font12}>
            Terjual{' '}
            {item.qtyBuy > 1000
              ? String(item.qtyBuy).slice(0, 2) + ' rb'
              : item.qtyBuy}
          </Text>
        </View>
      </View>
    );
  };

  const renderBrand = ({item, index}) => {
    return (
      <View
        style={
          index % 2 == 0 ? styles.brandContainer : styles.brandContainerEven
        }>
        <View style={styles.brandImageContainer}>
          <Image
            style={styles.brandImage}
            source={{uri: item.image}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.brandTitleContainer}>
          <Text size={10} align="center" type="Bold">
            {item.name}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {isLoading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item height={250} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item margin={10}>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 3 - 10}
                  padding={15}
                  borderRadius={3}
                />
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 3 - 10}
                  padding={15}
                  borderRadius={3}
                  marginHorizontal={5}
                />
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 3 - 10}
                  padding={15}
                  borderRadius={3}
                />
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                flexDirection="row"
                alignItems="center"
                marginTop={5}>
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 3 - 10}
                  padding={15}
                  borderRadius={3}
                />
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 3 - 10}
                  padding={15}
                  borderRadius={3}
                  marginHorizontal={5}
                />
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 3 - 10}
                  padding={15}
                  borderRadius={3}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item marginHorizontal={10}>
              <SkeletonPlaceholder.Item padding={15} borderRadius={3} />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item margin={10}>
              <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 2 - 15}
                  height={250}
                  borderRadius={8}
                />
                <SkeletonPlaceholder.Item
                  width={Dimensions.get('window').width / 2 - 15}
                  height={250}
                  borderRadius={8}
                  marginLeft={10}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item marginHorizontal={10}>
              <SkeletonPlaceholder.Item height={150} borderRadius={8} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder>
        ) : (
          <>
            <View style={{position: 'absolute'}}>
              <View style={{zIndex: 1}}>
                <Header
                  statusBarProps={{
                    translucent: true,
                    backgroundColor: 'transparent',
                    // barStyle: !dark ? 'dark-content' : 'light-content',
                  }}
                  placement="left"
                  // centerComponent={
                  //   <TouchableOpacity
                  //     onPress={() => navigation.navigate('CariProduk')}
                  //     activeOpacity={1}
                  //     style={[
                  //       styles.searchbar,
                  //       {
                  //         backgroundColor: AnimatedHeaderValue.interpolate({
                  //           inputRange: [
                  //             0,
                  //             Header_Maximum_Height - Header_Minimum_Height,
                  //           ],
                  //           outputRange: [colors.white, colors.softgrey],
                  //           extrapolate: 'clamp',
                  //         }),
                  //       },
                  //     ]}>
                  //     <Icon
                  //       type="material-community"
                  //       name="magnify"
                  //       color={colors.grey}
                  //       size={15}
                  //     />
                  //     <Text size={10}>Cari produk disini...</Text>
                  //   </TouchableOpacity>
                  // }
                  // rightComponent={
                  //   <View
                  //     style={{
                  //       flexDirection: 'row',
                  //       justifyContent: 'space-between',
                  //     }}>
                  //     <TouchableOpacity activeOpacity={1}>
                  //       <AnimatedIcon
                  //         name="heart"
                  //         type="material-community"
                  //         color={AnimatedHeaderValue.interpolate({
                  //           inputRange: [
                  //             0,
                  //             Header_Maximum_Height - Header_Minimum_Height,
                  //           ],
                  //           outputRange: [colors.white, colors.grey],
                  //           extrapolate: 'clamp',
                  //         })}
                  //         size={23}
                  //       />
                  //     </TouchableOpacity>
                  //     <TouchableOpacity
                  //       style={styles.bellIcon}
                  //       activeOpacity={1}>
                  //       <AnimatedIcon
                  //         name="email"
                  //         type="material-community"
                  //         color={AnimatedHeaderValue.interpolate({
                  //           inputRange: [
                  //             0,
                  //             Header_Maximum_Height - Header_Minimum_Height,
                  //           ],
                  //           outputRange: [colors.white, colors.grey],
                  //           extrapolate: 'clamp',
                  //         })}
                  //         size={23}
                  //       />
                  //     </TouchableOpacity>
                  //     <TouchableOpacity activeOpacity={1}>
                  //       <AnimatedIcon
                  //         name="bell"
                  //         type="material-community"
                  //         color={AnimatedHeaderValue.interpolate({
                  //           inputRange: [
                  //             0,
                  //             Header_Maximum_Height - Header_Minimum_Height,
                  //           ],
                  //           outputRange: [colors.white, colors.grey],
                  //           extrapolate: 'clamp',
                  //         })}
                  //         size={23}
                  //       />
                  //     </TouchableOpacity>
                  //   </View>
                  // }
                  backgroundColor={AnimatedHeaderValue.interpolate({
                    inputRange: [
                      0,
                      Header_Maximum_Height - Header_Minimum_Height,
                    ],
                    outputRange: ['transparent', 'white'],
                    extrapolate: 'clamp',
                  })}
                  containerStyle={{
                    padding: 0,
                    width: Dimensions.get('window').width,
                    borderBottomColor: 'transparent',
                  }}
                />
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              // onScroll={Animated.event(
              //   [{nativeEvent: {contentOffset: {y: AnimatedHeaderValue}}}],
              //   {
              //     listener: (event) => {
              //       changeStatusBar(event);
              //     },
              //   },
              // )}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={_onRefresh} />
              }>
              <SliderBox
                images={banners}
                autoplay
                circleLoop
                dotColor="transparent"
                paginationBoxStyle={{
                  position: 'absolute',
                  left: -sizes.fifTeen,
                }}
                dotStyle={{
                  width: 6,
                  height: 6,
                  borderRadius: sizes.five,
                  marginHorizontal: -sizes.fifTeen,
                  padding: 0,
                  margin: 0,
                  backgroundColor: 'transparent',
                }}
                dotColor={colors.white}
                inactiveDotColor={colors.softgrey}
                ImageComponentStyle={{
                  marginTop: 0,
                  zIndex: 0,
                  // height: 300,
                }}
                sliderBoxHeight={196}
              />
              {/* <FlatList
                data={category}
                horizontal={false}
                numColumns={3}
                contentContainerStyle={{
                  padding: 5,
                  backgroundColor: 'white',
                  marginBottom: 15,
                }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCategory}
              /> */}
              {/* <View>
                <Text
                  style={styles.txtSemua}
                  type="Bold"
                  size={12}
                  color={colors.black}>
                  Brand Pilihan
                </Text>
                <View style={styles.brandWrapper}>
                  <View style={styles.brandWrapperLeft}>
                    <Image
                      source={{uri: brand.image}}
                      style={{height: 30, width: 100}}
                      resizeMode="stretch"
                    />
                  </View>
                  <FlatList
                    data={brands}
                    renderItem={renderBrand}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                  />
                </View>
              </View> */}
              {discount.length != 0 && (
                <View style={{paddingTop: sizes.twenty}}>
                  <Text
                    style={{
                      marginHorizontal: sizes.fifTeen,
                      marginBottom: sizes.ten,
                      // marginTop: 5,
                    }}
                    type="Bold"
                    size={sizes.twentyFive}
                    color={colors.black}>
                    Diskon
                  </Text>
                  <FlatList
                    data={discount}
                    horizontal
                    renderItem={renderProduct}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{paddingHorizontal: 10}}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
              <View style={{paddingTop: sizes.twenty}}>
                <Text
                  style={{
                    marginHorizontal: sizes.fifTeen,
                    marginBottom: sizes.ten,
                    // marginTop: 5,
                  }}
                  type="Bold"
                  size={sizes.twentyFive}
                  color={colors.black}>
                  Terlaris
                </Text>
                <FlatList
                  data={terlaris}
                  horizontal
                  renderItem={renderProduct}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{paddingHorizontal: 10}}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <View style={styles.wrapperProduct}>
                <Text
                  style={{
                    marginHorizontal: sizes.fifTeen,
                    // marginBottom: sizes.ten,
                    // marginTop: 5,
                  }}
                  type="Bold"
                  size={sizes.twentyFive}
                  color={colors.black}>
                  Baru
                </Text>
                <Masonry
                  itemsProvider={newestProducts}
                  renderItem={renderProductAll}
                />
              </View>
            </ScrollView>
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  Card: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 15,
    backgroundColor: 'white',
    paddingVertical: 15,
  },
  kategoriWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  kategoriRight: {
    marginLeft: 'auto',
    textDecorationLine: 'underline',
  },
  wrapperItem: {
    paddingHorizontal: sizes.ten,
    paddingVertical: 0,
    margin: 0,
  },
  wrapperProduct: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: sizes.twenty,
  },
  txtSemua: {
    marginHorizontal: 5,
    marginBottom: sizes.ten,
    marginTop: 5,
  },
  listWrapper: {
    flexDirection: 'row',
    width: '33.333%',
    paddingVertical: 2.5,
    paddingHorizontal: 2.5,
    borderRadius: 3,
  },
  listButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sizes.ten,
    borderRadius: 3,
  },
  bellIcon: {marginHorizontal: 15},
  searchbar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    left: -15,
    padding: sizes.ten,
    borderRadius: 5,
  },
  brandWrapper: {
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandWrapperLeft: {
    height: 200,
    justifyContent: 'center',
    padding: 15,
  },
  brandContainer: {
    borderColor: colors.grey,
    borderLeftWidth: 0.3,
    borderRightWidth: 0.3,
    width: '50%',
    height: 100,
    justifyContent: 'space-between',
  },
  brandContainerEven: {
    width: '50%',
    height: 100,
    justifyContent: 'space-between',
  },
  brandImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  brandImage: {height: 50, width: 100},
  brandTitleContainer: {
    backgroundColor: colors.blue,
    // borderColor: colors.grey,
    // borderLeftWidth: 0.3,
    // borderRightWidth: 0.3,
    marginHorizontal: 0.8,
  },
  wrapperMansory: {
    margin: sizes.five,
    width: vpWidth * 0.5 - sizes.twenty,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    shadowColor: '#0000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 5,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  //
  Pembungkus: {
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
    margin: 5,
  },
  FlatListItemStyle: {
    margin: 10,
    padding: 10,
    fontSize: 18,
    height: 500,
  },
  ImageComponentStyle: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 1,
    height: 150,
    width: 150,
  },
  ImageSkeleton: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    height: 100,
    width: '100%',
    borderRadius: 0,
  },
  Judul: {
    color: '#000',
    padding: 2,
    fontSize: 14,
    marginTop: 3,
    textAlign: 'left',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  JudulSkeleton: {
    color: '#000',
    padding: 2,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 10,
    marginTop: 5,
    marginRight: 10,
    justifyContent: 'center',
    width: 120,
  },
  Harga: {
    color: '#cc0000',
    padding: 2,
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
  },
  title: {
    marginTop: 5,
    marginHorizontal: 10,
  },
  price: {
    marginBottom: 5,
    marginHorizontal: 10,
  },
  priceStrike: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginBottom: sizes.five,
    marginHorizontal: sizes.ten,
  },
  containerTitle: {flex: 1},
});

export default Home;
