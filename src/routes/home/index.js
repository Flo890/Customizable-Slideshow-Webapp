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
import style from './style';

import { bind } from 'decko';
import {route} from 'preact-router';

export default class Home extends Component {

	constructor() {
		super();
		this.state = {
			drawerOpen: false
		};
	}

	render() {
		return (
			<div className="home" style={style.home}>
				<Card className="left-card">
					<Button raised className="source-selector" onClick={() => {
						this.setState({
							drawerOpen: true
						});
					}}>
						<Checkbox />500px
					</Button>

					<Button raised className="start-button" onClick={() => {
						this.onStartSlideshow();
					}}>Start Slideshow<i class="material-icons">play_arrow</i></Button>

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
						console.log("open");
					}}
					onClose={() => {
						this.setState({
							drawerOpen: false
						});
						console.log("Closed");
					}}
				>
					<Drawer.TemporaryDrawerHeader dir="ltr">
						<Button className="close-button" onClick={() => {
							this.setState({
								drawerOpen: false
							});
						}}>
							<i class="material-icons">close</i>
						</Button>
						Hello Header
					</Drawer.TemporaryDrawerHeader>
					<Drawer.DrawerItem dir="ltr">
						<Slider
							discrete
							min={0}
							max={100}
							value={20}
							onChange={v => console.log("change:", v)}
							onInput={v => console.log("input:", v)}
						/>
					</Drawer.DrawerItem>
					<Drawer.DrawerItem dir="ltr" selected={true}>Item2</Drawer.DrawerItem>
				</Drawer.TemporaryDrawer>

			</div>
		);
	}

	@bind
	onStartSlideshow() {
		let fhpxService = this.props.fhpxService;
		console.log(fhpxService.isLoggedIn());
		route('/slideshow');
	}
}
