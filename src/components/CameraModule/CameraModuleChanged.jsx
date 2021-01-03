import React from "react";
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
import axios from "axios";
import Spinner from "../SpinnerV3/Spinner";
const API_URL =
  "https://aws-rekognition-api.herokuapp.com/rekog/searchFacesByImage";

const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDlmNTE2NDAzZDUxZjAwMTdlNWJmZDUiLCJpYXQiOjE1NzA3MjIxNDh9.HVCQmVCHIL_EzAeskRI_V8v7Z1CJ4t8gPtSY6IWPwxc";
const headers = {
  "Content-Type": "application/json",
  Authorization: JWT_TOKEN
};

const styles = {
	button: { "height": "fit-content", "width": "fit-content", "zIndex": "2", "position": "absolute", "left": "50%", "bottom": "20%", "transform": "translate(-50%,-50%)", "fontSize": "xx-large", "border": "0", "padding": "10px 20px", "borderRadius": "8px", "opacity": "0.6", "fontFamily": "monospace" },
	video: { "zIndex": "1", "height": "80vh" },
	spinner: { "zIndex": "2" },
	render: {  "display": "flex", "flexDirection": "column" }
}

class CameraModule extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.cameraPhoto = null;
    this.videoRef = React.createRef();
    this.state = {
      isLoading: false
    }
  }

  componentDidMount () {
    // We need to instantiate CameraPhoto inside componentDidMount because we
    // need the refs.video to get the videoElement so the component has to be
    // mounted.
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    let facingMode = FACING_MODES.USER;
    let idealResolution = { width: 640, height: 480 };
    this.startCamera(facingMode, idealResolution);
    }

	onTakePhoto(dataUri) {
    this.setState({ isLoading: true });
    const data = {
      file: dataUri
    };
    console.log(data);
    axios
      .post(API_URL, data, {
        headers: headers
      })
      .then(response => {
        console.log(response);
        this.setState({
          isLoading: false,
          ImageUrl: response.data.ImageUrl
        });
        console.log(this.state.FaceMatches);
        this.props.myfunc(this.state.ImageUrl);
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false });
      });
  }

  startCamera (idealFacingMode, idealResolution) {
    this.cameraPhoto.startCamera(idealFacingMode, idealResolution)
      .then(() => {
        console.log('camera is started !');
      })
      .catch((error) => {
        console.error('Camera not started!', error);
      });
  }

  takePhoto () {
    const config = {
      sizeFactor: 0.5
    };

    let dataUri = this.cameraPhoto.getDataUri(config);
    // this.setState({ dataUri });
      this.onTakePhoto(dataUri);
  }


  render () {
    return (
      <div style={styles.render}>
				<video
					style={styles.video}
          ref={this.videoRef}
          autoPlay={true}
            />
        <button style={styles.button} onClick={ () => {
          this.takePhoto();
        }}> Take photo </button>
          <div style={styles.spinner}>{this.state.isLoading ? <Spinner /> : null}</div>
      </div>
    );
  }
}

export default CameraModule;