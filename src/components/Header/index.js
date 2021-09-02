import React from 'react';
import {Header, Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {Text} from '..';
import colors from '../../utils/colors';
import {StatusBar} from 'react-native';
import {View} from 'react-native';
import sizes from '../../utils/size';

const index = ({title, bg, right, shadow, bold, searchbar, noBack, center}) => {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <>
      <StatusBar
        translucent
        backgroundColor={bg ?? colors.white}
        barStyle="dark-content"
      />
      <Header
        backgroundColor={bg ?? colors.white}
        barStyle="dark-content"
        // barStyle="dark-content"
        placement={center ? 'center' : 'left'}
        leftComponent={
          !noBack && (
            <Icon
              name="chevron-left"
              type="feather"
              color={colors.black}
              onPress={goBack}
            />
          )
        }
        centerComponent={
          searchbar ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                left: -sizes.fifTeen,
                padding: sizes.ten,
                borderRadius: 5,
                backgroundColor: colors.softgrey,
                marginLeft: sizes.ten,
              }}>
              <Icon
                type="material-community"
                name="magnify"
                color={colors.grey}
                size={sizes.fifTeen}
              />
              <Text size={sizes.font10}>Cari apa ?</Text>
            </View>
          ) : (
            <Text type={bold ? 'SemiBold' : 'Regular'}>{title}</Text>
          )
        }
        rightComponent={right}
        containerStyle={{
          backgroundColor: bg ?? colors.white,
          borderBottomWidth: shadow ? 1 : 0,
        }}
      />
    </>
  );
};

export default index;
