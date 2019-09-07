import React, { Component } from "react";
// import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import getWeb3 from "./utils/getWeb3";
import {Button} from 'reactstrap';
import FileUpload from "./Files/FileUpload";

import "./App.css";
import web3Obj from './helper'

// Components
import Map from './Map/Map';

class App extends React.Component {
  state = {
    account: '',
    balance: '',
    page:'Map',
    loggedIn: false,
    userLocation: {lat: '', long: ''},
    distance:''
  }

  componentDidMount() {
    const isTorus = sessionStorage.getItem('pageUsingTorus')
    if (isTorus) {
      web3Obj.initialize().then(() => {
        this.setStateInfo()
        this.setState({
          loggedIn: true
        })
      })
    }
    if (!isTorus) {
      this.setState({
        loggedIn: false
      })
    }
  }

  setStateInfo = () => {
    web3Obj.web3.eth.getAccounts().then(accounts => {
      this.setState({ account: accounts[0] })
      web3Obj.web3.eth.getBalance(accounts[0]).then(balance => {
        this.setState({ balance: balance })
      })
    })
  }

  enableTorus = async () => {
    try {
      await web3Obj.initialize()
      this.setStateInfo()
      this.setState({
        loggedIn: true
      })
    } catch (error) {
      console.error(error)
    }
  }

  disableTorus = async () => {
    try {
      await web3Obj.logout().then(()=>{
        this.setState({
          loggedIn: false
        })
        sessionStorage.clear();
      })
    } catch (error) {
      console.error(error)
    }
  }
  checkMapLocation = (lat, long, distance) => {

    if(distance < .3){
      this.setState({
        onLocation: true,
        userLat: lat,
        userLong: long
      })
    }else{
      this.setState({
        onLocation: false
      })
    }

  }
  
  
  render() {
    console.log("current state of loggedIn",this.state.loggedIn)
    let {page} = this.state;
    return (
      <div className="App">
        <FileUpload />
        <div onClick={this.getGeo}>get geo</div>
        {this.state.loggedIn === true ? 
          <div style={{height: '100%'}}> 
            <div className="page-header">
                <h4>AnonHero | {page} </h4>
                <Button className='logout-btn' onClick={this.disableTorus}>Logout</Button>
            </div>
            <Map checkMapLocation={this.checkMapLocation}/>
            {/* <div className="default-padding">
                <div>
                  {this.state.account ? <div>Account: {this.state.account}</div> : null}
                  {(this.state.balance && (this.state.balance != 0)) ? <div>Balance: {this.state.balance}</div> : null}
                </div>
              </div> */}
          </div>
          :
          <div className="login-container default-padding">
            <h1 className="logo">Anon Hero</h1>
            <div>
              <Button  className="login-btn" onClick={this.enableTorus}>Login</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default App;
