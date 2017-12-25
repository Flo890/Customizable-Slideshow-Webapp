import { config } from '../config.js';
import '../../lib/500px';

export default class FhPxService {

	/*
	500px sdk: https://github.com/500px/500px-js-sdk
	api: https://github.com/500px/api-documentation
	 */

	sourceSettings = {
		features: {
			// default settings again; these here just in case someone directly goes to slideshow by url (so the set settings method was not called)
			standards: ['popular'],
			users: ['flobe94']
		}
	}
	images = []
	isLoading = false
	isInitialized = false;

	isLoggedIn(){
		return true;
	}

	initFhpx() {
		if (!this.isInitialized) {
			_500px.init({
				sdk_key: config.FHPX_JS_SDK_KEY
			});
			this.isInitialized = true;
		}
	}

	setFhpxSourceSettings(settings){
		this.sourceSettings = settings;
	}

	getNextImagePromise(){
		return new Promise((resolve,reject) => {
			if (this.images.length < 3 && !this.isLoading) {
				// load new images
				this.loadImages(() => {
					resolve(this.images.splice(0,1)[0]);
				},
				error => {
					reject(error);
				});
			}
			else {
				resolve(this.images.splice(0,1)[0]);
			}
		});
	}

	loadImages(successCallback,errorCallback) {
		let imageSizeParam = this.getBestFittingImageSize();
		// create promises for each type of image to load
		let loadImagesPromises = [];
		this.sourceSettings.features.standards.forEach(aFeature => {
			loadImagesPromises.push(new Promise((resolve, reject) => {
				_500px.api('/photos', {
					feature: aFeature,
					sort: 'created_at',
					sort_direction: 'desc',
					page: 1,
					image_size: imageSizeParam
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
		this.sourceSettings.features.users.forEach(username => {
			loadImagesPromises.push(new Promise((resolve, reject) => {
				_500px.api('/photos', {
					feature: 'user',
					username,
					sort: 'created_at',
					sort_direction: 'desc',
					page: 1,
					image_size: imageSizeParam
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
			successCallback();
		}, error => {
			// one or more failed
			console.error(`one or more promises failed: ${error}`);
			errorCallback(error);
			this.isLoading = false;
		});
	}

	getBestFittingImageSize(){
		let height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
		if (height > 1080) {
			return 2048; // 2048 on longest edge
		}
		else if (height > 600) {
			return 6; // 1080 px high
		}
		else if (height > 450) {
			return 21; // 600 px high
		}
		return 31; // 450 px high
		
	}

}