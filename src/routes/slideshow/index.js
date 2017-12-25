import { h, Component } from 'preact';
import { bind } from 'decko';
import {route} from 'preact-router';

import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import LinearProgress from 'preact-material-components/LinearProgress';
import 'preact-material-components/LinearProgress/style.css';

/**
 * @property spi: seconds per image ( -> slideshow speed)
 */
export default class Slideshow extends Component {

	state = {
		controlsVisible: false,
		controlsVisibleInterval: null,
		isPaused: false
	};

	@bind
	showNextImg() {
		this.props.fhpxService.getNextImagePromise().then(nextImg => {
				console.log('next image:',nextImg);

				this.setState({
					currentImage: nextImg
				});
			},
			error => {
				alert('loading images failed');
			});
	}

	componentDidMount() {
		this.showControls();

		this.props.fhpxService.initFhpx();

		this.unpauseSlideshow();
	}

	render() {
		let image =  <LinearProgress progress={this.state.progress} accent={true} />;
		if (this.state.currentImage) {
			image = <img id="main-img" src={this.state.currentImage.image_url} />;
		}

		return (
			<div id="slideshow-container" onMouseMove={() => {
				this.showControls();
			}} onTouchStart={() => {this.showControls()}}>
				{image}
				<div id="slideshow-controls-overlay" style={{display: (this.state.controlsVisible ? 'block' : 'none')}} >
					<Button className="close-button" onClick={() => {
						this.leaveSlideshow();
					}}
					>
						<i class="material-icons">close</i>
					</Button>
					<div className="bottom-bar">
						<Button disabled><i className="material-icons">navigate_before</i></Button>
						<Button style={{display: (this.state.isPaused ? 'none' : 'block')}}><i className="material-icons" onClick={() => {
							this.pauseSlideshow();
						}}>pause_circle_outline</i></Button>
						<Button style={{display: (this.state.isPaused ? 'block' : 'none')}}><i className="material-icons" onClick={() => {
							this.unpauseSlideshow();
						}}>play_circle_outline</i></Button>
						<Button onClick={() => {this.showNextImg();}}><i className="material-icons">navigate_next</i></Button>
					</div>
				</div>
			</div>
		);
	}

	componentWillUnmount() {
		this.pauseSlideshow();
	}

	@bind
	leaveSlideshow() {
		route('/');
	}

	@bind
	showControls() {
		if (this.state.controlsVisibleInterval){
			clearInterval(this.state.controlsVisibleInterval);
		}
		this.setState({
			controlsVisible: true,
			controlsVisibleInterval: setInterval(() => {
				// hide controls
				this.setState({
					controlsVisible: false
				});
			},5000)
		});
	}

	@bind
	pauseSlideshow() {
		this.setState({
			isPaused: true
		});
		clearInterval(this.state.slideshowInterval);
	}

	@bind
	unpauseSlideshow() {
		this.setState({
			isPaused: false
		});
		this.showNextImg();
		this.state.slideshowInterval = setInterval(() => {
			this.showNextImg();
		}, (this.props.spi ? this.props.spi : 5)*1000);
	}
}