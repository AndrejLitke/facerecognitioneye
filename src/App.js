import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

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
                // interactivity: {
                //     detect_on: "canvas",
                //     events: {
                //       onhover: {
                //         enable: true,
                //         mode: "repulse"
                //       }
                //     }
                //   }
            	  };

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
  }

  onSubmit = () => {
    // predict the contents of an image by passing in a url
    // the first string is the model id for face recognition
    clarifaiApp.models.predict("a403429f2ddf4b49b307e318f00e528b", 'https://samples.clarifai.com/face-det.jpg').then(
      function(response) {
        console.log(response);
      },
      function(err) {
        console.error(err);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOptions}
            />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit} />
        {/*
        <FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
