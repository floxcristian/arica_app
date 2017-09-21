import { Component } from '@angular/core';
import { AlertController, App, LoadingController, IonicPage,  NavController } from 'ionic-angular';
import { AuthData } from './../../providers/auth-data';
import { FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-login2',
  templateUrl: 'login2.html',
})
export class Login2Page {

  public loginForm: any;

  backgrounds = [
    "./assets/flamencos3.jpg",
    "./assets/lisera4.jpg",
    "./assets/tutelares.jpg",
    "./assets/alacran4.jpg",
    "./assets/corazones4.jpg",
    "./assets/surf4.jpg",
    "./assets/lisera5.jpg"
  ];

  constructor(
    public navCtrl: NavController, 
    public authData: AuthData, 
    public fb: FormBuilder, 
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
      let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      this.loginForm = fb.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  login(){
      if (!this.loginForm.valid){
          this.presentAlert('Correo Electrónico o Contraseña no válidos')
          console.log("error");
      } else {
        let loadingPopup = this.loadingCtrl.create({
          spinner: 'crescent', 
          content: ''
        });
        loadingPopup.present();

        this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          console.log("Auth pass");
          loadingPopup.dismiss();
          this.navCtrl.setRoot('HomePage');
        }, (error:firebase.FirebaseError) => {
          
          
          loadingPopup.dismiss().then( () => {
            console.log(error.code);
            switch (error.code) {  //DEPENDIENDO DEL ERROR LO MUESTRA EN FORMULARIO
              case "auth/user-not-found":
                error.message = "El correo electrónico ingresado no coincide con ninguna cuenta"
                break;
              case "auth/wrong-password":
                error.message = "Contraseña Incorrecta"
                break;
              default:
                
                
                break;
            }
              this.presentAlert(error.message)
          });
        });
      }
  }

  createAccount(){
    this.navCtrl.push('RegisterPage');
  }

  forgot(){
    this.navCtrl.push('ForgotPage');
  }

  presentAlert(title) {
    let alert = this.alertCtrl.create({
      title: title,
      buttons: ['OK']
    });
    alert.present();
  }

}
