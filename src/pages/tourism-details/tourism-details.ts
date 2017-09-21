import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';

@IonicPage()
@Component({
  selector: 'page-tourism-details',
  templateUrl: 'tourism-details.html',
})
export class TourismDetailsPage {

  place_id: number;
  current_place;

  place_selected: FirebaseObjectObservable<any>;

  constructor(
    private afDB: AngularFireDatabase,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController, 
    public navParams: NavParams,
    private youtube: YoutubeVideoPlayer) {

    this.place_id = navParams.get("place_id");
    console.log(this.place_id);

    let loader = this.loadingCtrl.create({
        content: "Obteniendo Datos...",
    });

    loader.present().then(() => {
      this.place_selected = afDB.object('/tourism_places/'+ this.place_id);
        this.place_selected.subscribe((data) => {
          loader.dismiss();
          this.current_place = data;
          console.log(this.place_id);
          console.log(data);
        });
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TourismDetailsPage');
  }

  playVideo(video_id){
    this.youtube.openVideo(video_id);
  }

}
