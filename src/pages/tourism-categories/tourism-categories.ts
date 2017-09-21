import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {IonicPage, NavController, ViewController, LoadingController, NavParams, ModalController} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-tourism-categories',
  templateUrl: 'tourism-categories.html',
})
export class TourismCategoriesPage {

  default_category = {id: 0, name: 'Turismo'};
  current_category: any;

  all_tourism_categories: Array<any> = [];
  tourism_categories: FirebaseListObservable<any[]>;

  constructor(
    private afDB: AngularFireDatabase,
    private storage: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController) {

      this.tourism_categories = this.afDB.list('/tourism_categories');
        
      this.tourism_categories.subscribe((data) => {
        this.all_tourism_categories = data;
        //console.log("todas las categorias: ", data);
        //console.log("categoria actual:", this.current_category);
      });
  }

   ionViewDidEnter() {
    this.storage.get('select_category').then((val) => {
      if (val){
        this.current_category = val.id;
        //console.log("hola");
        //console.log(val);
        //console.log("cateogria actual:if ", this.current_category);
      }
      else{
        this.current_category = 0;
        //console.log("cateogria actual: else", this.current_category);
      }
        
    });
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TourismCategoriesPage');
  }

  categorySelected(category) {
    this.storage.set('select_category', category);
    this.viewCtrl.dismiss(category);
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
