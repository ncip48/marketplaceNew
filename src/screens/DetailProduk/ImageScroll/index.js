import React from 'react';
import {View, Text} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import colors from '../../../utils/colors';

const ImageScroll = ({data}) => {
  return (
    <View>
      <SliderBox
        images={JSON.parse(data)}
        dotColor="transparent"
        disableOnPress={true}
        resizeMode={'stretch'}
        // onCurrentImagePressed={(index) => console.log(`image ${index} pressed`)}
        paginationBoxStyle={
          {
            //   position: 'absolute',
            //   left: -15,
          }
        }
        dotStyle={{
          width: 6,
          height: 6,
          borderRadius: 5,
          marginHorizontal: -15,
          padding: 0,
          margin: 0,
          backgroundColor: 'transparent',
        }}
        dotColor={colors.black}
        inactiveDotColor={colors.grey}
        // ImageComponentStyle={{
        //   height: 500,
        // }}
        sliderBoxHeight={400}
      />
    </View>
  );
};

export default ImageScroll;
