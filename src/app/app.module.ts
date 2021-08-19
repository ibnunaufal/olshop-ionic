import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { IonicStorageModule } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

//  Firebase modules
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

// Environment
import { environment } from '../environments/environment';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { FormBuilder } from '@angular/forms';
import { Camera } from '@ionic-native/camera/ngx';
import { LOCALE_ID } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    // IonicStorageModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FirebaseAuthentication,
    FormBuilder,
    Camera,
    CurrencyPipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
