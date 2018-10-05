import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import * as Routes from './routes.js';

// instantiate a new Clarifai app passing in your api key.
const clarifaiApp = new Clarifai.App({
  apiKey: '6a67eeca32e54ea79be6202e8a4957e5'
});


const particlesOptions = {
            		particles: {
            			number: {
                    value: 50,
                    density: {
                      enable: true,
                      value_area: 600
                    }
                  }
                },
            	};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: Routes.SIGNINROUTE,
      isSignedIn: false,
    }
  }

  componentDidMount() {
    console.log('hallo welt');
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});

    // predict the contents of an image by passing in a url
    // the first string is the model id for face recognition
    clarifaiApp.models
    // .predict("a403429f2ddf4b49b307e318f00e528b", this.state.input)
    .predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then((response) => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChanged = (route) => {
    if (route === Routes.SIGNINROUTE) {
      this.setState({isSignedIn : false})
    } else if (route === Routes.HOME) {
      this.setState({isSignedIn : true})
    } else if (route === Routes.SIGNOUTROUTE) {
      this.setState({isSignedIn : false})
    }
    
    this.setState({route: route});
  }

  render() {

    const { box, isSignedIn, route, imageUrl } = this.state;

    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation isSignedIn={isSignedIn} onRouteChanged={this.onRouteChanged} />
        { route === Routes.HOME 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
          :
          (
            this.state.route === Routes.SIGNINROUTE
            ? <Signin onRouteChanged={this.onRouteChanged}/>
            : <Register onRouteChanged={this.onInputChange} />
          )
        }
      </div>
    );
  }
}

export default App;
