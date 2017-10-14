import {
  AWS_S3_KEY_PREFIX,
  AWS_S3_BUCKET_NAME,
  AWS_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  AWS_EC2,
} from 'react-native-dotenv';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Camera, Permissions } from 'expo';
import * as firebase from 'firebase';
import axios from 'axios';
import { RNS3 } from 'react-native-aws3';

import ControlBar from '../components/ControlBar';

export default class CameraScreen extends Component {
  state = {
    hasCameraPermission: false,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snapshot() {
    const { setImagePath, setLoadingStatus, setDetectionData, yoloType } = this.props;
    const user = firebase.auth().currentUser;

    if (this.camera) {
      this.camera.takePictureAsync()
        .then(data => {
          const { uri } = data;
          const file = {
            uri: uri,
            name: `${user.email}-image.jpg`,
            type: "image/jpg"
          }

          const options = {
            keyPrefix: AWS_S3_KEY_PREFIX,
            bucket: AWS_S3_BUCKET_NAME,
            region: AWS_REGION,
            accessKey: AWS_ACCESS_KEY,
            secretKey: AWS_SECRET_KEY,
            successActionStatus: 201,
          }
          setImagePath(uri);

          return RNS3.put(file, options).then(response => {
            if (response.status !== 201) {
              throw new Error("Failed to upload image to S3");
            }
          });
        })
        .then(() => {
          setLoadingStatus(true);
          axios.post(AWS_EC2, {
            userEmail: user.email,
            yoloType,
          })
            .then(res => {
              if (!res.data.length) {
                return alert(`We can't detect anything. Please take a new picture.`);
              }
              setDetectionData(res.data);
            })
            .then(() => setLoadingStatus(false))
          })
          .catch(err => console.log(err));
    }
  }

  render() {
    const { hasCameraPermission } = this.state;
    const { setYoloType, yoloType } = this.props;
    if (!hasCameraPermission) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.screenContainer}>
          <Camera ref={ref => { this.camera = ref; }} style={styles.camera}/>
          <ControlBar screen="CAMERA" snapshot={this.snapshot.bind(this)} setYoloType={setYoloType} yoloType={yoloType}/>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  camera: {
    flex: 9,
  },
  viewport: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

CameraScreen.propTypes = {
  setImagePath: PropTypes.func,
  setLoadingStatus: PropTypes.func,
  setDetectionData: PropTypes.func,
  setYoloType: PropTypes.func,
  yoloType: PropTypes.string,
};
