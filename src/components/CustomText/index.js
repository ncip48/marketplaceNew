import React from 'react';
import {Text, View} from 'react-native';
import {font} from '../../utils';
import colors from '../../utils/colors';
import sizes from '../../utils/size';

function CustomText({
  style,
  children,
  color,
  size,
  type,
  align,
  ...otherProps
}) {
  const colorStyle = {
    color: color ? color : colors.black,
  };
  const fontSizeStyle = {fontSize: size ?? sizes.font14};
  const fontFamilyStyle = {fontFamily: font[type || 'Regular']};
  const textAlignStyle = {textAlign: align || 'left'};

  return (
    <Text
      style={[
        colorStyle,
        fontSizeStyle,
        fontFamilyStyle,
        textAlignStyle,
        style,
      ]}
      {...otherProps}>
      {children}
    </Text>
  );
}

export default CustomText;
