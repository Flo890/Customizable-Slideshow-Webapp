import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import Button from 'preact-material-components/Button';
import 'preact-material-components/Button/style.css';
import Checkbox from 'preact-material-components/Checkbox';
import 'preact-material-components/Checkbox/style.css';
import Drawer from 'preact-material-components/Drawer';
import 'preact-material-components/Drawer/style.css';
import Slider from 'preact-material-components/Slider';
import 'preact-material-components/Slider/style.css';
import TextField from 'preact-material-components/TextField';
import 'preact-material-components/TextField/style.css';
import Icon from 'preact-material-components/Icon';
import 'preact-material-components/Icon/style.css';
import style from './style';

import { bind } from 'decko';
import { route } from 'preact-router';

export default class Home extends Component {

	constructor() {
		super();
		this.state = {
			drawerOpen: false,
			sources: {
				fhpx: {
					// default settings for 500px slideshow
					isSelected: true,
					features: {
						standards: ['popular'],
						users: ['flobe94']
					}
				}
			},
			settings: {
				secondsPerImg: 5
			}
		};
	}

	buildfhpxSettings() {

		let fhpxStandardFeatures = [
			// "features" according to the 500px api
			{ shortname: 'popular', displayname: 'Popular' },
			{ shortname: 'highest_rated', displayname: 'Highest Rated' },
			{ shortname: 'upcoming', displayname: 'Upcoming' },
			{ shortname: 'editors', displayname: 'Editor\'s Choice' },
			{ shortname: 'fresh_today', displayname: 'Fresh' }
		];
		return (
			<div>
				<h4>show photos from feeds</h4>
				{
					fhpxStandardFeatures.map(aFeature => (
						<div className="mdc-form-field">
							<Checkbox
								checked={this.state.sources.fhpx.features.standards.includes(aFeature.shortname) || false}
								onChange={e => {
									if (e.target.checked){
										this.state.sources.fhpx.features.standards.push(aFeature.shortname);
										this.setStateChanged();
									}
									else {
										let index = this.state.sources.fhpx.features.standards.indexOf(aFeature.shortname);
										this.state.sources.fhpx.features.standards.splice(index,1);
										this.setStateChanged();
									}
								}}
							/><label>{aFeature.displayname}</label>
						</div>
					))
				}
				<h4>show photos from users</h4>
				{
					this.state.sources.fhpx.features.users.map(aUser => (
						<div className="mdc-form-field">
							<Checkbox checked
									  onChange={e => {
										  if (e.target.checked){
											  // should usually not occur I think
										  }
										  else {
										  	// remove this user
											  let index = this.state.sources.fhpx.features.users.indexOf(aUser);
											  this.state.sources.fhpx.features.users.splice(index,1);
											  this.setStateChanged();
										  }
									  }}
							/>
							<label>{aUser}</label>
						</div>
					))
				}
				<div className="mdc-form-field">
					<TextField label="500px username"  ref={dlg => {
						this.dlg = dlg;
					}} />
					<Button onClick={() => {
						console.log(this.dlg.MDComponent); //TODO bug: after having removed one username, this.dlg is undefined -> cannot add new username
						this.state.sources.fhpx.features.users.push(this.dlg.MDComponent.input_.value);
						this.setStateChanged();
					}}>
						<Button.Icon>check</Button.Icon>
					</Button>
				</div>

					<h4>slideshow speed (seconds per image)</h4>
					{/*<Slider //TODO bug: only works after adding or removing a user*/}
						{/*dir="ltr"*/}
						{/*discrete*/}
						{/*min={1}*/}
						{/*max={20}*/}
						{/*value={this.state.settings.secondsPerImg}*/}
						{/*onChange={v => {*/}
							{/*// fires when slider movement finished*/}
							{/*this.setState({*/}
								{/*settings: {*/}
									{/*secondsPerImg: v*/}
								{/*}*/}
							{/*});*/}
							{/*console.log(`new slider value ${v}`);*/}
						{/*}}*/}
						{/*onInput={v => {*/}
							{/*// // fires on every slider movement*/}
							{/*// this.setState({*/}
							{/*// 	settings: {*/}
							{/*// 		secondsPerImg: v*/}
							{/*// 	}*/}
							{/*// });*/}
							{/*// console.log(`new slider value ${v}`);*/}
						{/*}}*/}
					{/*/>*/}
				<div className="spi-plusminus">
					<Button onClick={() => {
						this.setState({
							settings: { secondsPerImg: this.state.settings.secondsPerImg-1 }
						});
					}}>-1</Button><p className="spi-text">{this.state.settings.secondsPerImg}s</p><Button onClick={() => {
					this.setState({
						settings: { secondsPerImg: this.state.settings.secondsPerImg+1 }
					});
				}}>+1</Button>
				</div>
			</div>
		);
	}

