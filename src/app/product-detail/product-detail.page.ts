import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {

  id;
  data;
  cart;
  constructor(
    private navparams: NavParams,
    private domSanitizer: DomSanitizer,
    private storage: Storage,
    private crud: CrudService
  ) {
    this.id = this.navparams.get("data")
    this.crud.getProduct(this.id).subscribe(async(res:any) => { //getTasks().subscribe((res) => {
      this.data = res;
      console.log(this.data);
    });

    this.storage.get("cart").then((res) => {
      console.log(res);
      this.cart = res;
    })
  }

  ngOnInit() {
  }

  getImgContent(img): SafeUrl {

    // img = this.apiUrl + 'main_a/image/get/' + img + '/pas';
    return this.domSanitizer.bypassSecurityTrustUrl(img);

  }

  check(id){
    let temp = false;
    if(this.cart){
      for(let x = 0; x < this.cart.length; x++){
        if(this.cart[x].id == id){
          temp = true;
        }
      }
    }
    return temp
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



}
