import { config } from '../config.js';
import '../../lib/500px';

export default class FhPxService {

	/*
	500px sdk: https://github.com/500px/500px-js-sdk
	api: https://github.com/500px/api-documentation
	 */

	quantities = {
		// see https://github.com/500px/api-documentation/blob/master/endpoints/photo/GET_photos.md for allowed standard features
		standards: ['popular'],
		users: ['flobe94']
	}
	images = []
	isLoading = false

	isLoggedIn(){
		return true;
	}

	initFhpx(){
		_500px.init({
			sdk_key: config.FHPX_JS_SDK_KEY
		});
	}

	setSettings(quantities){
		this.quantities = quantities;
	}

	getNextImage(){
		if (this.images.length < 3 && !this.isLoading) {
			// load new images
			this.loadImages();
		}
		return this.images.splice(0,1)[0];
	}

	loadImages() {
		// create promises for each type of image to load
		let loadImagesPromises = [];
		this.quantities.standards.forEach(aFeature => {
			loadImagesPromises.push(new Promise((resolve, reject) => {
				_500px.api('/photos', {
					feature: aFeature,
					sort: 'created_at',
					sort_direction: 'desc',
					page: 1
				}, response => {
					if (response.success) {
						console.log('received response:');
						console.log(response);
						resolve(response.data.photos);
					}
					else {
						reject();
					}
				});
			}));
		});
		this.quantities.users.forEach(username => {
			loadImagesPromises.push(new Promise((resolve, reject) => {
				_500px.api('/photos', {
					feature: 'user',
					username: username,
					sort: 'created_at',
					sort_direction: 'desc',
					page: 1
				}, response => {
					console.log('received response:');
					console.log(response);
					if (response.success) {
						resolve(response.data.photos);
					}
					else {
						reject();
					}
				});
			}));
		});

		// when all promises settled, mix images and put them to the images list
		Promise.all(loadImagesPromises).then(imageArrays => {
			// all loaded
			console.log('all promises fulfilled');
			let mixedImages = [];
			while (imageArrays.length > 0) {
				let amountImageArrays = imageArrays.length;
				let aRandomImagesIndex = Math.floor(Math.random() * amountImageArrays) % amountImageArrays;
				let amountImages = imageArrays[aRandomImagesIndex].length;
				let aRandomImageIndex = Math.floor(Math.random() * amountImages) % amountImages;

				let image = imageArrays[aRandomImagesIndex].splice(aRandomImageIndex, 1)[0];
				mixedImages.push(image);
				// if one list becomes empty, remove it
				if (imageArrays[aRandomImagesIndex].length === 0) {
					imageArrays.splice(aRandomImagesIndex, 1);
				}
			}
			this.images.push(...mixedImages);
			this.isLoading = false;
			console.log('images mixed');
			console.log(mixedImages);
			console.log(this.images);
		}, error => {
			// one or more failed
			console.error(`one or more promises failed: ${error}`);
			this.isLoading = false;
		});
	}

}