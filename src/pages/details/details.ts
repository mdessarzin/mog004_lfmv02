import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, ViewController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as $ from "jquery";
import { Http } from '@angular/http';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-details',
	templateUrl: 'details.html',
})
export class DetailsPage {
	link: string;
	title: string;
	text: any;
	date: string;
	image: any;
	cat: string;
	trustedPostUrl: SafeResourceUrl;
	postsLoading: any;
	setHeight: any;
	posts: Array<any> = [];

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private sanitizer: DomSanitizer,
		private socialSharing: SocialSharing,
		public loadingCtrl: LoadingController,
		private ga: GoogleAnalytics,
		public viewCtrl: ViewController,
		public http: Http,
		private file: File,
		private transfer: FileTransfer,
		public plt: Platform

	) {
		this.title = navParams.get('title');
		this.link = navParams.get('link');
		this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl('./assets/html/test.html');
	}

	/*
	private downloadAndSavePicture(pictureUrl) {
			this.http.get(pictureUrl, {responseType: 'blob'})
			.subscribe((imageBlob: Blob) => {
					// imageBlob is the binary data of the the image
					// From here you can manipulate it and store it where you want
					// For example, to store it in your app dir
					// The replace true is optional but is just in case you want to overwrite it
					return this.file.writeFile(this.file.dataDirectory, "my_downloaded_image", imageBlob, {replace: true});
			}).toPromise();
	}
	*/

	private loadclose() {
		setTimeout(() => {
			//this.postsLoading = '1';
		}, 1000);
	}

	private resize() {
		var iframe = $('#remotedata');
		$('#remotedata').height(iframe[0].contentWindow.document.body.scrollHeight + 400);
		//alert('ok');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad DetailsPage');
		//this.trustedPostUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.link+'?clean=true');


	}

	private dismiss() {
		this.viewCtrl.dismiss();
	}


	private share() {
		this.socialSharing.share(this.navParams.get('text'), this.navParams.get('title'), null, this.navParams.get('link'))
			.then(() => {
				//
			},
				() => {
					//
				})
	}

}
