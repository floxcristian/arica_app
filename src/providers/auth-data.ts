import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Events } from 'ionic-angular';

@Injectable()
export class AuthData {
  
  fireAuth: any;


  constructor(
    public events:  Events,
    public storage: Storage,
    private afAuth: AngularFireAuth) {
  }

  //FUNCION DE LOGIN CON FIREBASE************************************************ARREGLAR*****************************
  loginUser(email: string, password: string): firebase.Promise<any> {

     return this.afAuth.auth.signInWithEmailAndPassword(email, password)
       .then((user) => {
          //FUNCION PARA OBTENER LOS DATOS DE USUARIO!!
          this.storage.set('uid', user.uid)
          .then( _ => {
            this.events.publish("login:success", user); //PASO LOS DATOS OBTENIDOS DEL USUARIO!!
          }) 
            
       })
       .catch((error:firebase.FirebaseError)=> {
          throw error
       });
  }

  //FUNCION DE RESTABLECER CONTRASEÑA CON FIREBASE************************************************************
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  //FUNCION DE LOGOUT CON FIREBASE****************************************************************************
  logoutUser(): firebase.Promise<any> {
    return this.afAuth.auth.signOut()
      .then( data => {
        this.storage.remove('uid')
        this.events.publish("logout:success")
      });
  }
  
  //FUNCION DE REGISTRO CON FIREBASE**************************************************************************
  registerUser(name: string, surname1: string, surname2: string, email: string, password: string): firebase.Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      firebase.database().ref('/user_profile').child(newUser.uid).set({
          email: email,
          name: name,
          surname1: surname1,
          surname2: surname2
      })
    });
  }

  //FUNCION PARA OBTENER LOS DATOS DEL USUARIO****************************************ARREGLAR**********************************
  getUserData(current_user_uid): void {
    console.log("se ejecuto getuserdata!!");
    let path = `userProfile/${current_user_uid}`; 

  }

  //FUNCION VER SI HAY SESION INICIADA**************************************************************************
  getAuth(): Promise<any> {
    return this.storage.ready()
    .then( _ => this.storage.get('uid')
    .then( user => user ));
  }

}

