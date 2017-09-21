import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from './../../providers/auth-data';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  userProfile:  FirebaseListObservable<any>;
  public registerForm;
  public backgroundImage: any = "assets/alacran4.jpg";


  constructor(
    public nav: NavController, 
    public authData: AuthData, 
    public fb: FormBuilder, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    private afDB: AngularFireDatabase) {
    
    //EXPRESION REGULAR PARA CONTROLAR EL EMAIL
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      
    this.registerForm = fb.group({
          email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])], //EMAIL REQUERIDO Y QUE CUMPLA LA EXPRESION REGULAR
          name: ['', Validators.compose([Validators.minLength(2), Validators.required])],
          surname1: ['', Validators.compose([Validators.minLength(2), Validators.required])],
          surname2: ['', Validators.compose([Validators.minLength(2), Validators.required])],
          password: ['', Validators.compose([Validators.minLength(6), Validators.required])] //PASSWORD MINIMO 6 CARACTERES Y REQUERIDA

    });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerUser(){
    console.log("call signopUser");
    if (!this.registerForm.valid){
      console.log(this.registerForm.value);
      this.presentAlert("Formulario no válido");
    } else {

      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent', 
        content: 'Creating..'
      });
      loadingPopup.present();

      this.authData.registerUser(
          this.registerForm.value.name, 
          this.registerForm.value.surname1, 
          this.registerForm.value.surname2, 
          this.registerForm.value.email, 
          this.registerForm.value.password
      )
      .then(() => {
          console.log("usuario registrado correctamente!");
          loadingPopup.dismiss();
          this.nav.setRoot('Login2Page');
      }, (error:firebase.FirebaseError) => { 
        console.log(error);

        loadingPopup.dismiss().then( () => {
          console.log(error.code);
          switch (error.code) {  //DEPENDIENDO DEL ERROR LO MUESTRA EN FORMULARIO
            case "auth/email-already-in-use":
              error.message = "El correo electrónico ingresado ya se encuentra en uso"
              break;
            case "auth/network-request-failed":
              error.message = "Compruebe su conexión a internet o intentelo más tarde"
              break;
            case "auth/user-disabled":
              error.message = "Su usuario ha sido deshabilitado por el administrador"
              break;
            default:
              error.message = "Error desconocido. Comuniquese con el administrador de la aplicación"
              break;
          }
            this.presentAlert(error.message)
        });

      });

    }
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

}
