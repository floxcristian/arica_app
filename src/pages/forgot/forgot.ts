import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from './../../providers/auth-data';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-forgot',
  templateUrl: 'forgot.html',
})
export class ForgotPage {
  
  public resetPasswordForm;
  public backgroundImage: any = "assets/alacran4.jpg";

  constructor(
    public authData: AuthData, 
    public fb: FormBuilder, 
    public nav: NavController, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {

    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.resetPasswordForm = fb.group({
          email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPage');
  }

    resetPassword(){
    if (!this.resetPasswordForm.valid){
        console.log("form is invalid = "+ this.resetPasswordForm.value);
    } else {

      let loadingPopup = this.loadingCtrl.create({
        spinner: 'crescent', 
        content: ''
      });
      loadingPopup.present();
      this.authData.resetPassword(this.resetPasswordForm.value.email)
      .then((user) => {
          loadingPopup.dismiss();
          this.presentAlert("We just sent you a reset link to your email");
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
