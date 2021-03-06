import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions={
                particles: {
                  number:{
                      value:100,
                      density:{
                        enable:true,
                        value_area:800
                      }
                  },
                  line_linked: {
                      shadow: {
                        enable: true,
                        color: "#3CA9D1",
                        blur: 5
                      }

                  // interactivity:{
                  //     onhover:{
                  //       enable:true
                  //   },
                  // move:{
                  //   enable:false
                  // }
                  // }
                  // }
                }
              }
}

const initialState={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user:{      // user 是 profile
          id:'',
          name:'',
          email:'',
          entries:0,
          joined:''
      }
} 

class App extends Component {
  constructor(){
    super();
    this.state=initialState;
  }

  loadUser = (data) => {
    this.setState({user:{
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
      }
    })
 }

  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response=>response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation=(data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box; //只要response中的那一组数
    const image =document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {                                      //return an object
      leftCol:clarifaiFace.left_col*width,
      rightCol:width-clarifaiFace.right_col*width,
      topRow:clarifaiFace.top_row*height,
      bottomRow:height-clarifaiFace.bottom_row*height
    }
  }

  displayFacebox = (box_obj)=>{
    this.setState({box:box_obj});
  }

  onInputChange = (event)=>{
    this.setState({input:event.target.value});
  }


  onButtonSubmit = ()=>{     //onPictureSubmit
    this.setState({imageUrl:this.state.input})
    // app.models
    // .predict(
    //   Clarifai.FACE_DETECT_MODEL, 
    //   this.state.input)   //这里不能是this.state.imageUrl
    fetch( 'https://murmuring-sea-01312.herokuapp.com/imageurl',{
          method:'post',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            input:this.state.input
          })
        })
    .then(response=>response.json())
//////////////
    .then(response => {
      if (response){
        fetch( 'https://murmuring-sea-01312.herokuapp.com/image',{
          method:'put',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            id:this.state.user.id
          })
        })
          .then(response=>response.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user,{entries:count}))
          })
          .catch(console.log)
      }
      this.displayFacebox(this.calculateFaceLocation(response))
    })
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    .catch(err=>console.log(err))
      // there was an error
  }

  onRouteChange=(route)=>{
    if (route === 'signout'){
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }


render(){
    const {isSignedIn,route,box,imageUrl} = this.state
    return ( 
      <div className="App">
        <Particles className='particles' params={particlesOptions}/> 
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route==='signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : (route ==='home'
            ? <div>
                <Logo />
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )          
        }
      </div>
    );
  } 
  
}

export default App;





















