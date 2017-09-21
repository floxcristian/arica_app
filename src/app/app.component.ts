
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, LoadingController, MenuController, } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal';
import { AuthData } from './../providers/auth-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'Login2Page';
  activePage: any;
  pages: Array<{title: string, component: any}>;
  user: any;
  profile_image = "./assets/male_profile.jpg";

  constructor(
    private events: Events,
    public menuCtrl: MenuController,
    private storage: Storage,
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private oneSignal:   OneSignal,
    public loadingCtrl:  LoadingController,
    public _auth_data: AuthData
    ) {
      
    this.user = null; //DATOS DE USUARIO ACTUAL

    //PÁGINAS PARA LA NAVEGACIÓN
    this.pages = [
      { title: 'Inicio', component: 'HomePage' },
      { title: 'Turismo', component: 'TourismPage' }, 
      { title: 'Georeferencia', component: 'GeolocationPage' }
    ];

    this.activePage = this.pages[0];

  }

   ngOnInit() {
    this.initializeApp();  //INICIALIZA PLUGINS Y LLAMADAS NATIVAS

    let loader = this.loadingCtrl.create();
    loader.present();

    //PREGUNTAR SI ESTA LOGUEADO
    this._auth_data.getAuth()
    .then( auth => {
      loader.dismiss();
      this.user = auth;
      console.log(auth);
      
      if ( auth ){ //SI ESTA LOGEADO
        this.menuCtrl.enable(true); //ACTIVAR MENU
        this.nav.setRoot('HomePage', {}, { animate: true, direction: 'forward' }); //IR A PAGINA 'HomePage'
      } else {
        this.menuCtrl.enable(false); //DESACTIVAR MENU
        this.nav.setRoot('Login2Page', {}, { animate: true, direction: 'forward' }); //IR A PAGINA 'Login2Page'
      }
    })

    //MANEJADORES DE EVENTOS LOGIN & LOGOUT
    this.events.subscribe("login:success",  user => this.onLogin(user));
    this.events.subscribe("logout:success",  _ => this.onLogout());

  }

  //INICIALIZACION DE PLUGINS NATIVOS****************************************************************
  initializeApp() {
    this.platform.ready().then((res) => {

      if (res == 'cordova') {
        
        //SI ESTOY EN ANDROID*************************************************************************
        if (this.platform.is('android')) {
          this.statusBar.backgroundColorByHexString("#33000000");
        }
      
        //CONFIGURACION SPLASHSCREEEN*****************************************************************
        this.splashScreen.hide();

        //CONFIGURACION ONESIGNAL*********************************************************************
        this.oneSignal.startInit("6e21174c-0704-462c-9e0c-305f07df58b5", "802635265304")
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
        });

        this.oneSignal.handleNotificationOpened().subscribe(() => {
        });
        this.oneSignal.endInit();

        this.oneSignal.getIds()
        .then((ids)=> {
          this.storage.ready()
          .then( _ => {
            this.storage.set('onesignal_id', ids.userId);
          });
        })
   
      }

      this.storage.remove('select_category');

    });
  }


  logout(){
    this._auth_data.logoutUser();
  }

  openPage(page) {
    this.nav.setRoot(page.component);
    this.activePage = page;
  }

  checkActive(page){
    return page == this.activePage;
  }

  //PARA SOLUCIONAR PROBLEMA DE MENU SOBRE GOOGLE MAP NATIVO****************************************************
  menuClosed() { this.events.publish('menu:closed', '') }
  menuOpened() { this.events.publish('menu:opened', '') }

  //CUANDO SE EMITE EL EVENTO LOGIN******************************************************************************
  onLogin(user){
    console.log("onLogin:", user);
    this.user = user;
    this._auth_data.getUserData(user);
    this.menuCtrl.enable(true);
  }

  //CUANDO SE EMITE EL EVENTO LOGOUT*****************************************************************************
  onLogout(){
    this.user = null;
    this.menuCtrl.enable(false);
    this.nav.setRoot('Login2Page', {}, { animate: true, direction: 'forward' });
  }
}
