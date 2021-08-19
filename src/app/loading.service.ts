import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    private loading: LoadingController
  ) { }

  async create(text){
    let lo = await this.loading.create({
      message: text
    });
  
    lo.present();
  }

  dismiss(){
    this.loading.dismiss();
  }
}
