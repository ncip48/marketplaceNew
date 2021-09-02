import React from 'react';
import {View} from 'react-native';
import * as Switch from 'react-native-customisable-switch';

const CustomSwitch = () => {
  return (
    <>
      <Switch
        defaultValue={true}
        activeText={''}
        inactiveText={''}
        fontSize={16}
        activeTextColor={'rgba(255, 255, 255, 1)'}
        inactiveTextColor={'rgba(255, 255, 255, 1)'}
        activeBackgroundColor={'rgba(50, 163, 50, 1)'}
        inactiveBackgroundColor={'rgba(137, 137, 137, 1)'}
        activeButtonBackgroundColor={'rgba(255, 255, 255, 1)'}
        inactiveButtonBackgroundColor={'rgba(255, 255, 255, 1)'}
        switchWidth={70}
        switchHeight={30}
        switchBorderRadius={0}
        switchBorderColor={'rgba(0, 0, 0, 1)'}
        switchBorderWidth={0}
        buttonWidth={25}
        buttonHeight={25}
        buttonBorderRadius={0}
        buttonBorderColor={'rgba(0, 0, 0, 1)'}
        buttonBorderWidth={0}
        animationTime={150}
        padding={true}
        onChangeValue={(value) => {
          console.log(value);
        }}
      />
    </>
  );
};

export default CustomSwitch;
