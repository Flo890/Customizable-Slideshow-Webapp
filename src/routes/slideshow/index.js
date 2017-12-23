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
			let nextImg = fhpxService.getNextImage();
			console.log(nextImg);
			this.setState({
				currentImage: nextImg
			});
		}

		showNextImg();
		setInterval(() => {
			showNextImg();
			}, this.props.spi*1000);
	}

	render() {

		let image = <p>TODO loading spinner</p>;
		if (this.state.currentImage) {
			image = <img src={this.state.currentImage.image_url} />;
		}

		return (
			<div>
				<h1>Slideshow</h1>
				{image}
			</div>
		);
	}
}