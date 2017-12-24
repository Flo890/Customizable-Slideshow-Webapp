import { h, Component } from 'preact';
import { bind } from 'decko';
import {route} from 'preact-router';

/**
 * @property spi: seconds per image ( -> slideshow speed)
 */
export default class Slideshow extends Component {

	componentWillMount() {

		let fhpxService = this.props.fhpxService;

		fhpxService.initFhpx();

		let showNextImg = () => {
			fhpxService.getNextImagePromise().then(nextImg => {
				console.log('next image:',nextImg);

				this.setState({
					currentImage: nextImg
				});
			},
			error => {
				alert('loading images failed');
			});
		}

		showNextImg();
		setInterval(() => {
			showNextImg();
			}, (this.props.spi ? this.props.spi : 5)*1000);
	}

	render() {

		let image = <p>TODO loading spinner</p>;
		if (this.state.currentImage) {
			image = <img id="main-img" src={this.state.currentImage.image_url} />;
		}

		return (
			<div id="slideshow-container">
				{image}
			</div>
		);
	}
}