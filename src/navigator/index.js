import * as React from 'react';
import {LogBox, StatusBar} from 'react-native';
import ResponsiveScreen from 'react-native-auto-responsive-screen';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import CustomIcon from '../assets/icons/CustomIcon';

import {
  Category,
  Checkout,
  DaftarAlamat,
  DetailProduk,
  EditAlamat,
  Home,
  HomeTwo,
  Keranjang,
  Masuk,
  PembayaranDetail,
  PesananDetail,
  PesananSaya,
  PilihKota,
  PilihProvinsi,
  Profile,
  Splash,
  TambahAlamat,
  Favorit,
} from '../screens/index';
import colors from '../utils/colors';
import sizes from '../utils/size';
import {Icon, withBadge} from 'react-native-elements';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {font} from '../utils';
import messaging from '@react-native-firebase/messaging';
import {LocalNotification} from '../helpers';
import {isReadyRef} from './RootNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// const getActiveRouteName = (state) => {
//   const route = state.routes[state.index];

//   if (route.state) {
//     return getActiveRouteName(route.state);
//   }

//   return route;
// };

function MainTabNavigator() {
  const {cart} = useSelector(state => state.profile);
  const subtotalCount = () => {
    if (cart) {
      return cart.reduce((sum, item) => sum + item.qty, 0);
    }
    return 0;
  };
  const BadgedIcon = withBadge(subtotalCount() > 9 ? '9+' : subtotalCount(), {
    left: 5,
    hidden: subtotalCount() == 0 ? true : false,
    badgeStyle: {
      backgroundColor: colors.red,
    },
    textStyle: {fontSize: sizes.font10, padding: 0, margin: 0},
  })(Icon);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home-variant' : 'home-variant-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Bag') {
            iconName = focused ? 'shopping' : 'shopping-outline';
          } else if (route.name === 'Favorite') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }
          return (
            // <CustomIcon name={iconName} size={sizes.font20} color={color} />
            route.name != 'Bag' ? (
              <Icon
                type="material-community"
                color={color}
                size={sizes.font26}
                name={iconName}
              />
            ) : (
              <BadgedIcon
                type="material-community"
                color={color}
                size={sizes.font26}
                name={iconName}
                // containerStyle={{marginLeft: 10}}
              />
            )
          );
        },
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: -5,
          fontFamily: 'Poppins-SemiBold',
        },
        tabBarItemStyle: {
          paddingVertical: sizes.ten,
          paddingTop: sizes.ten,
        },
        tabBarStyle: [
          {
            display: 'flex',
            backgroundColor: colors.white,
            borderTopLeftRadius: sizes.fifTeen,
            borderTopRightRadius: sizes.fifTeen,
            height: RFPercentage(8.2),
          },
          null,
        ],
      })}

      // tabBarOptions={{
      //   activeTintColor: colors.red,
      //   inactiveTintColor: colors.gray,
      //   labelStyle: {
      //     fontSize: 12,
      //     // marginBottom: 5,
      //     // margin: 0,
      //     // marginTop: 10,
      //     marginBottom: -5,
      //     fontFamily: font['SemiBold'],
      //   },
      //   style: {
      //     backgroundColor: colors.white,
      //     borderTopLeftRadius: sizes.fifTeen,
      //     borderTopRightRadius: sizes.fifTeen,
      //     height: RFPercentage(8.2),
      //     // marginTop: sizes.ten,
      //   },
      //   tabStyle: {
      //     // marginTop: sizes.ten,
      //     paddingVertical: sizes.ten,
      //     paddingTop: sizes.ten,
      //     // height: 60,
      //   },
      // }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        // initialParams={{bgcolor: 'transparent', bar: 'dark-content'}}
      />
      <Tab.Screen
        name="Shop"
        component={HomeTwo}
        // initialParams={{bgcolor: colors.green, bar: 'light-content'}}
      />
      <Tab.Screen
        name="Bag"
        component={Keranjang}
        // initialParams={{bgcolor: colors.green, bar: 'light-content'}}
      />
      <Tab.Screen
        name="Favorite"
        component={Favorit}
        // initialParams={{bgcolor: colors.green, bar: 'light-content'}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        // initialParams={{bgcolor: colors.green, bar: 'light-content'}}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  // const routeNameRef = React.useRef();
  // const navigationRef = React.useRef();
  const isLogin = useSelector(state => state.auth.isLogin);
  const [currentNotif, setcurrentnotif] = React.useState(null);
  // React.useEffect(() => {
  //   const state = navigationRef.current.getRootState();

  //   // Save the initial route name
  //   routeNameRef.current = getActiveRouteName(state);
  //   StatusBar.setBarStyle('dark-content');
  //   StatusBar.setBackgroundColor('transparent');
  // }, []);

  messaging().subscribeToTopic('all');

  // console.disableYellowBox = true;
  LogBox.ignoreAllLogs(true);

  React.useEffect(() => {
    let foregroundListener = messaging().onMessage(async remoteMessage => {
      if (currentNotif == remoteMessage.messageId) {
        console.log('Prevented Multiple Run');
        return;
      }
      LocalNotification(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
      );
      setcurrentnotif(remoteMessage.messageId);
      let data = remoteMessage['data'];
      console.log(`From Firebase`, remoteMessage);
      console.log('Data', data);

      // let msgBody = remoteMessage.notification.body;
      // let msgTitle = remoteMessage.notification.title;
      // let msgMarkup = data?.msgMarkup;
      // let msgDate = Date.now();
      // let msgImg = data?.image;

      // let type = data.type.toLowerCase();
      // let service = data.service.toLowerCase();

      // if (service == 'jbmarket') {
      //   let func = setNotification({
      //     title: msgTitle,
      //     msg: msgBody,
      //     date: msgDate,
      //     image: msgImg,
      //     msgMarkup: msgMarkup,
      //     service: 'marketplace',
      //   });
      //   dispatch(func);
      // }
    });
    return () => {
      isReadyRef.current = false;
      // dispatch(setDriverInfo({splash: true}));
      foregroundListener();
    };
  }, []);
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();

  return (
    <NavigationContainer
      // ref={navigationRef}
      // onStateChange={(state) => {
      //   const previousRouteName = routeNameRef.current;
      //   const currentRouteName = getActiveRouteName(state);

      //   if (previousRouteName !== currentRouteName) {
      //     const statusTheme = currentRouteName.params.bar;
      //     const bgColor = currentRouteName.params.bgcolor;
      //     StatusBar.setBarStyle(statusTheme);
      //     StatusBar.setBackgroundColor(bgColor);
      //   }

      //   routeNameRef.current = currentRouteName;
      // }}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
        // routeNameRef.current = navigationRef.current?.getCurrentRoute().name;
        // try {
        //   analytics().logEvent('login_to_app', userInfo);
        //   console.log('analytics ~> login');
        // } catch (error) {
        //   console.log('analytics error', error);
        // }
      }}
      onStateChange={async state => {
        const previosRouteName = routeNameRef.current;
        // const currentRouteName = navigationRef.current.getCurrentRoute().name;
        // if (previosRouteName !== currentRouteName) {
        //   await analytics().logScreenView({
        //     screen_name: currentRouteName,
        //     screen_class: currentRouteName,
        //   });
        //   console.log('analytics log screen ~>', currentRouteName);
        // }
        // routeNameRef.current = currentRouteName;
      }}>
      <Stack.Navigator
        // screenOptions={{headerShown: false}}
        screenOptions={{headerShown: false}}
        // initialRouteName="DaftarAlamat"
      >
        {isLogin ? (
          <>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Home" component={MainTabNavigator} />
            <Stack.Screen
              name="DaftarAlamat"
              component={DaftarAlamat}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
            <Stack.Screen
              name="TambahAlamat"
              component={TambahAlamat}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
            <Stack.Screen
              name="EditAlamat"
              component={EditAlamat}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
            <Stack.Screen
              name="DetailProduk"
              component={DetailProduk}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
            <Stack.Screen
              name="PilihProvinsi"
              component={PilihProvinsi}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
            <Stack.Screen
              name="PilihKota"
              component={PilihKota}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
            <Stack.Screen name="Checkout" component={Checkout} />
            <Stack.Screen
              name="PembayaranDetail"
              component={PembayaranDetail}
            />
            <Stack.Screen name="PesananSaya" component={PesananSaya} />
            <Stack.Screen name="PesananDetail" component={PesananDetail} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Masuk"
              component={Masuk}
              // initialParams={{bgcolor: 'white', bar: 'dark-content'}}
            />
          </>
        )}
        {/* <Stack.Screen name="Home" component={MainTabNavigator} /> */}
        {/* <Stack.Screen
          name="Produk Detail"
          component={ProdukDetail}
          initialParams={{bgcolor: 'transparent', bar: 'light-content'}}
        />
        <Stack.Screen
          name="Kategori Produk"
          component={KategoriProduk}
          initialParams={{bgcolor: 'white', bar: 'dark-content'}}
        />
        <Stack.Screen
          name="Account Page"
          component={Akun}
          initialParams={{bgcolor: 'white', bar: 'dark-content'}}
        />
        <Stack.Screen
          name="Cart Page"
          component={Cart}
          initialParams={{bgcolor: 'white', bar: 'dark-content'}}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = props => {
  return (
    <>
      <AppNavigator navigation={props.navigation} />
    </>
  );
};

export default App;
