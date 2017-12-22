import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import Slideshow from '../routes/slideshow';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';
import FhPxService from '../service/500px-service';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
	let fhpxService = new FhPxService();
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" fhpxService={fhpxService} />
					<Slideshow path="/slideshow" fhpxService={fhpxService} />
					<Profile path="/profile/:user" />
				</Router>
			</div>
		);
	}
}
