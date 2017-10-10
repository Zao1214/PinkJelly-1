import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { SimpleLineIcons, Entypo } from '@expo/vector-icons';

const ControlBar = ({ screen, snapshot, setDetectionData, setYoloType, yoloType }) => {
  const controlBar = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    backgroundColor: yoloType === 'simple' ? '#82b1ff' : '#ee6e73',
  };

  switch (screen) {
    case 'CAMERA':
      const icon = yoloType === 'simple' ? 'camera' : 'magic-wand';

      return (
        <View style={controlBar}>
          <View style={styles.typeChange}>
            <Text style={styles.typeChangeText} onPress={() => setYoloType()}>{yoloType}</Text>
          </View>
          <View style={styles.circle} >
            <SimpleLineIcons name={icon} size={32} color="#fff" onPress={() => snapshot()}/>
          </View>
        </View>
      );
    case 'PHOTO':
      return (
        <View style={controlBar}>
          <Entypo name="back" size={32} color="#fff" onPress={() => setDetectionData([])}/>
        </View>
      );
    default:
      alert('No Screen');
  }

}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 64,
    backgroundColor: 'transparent'
  },
  typeChange: {
    position: 'absolute',
    top: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    padding: 4,
  },
  typeChangeText: {
    color: '#fff',
    fontSize: 14,
  },
});

ControlBar.propTypes = {
  screen: PropTypes.string,
  snapshot: PropTypes.func,
  snapshotFunny: PropTypes.func,
  setDetectionData: PropTypes.func,
  setYoloType: PropTypes.func,
  yoloType: PropTypes.string,
};

export default ControlBar;
