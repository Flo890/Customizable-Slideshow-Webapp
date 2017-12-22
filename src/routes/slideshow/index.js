import { h, Component } from 'preact';
import { bind } from 'decko';
import {route} from 'preact-router';

export default class Slideshow extends Component {



	componentWillMount() {

		let fhpxService = this.props.fhpxService;

		fhpxService.initFhpx();

		setInterval(() => {
			let nextImg = fhpxService.getNextImage();
			console.log(nextImg);
			this.setState({
				currentImage: nextImg
		});}, 5000);
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