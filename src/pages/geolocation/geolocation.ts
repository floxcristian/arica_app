import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 GoogleMapOptions,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-geolocation',
  templateUrl: 'geolocation.html',
})
export class GeolocationPage {

  public isTracking = 0; //ESTADO DE SEGUIMIENTO
  private watch: any;
  mylat:any ;
  mylong:any;
 

  active_transport_units: Array<any> = [];
  active_units: FirebaseListObservable<any[]>;

  map: GoogleMap;
  mapElement: HTMLElement;
  private selfmarker: Marker;
  public subscription: any;

  constructor(
    private events: Events,
    public platform: Platform, 
    public loadingCtrl: LoadingController,
    private afDB: AngularFireDatabase,
    private geolocation: Geolocation,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private googleMaps: GoogleMaps) {

      let loader = this.loadingCtrl.create({
        content: "Obteniendo Datos...",
      });

      loader.present().then(() => {

        this.events.subscribe('menu:opened', () => {
          this.map.setClickable(false);
        });

        this.events.subscribe('menu:closed', () => {
            this.map.setClickable(true);
        });

        this.platform.ready().then(() => {
          this.loadMap();
        });

        this.active_units = afDB.list('/transport_active_units');
        this.active_units.subscribe((data) => {
            loader.dismiss();
            this.active_transport_units = data;

             for (var marker of this.active_transport_units) {
                  //console.log("hola", marker); 
                  this.addMarkerOnMap(marker);
              }


            //console.log(data);
        });
         
      });
  }

 

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad GeolocationPage');
  }

    ionViewWillLeave() {
      if(this.isTracking == 1){
        this.subscription.unsubscribe();
      }
    }

  loadMap() {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: -18.4803045,
          lng: -70.2969735
        },
        zoom: 14,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    //ESPERA QUE EL MAPA ESTE LISTO ANTES DE USAR ALGUN METODO
    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        console.log('Map is ready!');

      });
  }

  geolocateMe(){

    this.isTracking = 1;

    let loader = this.loadingCtrl.create({
      content: "Obteniendo Ubicación..",
    });
    
    loader.present().then(() => {
      this.geolocation.getCurrentPosition().then((resp) => {

        let userPosition: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);

        let position: CameraPosition<any> = {
          target: userPosition,
          zoom: 15,
          tilt: 0
        };
        loader.dismiss();
        this.map.moveCamera(position);
        
      }).catch((error) => {
        console.log('Error al obtener la ubicación', error);
      });

    });

    let options = { timeout: 3000, enableHighAccuracy: true, frequency: 3000};

    this.subscription = this.geolocation.watchPosition(options)
    .subscribe((data) => {
        let userPosition: LatLng = new LatLng(data.coords.latitude, data.coords.longitude);  
        this.mylat = data.coords.latitude;
        this.mylong = data.coords.longitude;
        console.log(data);

        if (this.selfmarker != null && data.coords.latitude != 0 && data.coords.longitude != 0) {
            this.selfmarker.setPosition(userPosition);
        } else {
            let markerIcon = {
                'url': 'https://lh3.googleusercontent.com/zPPRTrpL-rx7OMIqlYN63z40n2UBJDa3I3n5C3Z9YtKGsTXPfdtks18Y0gdvfcz6tEsV=w170',
                'size': {
                    width: 20,
                    height: 20,
                }
            }
            let markerOptions: MarkerOptions = {
                position: userPosition,
                animation: 'DROP',
                icon: 'blue'
            };
            this.map.addMarker(markerOptions)
            .then((marker) => { 
              this.selfmarker = marker; 
            });
        } 


    });
        
  }

  stopTracking(){
    this.isTracking = 0;
    this.subscription.unsubscribe(); //DEJO DE HACER GEOLOCALIZACION
  }

  addMarkerOnMap(objetive){
    let markerPosition: LatLng = new LatLng(objetive.last_latitude, objetive.last_longitude);
    /*
    if (this.selfmarker != null && objetive.last_latitude != 0 && objetive.last_longitude != 0) {
        this.selfmarker.setPosition(markerPosition);
    } else {
        let markerIcon = {
            'url': 'https://lh3.googleusercontent.com/zPPRTrpL-rx7OMIqlYN63z40n2UBJDa3I3n5C3Z9YtKGsTXPfdtks18Y0gdvfcz6tEsV=w170',
            'size': {
                width: 20,
                height: 20,
            }
        }
        let markerOptions: MarkerOptions = {
            position: userPosition,
            animation: 'DROP',
            icon: 'blue'
        };
        this.map.addMarker(markerOptions)
        .then((marker) => { 
          this.selfmarker = marker; 
        });
    }*/ 
}

}
