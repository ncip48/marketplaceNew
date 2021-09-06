import {size} from 'lodash';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Text} from '..';
import colors from '../../utils/colors';
import sizes from '../../utils/size';
import {RFPercentage} from 'react-native-responsive-fontsize';

const CustomButton = ({
  title,
  bg,
  size,
  color,
  border,
  style,
  onPress,
  loading,
  borderbg,
  rounded,
  small,
  ...otherProps
}) => {
  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          paddingVertical: small ? sizes.five : sizes.ten,
          paddingHorizontal: sizes.twenty,
          justifyContent: 'center',
          borderRadius: rounded ? 99 : sizes.five,
          backgroundColor: bg ? bg : colors.red,
          borderWidth: border ? 1 : 0,
          borderColor: borderbg ? bg : color ? color : bg ? bg : colors.red,
          // opacity: loading ? 0.7 : 1,
        }}
        onPress={onPress}
        {...otherProps}>
        {loading ? (
          <Spinner
            type="Pulse"
            color={color ? color : bg ? bg : colors.white}
            isVisible={loading}
            size={RFPercentage(2.8)}
            style={{alignSelf: 'center'}}
          />
        ) : (
          <Text
            size={size ?? sizes.font12}
            color={color ? color : colors.white}
            align="center"
            type="SemiBold">
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
