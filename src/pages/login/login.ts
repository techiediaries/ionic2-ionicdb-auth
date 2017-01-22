import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AlertController, LoadingController } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError, Database } from '@ionic/cloud-angular';

import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  enableLogin:boolean = true;
  email:string = '';
  password:string = '';
  name:string = '';

  constructor(public navCtrl: NavController, public loadingController:LoadingController,public alertController: AlertController,public auth:Auth,public database : Database) {

  }

  public showRegister(){
    this.enableLogin = false ;
  }
  public showLogin(){
    this.enableLogin = true ;
  }
  public login(){
    if(this.email === '' || this.password === '')
    {
        let alert = this.alertController.create({
          title:'Auth Error', 
          subTitle:'Required fields',
          buttons:['OK']
        });
        alert.present();
        return;
    }
    let loading = this.loadingController.create({content : "Logging in ,please wait..."});
    loading.present();
     this.auth.login('basic', {'email':this.email, 'password':this.password}).then(()=>{
        loading.dismissAll();
        this.database.connect();
        this.navCtrl.setRoot(TabsPage); 
     },
     (error)=>{
        loading.dismissAll();
        console.log(error.message);
        let alert = this.alertController.create({
          title:'Auth Error', 
          subTitle:"Login error",
          buttons:['OK']
        });
        alert.present();
     });
  }
  public register(){
    if(this.email === '' || this.password === '')
    {
        let alert = this.alertController.create({
          title:'Auth Error', 
          subTitle:'Required fields',
          buttons:['OK']
        });
        alert.present();
        return;      
    }
    let loading = this.loadingController.create({content : "Signing up ,please wait..."});
    loading.present();
    let details: UserDetails = {'email':this.email, 'password':this.password, 'name':this.name};
    this.auth.signup(details).then(()=>{
        this.auth.login('basic', {'email':this.email, 'password':this.password}).then(() => {
            loading.dismissAll();
            this.database.connect();
            this.navCtrl.setRoot(TabsPage);
        });      
    },
    (error)=>{
        let alert = this.alertController.create({
          title:'Register Error', 
          subTitle:"Register error",
          buttons:['OK']
        });
        alert.present();        
    });

  }
  public isLoggedIn(){
    let status = this.auth.isAuthenticated();
    return status;
  }
  public logout(){
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
