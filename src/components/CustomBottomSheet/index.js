import React, {Component} from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';

class CustomBottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      panY: new Animated.Value(Dimensions.get('screen').height),
    };
    this._resetPositionAnim = Animated.timing(this.state.panY, {
      toValue: 0,
      duration: 300,
    });
    this._closeAnim = Animated.timing(this.state.panY, {
      toValue: Dimensions.get('screen').height,
      duration: 500,
    });
    this._panResponders = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: this.state.panY}]),
      onPanResponderRelease: (e, gs) => {
        if (gs.dy > 0 && gs.vy > 2) {
          return this._closeAnim.start(() => this.props.onDismiss());
        }
        return this._resetPositionAnim.start();
      },
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      this._resetPositionAnim.start();
    }
  }
  _handleDismiss() {
    this._closeAnim.start(() => this.props.onDismiss());
  }

  render() {
    const top = this.state.panY.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0, 0, 1],
    });

    return (
      <Modal
        animated
        animationType="fade"
        visible={this.props.visible}
        transparent
        onRequestClose={() => this._handleDismiss()}>
        {/* <TouchableWithoutFeedback onPress={() => this._handleDismiss()}> */}
        <View style={styles.overlay}>
          <Animated.View style={[styles.container, {top}]} onPress={null}>
            {this.props.children}
          </Animated.View>
        </View>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    // paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
});

export default CustomBottomSheet;
