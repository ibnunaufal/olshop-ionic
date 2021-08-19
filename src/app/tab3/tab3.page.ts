import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  profile = [];
  constructor(
    private storage: Storage,
    private router: Router
  ) {
    this.getAwal();
  }

  getAwal(){
    this.storage.get("profile").then((res) => {
      console.log(res)
      if(res){
        this.profile = res;
      }else{
        this.profile = [];
      }
    })
  }

  save(){
    this.storage.set("profile", this.profile)
  }

  login(){
    this.router.navigate(["/login"])
  }

}
