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
				<h3>500px settings</h3>
				<p>show photos from feeds</p>
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
				<p>show photos from users</p>
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

				<Slider
					discrete
					min={0}
					max={100}
					value={20}
					onChange={v => console.log('change:', v)}
					onInput={v => console.log('input:', v)}
				/>
			</div>
		);
	}

	render() {

		let fhpxSettings = this.buildfhpxSettings();

		return (
			<div className="home" style={style.home}>
				<Card className="left-card">
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
						}} />500px
					</Button>

					<Button raised className="start-button" onClick={() => {
						this.onStartSlideshow();
					}}
					>Start Slideshow<i class="material-icons">play_arrow</i></Button>

				</Card>
				<div className="right-area">
					<h2>Hello!</h2>
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
						Hello Header
					</Drawer.TemporaryDrawerHeader>
					<Drawer.TemporaryDrawerContent dir="ltr">
						{fhpxSettings}
					</Drawer.TemporaryDrawerContent>
					<Drawer.DrawerItem dir="ltr" selected>Item2</Drawer.DrawerItem>
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
}
