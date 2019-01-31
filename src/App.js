import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import './App.css';
import * as Routes from './routes.js';

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
              
const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: Routes.SIGNINROUTE,
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
 

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: 
        {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
        }
    });
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
    this.setState({box: box});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                input: this.state.input
              })
    })
    .then((response) => response.json())
    .then((response) => {
      this.displayFaceBox(this.calculateFaceLocation(response));
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          console.log(count)
          if (count) {
            this.setState(Object.assign(this.state.user, {entries: count}));
          }
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log('predict error: ' + err));
  }

  onRouteChanged = (route) => {
    if (route === Routes.SIGNINROUTE) {
      this.setState(initialState)
    } else if (route === Routes.HOME) {
      this.setState({isSignedIn : true})
    } else if (route === Routes.SIGNOUTROUTE) {
      this.setState(initialState)
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
              <Rank 
              name={this.state.user.name} 
              entries={this.state.user.entries} />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onSubmit={this.onSubmit} />
              <FaceRecognition imageUrl={imageUrl} box={box} />
            </div>
          :
          (
            this.state.route === Routes.SIGNINROUTE
            ? <Signin 
            loadUser={this.loadUser} 
            onRouteChanged={this.onRouteChanged}/>
            : <Register 
            loadUser={this.loadUser} 
            onRouteChanged={this.onRouteChanged} />
          )
        }
      </div>
    );
  }
}

export default App;