	render() {

		let fhpxSettings = this.buildfhpxSettings();

		return (
			<div className="home" style={style.home}>

				<div className="bottom-area">
					<div className="background-placeholder">
						<img src="../../assets/bgPhoto1a-s.jpg"/>
					</div>
					<h1>What is this?</h1>
					<p>The customizable slideshow webapp transforms your tablet or any other webbrowser-having device into a digital picture frame.
						You can configure which images to show, currently supporting the 500px image platform. <br/>Stay tuned, other sources like cloud storings or uploading
						your own images will follow!</p>

					<div className="footer-box">
						<div><a href="https://www.tf-fotovideo.de/"><p>Creator's Homepage</p></a></div>
						<div><a href="https://www.tf-fotovideo.de/kontakt"><p>Contact</p></a></div>
						<div><a href="https://www.tf-fotovideo.de/kontakt"><p>Impressum</p></a></div>
					</div>
				</div>

				<Card className="left-card">
					<h3>select image sources</h3>
					<Button raised className="source-selector" onClick={() => {
						this.setState({
							drawerOpen: true
						});
					}}
					>
						<Checkbox
							checked={this.state.sources.fhpx.isSelected || false}
							onChange={e => {
								this.setState({
									sources: { fhpx: { isSelected: e.target.checked}}
								});
						}} />500px<i class="material-icons">settings</i>
					</Button>

					<Button raised className="start-button" onClick={() => {
						this.onStartSlideshow();
					}}
					>Start Slideshow<i class="material-icons">play_arrow</i></Button>

				</Card>
				<div className="right-area">
					<h2>Welcome to the customizable Slideshow Webapp!</h2>
				</div>


				<Drawer.TemporaryDrawer
					className="right-settings-drawer"
					dir="rtl"
					ref={drawer => {
						this.drawer = drawer;
					}}
					open={this.state.drawerOpen}
					onOpen={() => {
						console.log('open');
					}}
					onClose={() => {
						this.setState({
							drawerOpen: false
						});
						console.log('Closed');
					}}
				>
					<Drawer.TemporaryDrawerHeader dir="ltr">
						<Button className="close-button" onClick={() => {
							this.setState({
								drawerOpen: false
							});
						}}
						>
							<i class="material-icons">close</i>
						</Button>
						<h3>500px settings</h3>
					</Drawer.TemporaryDrawerHeader>
					<Drawer.TemporaryDrawerContent dir="ltr" className="drawer-content-container">
						{fhpxSettings}
					</Drawer.TemporaryDrawerContent>
				</Drawer.TemporaryDrawer>

			</div>
		);
	}

	@bind
	onStartSlideshow() {
		if (this.state.sources.fhpx.isSelected === true) {
			let fhpxService = this.props.fhpxService;
			fhpxService.setFhpxSourceSettings(this.state.sources.fhpx);
			console.log(fhpxService.isLoggedIn());
		}
		route(`/slideshow?spi=${this.state.settings.secondsPerImg}`);
	}

	setStateChanged(){
		// TODO find a better way
		this.setState({
			something: Math.random()
		});
	}

	componentDidMount() {

		const gaurl = 'https://www.googletagmanager.com/gtag/js?id=UA-55880750-1';

			(function (i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function () {
					(i[r].q = i[r].q || []).push(arguments)
				}, i[r].l = 1 * new Date();
				a = s.createElement(o),
					m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m)
			})(window, document, 'script', gaurl, 'ga');


			window.dataLayer = window.dataLayer || [];

			function gtag() {
				dataLayer.push(arguments);
			}

			gtag('js', new Date());

			gtag('config', 'UA-55880750-1');


	}
}
