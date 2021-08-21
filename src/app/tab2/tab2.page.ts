import { Component, OnInit } from '@angular/core';
import { CrudService } from './../services/crud.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { CurrencyPipe, formatCurrency } from '@angular/common';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  cart = [];
  total;
  jumlah;

  
  constructor(
    private crud: CrudService,
    private domSanitizer: DomSanitizer,
    private storage: Storage,
    private alertController: AlertController,
    private currencyPipe: CurrencyPipe
  ) {
    this.getAwal();
  }

  getImgContent(img): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(img);
  }

  getAwal(){
    this.storage.get("cart").then((res) => {
      this.cart = res;
      console.log(this.cart)
    })
  }

  addToCart(arr){
    let tempArr = {
      id: arr.id,
      name: arr.name,
      image: arr.image,
      price: arr.price,
      qty: 1
    }
    this.storage.get("cart").then((res) => {
      let temp = [];
      if(res){
        temp = res;
        temp[res.length] = tempArr;
      }else{
        temp[0] = tempArr;
      }
      this.storage.set("cart", temp)
      this.cart = temp;
    })
  }

  clearCart(){
    this.storage.remove("cart")
    this.cart = [];
  }

  add(id){
    let temp;
    this.storage.get("cart").then((res) => {
      this.cart = res;
      for(let x = 0; x < this.cart.length; x++){
        if(this.cart[x].id == id){
          temp = x;
        }
      }
      this.cart[temp].qty += 1;
      this.storage.set("cart", this.cart);
    })
    
  }

  remove(id){
    let temp;
    this.storage.get("cart").then((res) => {
      this.cart = res;
      for(let x = 0; x < this.cart.length; x++){
        if(this.cart[x].id == id){
          temp = x;
        }
      }
      if(this.cart[temp].qty == 1){
        this.cart.splice(temp, 1);
      }else{
        this.cart[temp].qty -= 1;
      }
      this.storage.set("cart", this.cart);
    })
    
    
  }
  count(id){
    let temp;
    for(let x = 0; x < this.cart.length; x++){
      if(this.cart[x].id == id){
        temp = x;
      }
    }
    return this.cart[temp].qty
  }
  ionViewWillEnter(){
    console.log("hai tab 2");
    this.getAwal();
  }

  getTotal(type){
    let total = 0;
    let jumlah = 0;
    let z = 0;
    for(let x = 0; x < this.cart.length; x++){
      jumlah += this.cart[x].qty;
      z = this.cart[x].qty * this.cart[x].price;
      total += z;
    }
    if(type == 'harga'){
      return total
    }else{
      return jumlah
    }
  }

  getCurrency(price){
    // locale: String;
    // digitInfo: String
    // currency:'Rp ': 'symbol' : '1.0-0'
    // console.log(this.currencyPipe.transform(price, 'Rp. ', 'symbol', '1.0-0'));
    return this.currencyPipe.transform(price, 'Rp.', 'symbol', '1.0-0')
    // formatCurrency(price,'ID',"Rp. ","IDR","1.0-0")
  }

  checkout(note){
    let notes = String(note)
    let str;
    let brg = '';
    this.storage.get("profile").then((alamat) => {
      str = "https://wa.me/6281225951789?text=Halo,%20saya%20mau%20pesan:%0A";
      console.log(alamat);
      this.storage.get("cart").then((res) => {
        for(let x = 0; x < res.length; x++){
          brg += "-%20"+res[x].qty+"%20"+res[x].name+"(@"+this.getCurrency(res[x].price)+")%0A"
        }
        str += brg
        console.log(str)
        str += "%0ATotal%20"+this.getCurrency(this.getTotal('harga'))+"%20("+this.getTotal('item')+"pcs)"
        str += "%0A%0Adengan%20tujuan:"
        console.log(str)
        str += "%0ANama:%20"+ alamat.name
        str += "%0AAlamat:%20"+ alamat.address
        str += "%0A%0ANote:%20" + notes.replace(' ','%20')
        console.log(str)
        // this.presentAlertPrompt();
        // this.getCurrency(20000);
        var  element = document.createElement('a') as HTMLElement;
          element.setAttribute('href', str);
          element.setAttribute('style', 'display:none;');
          element.click();
      })
    })
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Catatan!',
      mode: "ios",
      inputs: [
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Masukkan Catatan'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok' + data.paragraph);
            this.checkout(data.paragraph);
          }
        }
      ]
    });

    await alert.present();
  }
}
