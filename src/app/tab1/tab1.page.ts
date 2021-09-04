import { Component, OnInit } from '@angular/core';
import { CrudService } from './../services/crud.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { ProductDetailPage } from '../product-detail/product-detail.page';
import { LoadingService } from '../loading.service';

export class product {
  $key: string;
  name: string;
  description: string;
  price: number;
  image: string;
  kategori: string;
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  products: product[];
  cart = [];
  loaded = false;

  constructor(
    private crud: CrudService,
    private domSanitizer: DomSanitizer,
    private modalController: ModalController,
    private loading: LoadingService,
    private storage: Storage
  ) {

    this.getAwal();
    // this.storage.set("asd", "tes");
    this.storage.get("asd").then((res) => {
      console.log(res);
    })
    this.storage.get("cart").then((res) => {
      this.cart = res;
    })
  }

  getImgContent(img): SafeUrl {

    // img = this.apiUrl + 'main_a/image/get/' + img + '/pas';
    return this.domSanitizer.bypassSecurityTrustUrl(img);

  }

  getAwal(){
    this.crud.getProducts().subscribe((res) => { //getTasks().subscribe((res) => {
      this.products = res.map((t) => {
        this.loaded = true;
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as product
        };
      })
      console.log(this.products)
      this.storage.get("cart").then((res) => {
        this.cart = res
      })
    
    });
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

  getDetail(id){
    this.crud.getProduct(id).subscribe(async(res:any) => { //getTasks().subscribe((res) => {
      // this.addEdit = this.formBuilder.group({
      //   title: [res['title']],
      //   name: [res['name']],
      //   description: [res['description']],
      //   price: [res['price']],
      //   image: [res['image']],
      //   kategori: [res['kategori']]
      // })
      // this.img = [res['image']];
      // console.log(res);
      // return res
      this.openDetail(res)
    });
  }

  async openDetail(id) {
    // let x = await this.getDetail(id);
    // console.log(x)
    const modal = await this.modalController.create({
    component: ProductDetailPage,
    componentProps: { data: id }
    });
  
    await modal.present();
  
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
    console.log("hai tab1");
    this.getAwal();
  }
}
