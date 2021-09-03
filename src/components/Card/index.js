import React from 'react';
import {View, Text} from 'react-native';
import {colors, sizes} from '../../utils';

const Card = ({style, children}) => {
  return (
    <View
      style={{
        ...style,
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: 8,
        borderWidth: 1,
        // borderColor: '#e5e5e5',
        // shadowColor: '#000',
        borderColor: colors.white,
        shadowColor: colors.white,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 2,
        // padding: sizes.fifTeen,
        // margin: sizes.ten,
        marginVertical: 7.5,
      }}>
      {children}
    </View>
  );
};

export default Card;
