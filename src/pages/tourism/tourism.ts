import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import {IonicPage,  ViewController, NavController, LoadingController, NavParams, ModalController, Content} from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { TourismCategoriesPage } from '../tourism-categories/tourism-categories';
import { TourismDetailsPage } from '../tourism-details/tourism-details';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage()
@Component({
  selector: 'page-tourism',
  templateUrl: 'tourism.html',
})
export class TourismPage {
  
  @ViewChild(Content) content: Content;
  showSearch = false;
  selected_category_id;
  selected_category_name: string = "Turismo";
  
  
  public all_tourism_places: Array<any> = [];
  public places_by_selected_category: Array<any> = [];
  public search_places: Array<any> = [];
  

  tourism_places: FirebaseListObservable<any[]>;

  constructor(
    private afDB: AngularFireDatabase,
    private storage: Storage,
    private keyboard: Keyboard,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    ) {

      let loader = this.loadingCtrl.create({
        content: "Obteniendo Datos...",
      });
      loader.present().then(() => {

        this.storage.get('select_category').then((val) => {
        if (val) {
          console.log("obtuve un valor: ", val);
          this.selected_category_id = val.id;
          this.selected_category_name = val.name;
        } else {
          console.log("no obtuve un valor: ", val);
          this.selected_category_id = 0;
          this.selected_category_name = 'Turismo';
          this.storage.set('select_category', this.selected_category_id);
        }

  

        this.tourism_places = afDB.list('/tourism_places');
        this.tourism_places.subscribe((data) => {
          loader.dismiss();
          this.all_tourism_places = data;

          if(this.selected_category_id == 0){
            console.log("entro al if");
            this.places_by_selected_category = this.all_tourism_places;
            this.search_places = this.all_tourism_places;
          }else{
            console.log("entro al else");
            this.places_by_selected_category = this.all_tourism_places.filter((item) => item.id_category == val.id);
            this.search_places = this.all_tourism_places.filter((item) => item.id_category == val.id);
          }

        });

      });


     
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TourismPage');
  }

  initializeItems() {
    this.search_places = this.places_by_selected_category;
  }

  showSearchBox() {
    this.showSearch = !this.showSearch;
    this.content.scrollToTop();
  }

  search(term) {
    this.initializeItems();
    let val = term.target.value;;
    if (val && val.trim() != '') {
      this.search_places = this.places_by_selected_category.filter((data) => {
        return (data.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  closeKeyboard(){
    this.keyboard.close();
  }

  openCategories(){
    let myModal = this.modalCtrl.create(TourismCategoriesPage);

    //CUANDO SALGA DEL MODAL
    myModal.onDidDismiss(data => {

      let loader = this.loadingCtrl.create({
        content: 'Filtrandos Datos',
      });

      if (data) {
        loader.present().then(() => {

          //OBTENGO CATEGORÍA SELECCIONADA DEL LOCALSTORAGE
          this.storage.get('select_category').then((val) => {

            this.selected_category_id  = val.id;
            this.selected_category_name = val.name;

            if(val.id == 0){
              this.places_by_selected_category = this.all_tourism_places;
              this.search_places = this.all_tourism_places;
              loader.dismiss();
            }
            else{
              this.places_by_selected_category = this.all_tourism_places.filter((item) => item.id_category == val.id);
              this.search_places = this.places_by_selected_category;
              loader.dismiss();
            }
            
          
          });

        });
      }
    });

    myModal.present();

  }

  detailsPage(place_id){
    this.navCtrl.push(TourismDetailsPage, {
      place_id: place_id
    });
  }

   

}
