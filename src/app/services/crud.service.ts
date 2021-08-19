import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireStorage } from "@angular/fire/storage";
import { Storage } from '@ionic/storage';

export class product {
  $key: string;
  name: string;
  description: string;
  price: number;
  image: string;
  kategori: string;
}

@Injectable({
  providedIn: 'root'
})


export class CrudService {
  

  constructor(
    private ngFirestore: AngularFirestore,
    private firebaseAuth: AngularFireAuth,
    private ngStorage: AngularFireStorage,
    private storage: Storage,
    private router: Router
    ) { }

    create(product: product) {
      return this.ngFirestore.collection('products').add(product);
    }
  
    getProducts() {
      return this.ngFirestore.collection('products').snapshotChanges();
    }
    
    getProduct(id) {
      return this.ngFirestore.collection('products').doc(id).valueChanges();
    }
  
    update(id, product: product) {
      this.ngFirestore.collection('products').doc(id).update(product)
        .then(() => {
          this.router.navigate(['/todo-list']);
        }).catch(error => console.log(error));;
    }
  
    delete(id: string) {
      this.ngFirestore.doc('products/' + id).delete();
    }

    login(email, password){
      return this.firebaseAuth.signInWithEmailAndPassword(email, password)
    }

    logout(){
      return this.firebaseAuth.signOut()
    }

    

    check(){
      return this.firebaseAuth.authState.subscribe((user) => {
         if(!user){
           this.loginAnon().then((res) => {
             this.storage.set("state", res)
           })
         }
      })
    }

    loginAnon(){
      return this.firebaseAuth.signInAnonymously()
    }
}
