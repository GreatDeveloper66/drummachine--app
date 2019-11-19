/*jshint esversion:6*/
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider from 'react-rangeslider';
import {Howl, Howler} from 'howler';

	const data = [
			["Q","Heater 1","https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3", 81],
			["W","Heater 2","https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3", 87],
			["E","Heater 3","https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3", 69],
			["A","Heater 4","https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3", 65],
			["S","Clap","https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3", 83],
			["D","Open HH","https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3", 68],
			["Z","Kick n' Hat","https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3", 90],
			["X","Kick","https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3", 88],
			["C","Closed HH","https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3", 67]
	];

//deaultState
const defaultState = {
	power: false,
	recording: false,
	playing: false,
	buttonPlaying: -1,
	volume: 0.30,
	buttonPressed: -1,
	recordingSequence: [],
	display: "Play the Game"
};

class DrumPad extends Component {
	constructor(props){
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
	}
	
	componentDidMount()  {
		document.addEventListener("keydown", this.onKeyPress);
	}

componentWillUnmount(){
	document.removeEventListener("keydown", this.onKeyPress);
}

onKeyPress(e) {
	if(e.keyCode === this.props.keyCode){
		this.props.clickPad();
	}
}
	
	render(){
		const letter = this.props.id;
		const id = this.props.id + 'pad';
		return(
		<button class="drum-pad" id={id} onClick={this.props.clickPad} disabled={!this.props.disable}>
			<p>{letter}</p>
		</button>
			);
	}
}

class PadsBoard extends Component {
	constructor(props){
		super(props);
	}
	
	render(){
		return(
			<div class="padsBoard">
					<DrumPad id={data[0][0]} keyCode = {data[0][3]} clickPad={() => this.props.clickPad(0)} disable={this.props.disable} />
					<DrumPad id={data[1][0]} keyCode = {data[1][3]} clickPad = {() => this.props.clickPad(1)} disable={this.props.disable}/>
					<DrumPad id={data[2][0]} keyCode = {data[2][3]} clickPad = {() => this.props.clickPad(2)} disable={this.props.disable}/>
					<DrumPad id={data[3][0]} keyCode = {data[3][3]} clickPad = {() => this.props.clickPad(3)} disable={this.props.disable}/>
					<DrumPad id={data[4][0]} keyCode = {data[4][3]} clickPad = {() => this.props.clickPad(4)} disable={this.props.disable}/>
					<DrumPad id={data[5][0]} keyCode = {data[5][3]} clickPad = {() => this.props.clickPad(5)} disable={this.props.disable}/>
					<DrumPad id={data[6][0]} keyCode = {data[6][3]} clickPad={() => this.props.clickPad(6)} disable={this.props.disable}/>
					<DrumPad id={data[7][0]} keyCode = {data[7][3]} clickPad={() => this.props.clickPad(7)} disable={this.props.disable}/>
					<DrumPad id={data[8][0]} keyCode = {data[8][3]} clickPad={() => this.props.clickPad(8)} disable={this.props.disable}/>
			</div>
		);
	}
}

class AppCore extends Component {
	constructor(props){
		super(props);
		this.state=defaultState;
		this.clickPad = this.clickPad.bind(this);
	 this.recordClick = this.recordClick.bind(this);
		this.powerClick = this.powerClick.bind(this);
		this.playClick = this.playClick.bind(this);
		this.updateVolume = this.updateVolume.bind(this);
																																
	}
	
	clickPad(i){
		
		const recording = this.state.recording;
		let sound = new Howl({src: data[i][2],
																								autoplay: true
																							});
		sound.volume(this.state.volume);
		sound.play();
		const newrecordingSequence = recording ? [...this.state.recordingSequence, i]: this.state.recordingSequence;
		const newDisplay = recording ? "RECORDING" : data[i][1];
    this.setState({
					display: newDisplay,
					buttonPlaying: i,
					buttonPressed: i,
					recordingSequence: newrecordingSequence
				});
		
	}
		
	powerClick(){
		this.setState({
			power: !this.state.power,
			display: "Play the Game",
			buttonPlaying: -1,
			buttonPressed: -1
		});
	}
	
	recordClick(){
		this.setState({
			recording: true,
			display: "RECORDING"
		});
	}

updateVolume(vol) {
	this.setState({
		volume: vol
	});
}
	
playClick() {
  const playSet = [...this.state.recordingSequence];
  const vol = this.state.volume;
  const length = playSet.length;
  this.setState({
    recording: false,
    playing: true,
    display: "PLAYING",
    recordingSequence: []
  });

  for (let i = 0; i < length; i++) {
    setTimeout(function() {
						let newSound = new Howl({ src: data[playSet[i]][2], autoplay: true, volume: vol });
      newSound.play();
    }, (i + 1) * 1000);
  }
	
}
	
	render(){
		
		const display = this.state.power ? "ON" : "OFF";

	return(
	<div>
			<div class="App" id="drum-machine">
		
					<PadsBoard clickPad={this.clickPad} disable={this.state.power}/>
							<div class="controls">
									<button type="button" value = {display} class="power" onClick={this.powerClick}>
										{display}
									</button>
									<div class="display" id="display">
										{this.state.display}
									</div>
									
											<VolumeSlider updateVol = {this.updateVolume} />
									
									<button type="button" class="record" onClick={this.recordClick} disabled={!this.state.power}>
										REC
									</button>
									<button type="button" class="play" onClick={this.playClick} disabled={!this.state.power}>
										PLAY
									</button>
							</div>
					 </div>
		</div>
		)
	}
}


class App extends Component {
		constructor(props){
			super(props);
		}
	
  render() {
    return (
					<html>
					<body>
      <AppCore />
					
					</body>
					</html>
    );
  }
}


class VolumeSlider extends Component {
  constructor(props, context) {
    super(props, context)
				this.state = {
					volume: 5
				}
		}
			
	changeVolume = (volume) => {
		this.setState({
				volume: volume
		});
		this.props.updateVol(volume/10);
	}
  render() {
    return (
					<div class="volumebar">
      <Slider
								min={0}
								max={10}
								value={ this.state.volume }
        orientation="horizontal"
								onChange={ this.changeVolume }
      />
					</div>
    );
  }
}

export default App;
