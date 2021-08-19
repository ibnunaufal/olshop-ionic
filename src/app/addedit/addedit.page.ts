import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from "@angular/fire/storage"
import { AlertController } from '@ionic/angular';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
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
  selector: 'app-addedit',
  templateUrl: './addedit.page.html',
  styleUrls: ['./addedit.page.scss'],
})
export class AddeditPage implements OnInit {

  isEdit = true;
  id;
  products = product;
  addEdit: FormGroup;

  img;

  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  constructor(
    private navParams: NavParams,
    public formBuilder: FormBuilder, 
    private modalctrl: ModalController,
    private domSanitizer: DomSanitizer,
    private act: ActionSheetController,
    private crud: CrudService,
    private camera: Camera,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage,
    private loading: LoadingService
  ) { 
    this.id = this.navParams.get("id")
    console.log(this.id)
    if(this.id == "add"){
      this.isEdit = false;
      this.img = "";
    }else{
      this.isEdit = true;
      this.crud.getProduct(this.id).subscribe((res) => { //getTasks().subscribe((res) => {
        this.addEdit = this.formBuilder.group({
          title: [res['title']],
          name: [res['name']],
          description: [res['description']],
          price: [res['price']],
          image: [res['image']],
          kategori: [res['kategori']]
        })
        this.img = [res['image']];
        console.log(res);
        console.log(this.products)
      });
    }
  }

  getImgContent(img): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(img);
  }

  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.img = this.base64Image;
      this.upload();
    }, (err) => {
      // Handle error
      console.error(err);
    });
  }

  upload(): void {
    this.loading.create("Sedang Mengupload")
    var currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${currentDate}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`Images/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            // this.showSuccesfulUploadAlert();
            this.loading.dismiss();
          } else {
            this.loading.dismiss()
          }
          this.img = downloadURL;
          console.log(downloadURL);
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Uploaded',
      subHeader: 'Image uploaded successful to Firebase storage',
      message: 'Check Firebase storage.',
      buttons: ['OK']
    });

    await alert.present();
  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  ngOnInit() {
    this.addEdit = this.formBuilder.group({
      name: [''],
      description: [''],
      price: [''],
      image: [''],
      kategori: ['']
    })
  }

  dismiss(){
    this.modalctrl.dismiss();
  }

  onSubmit(){
    if(!this.addEdit.valid){
      return false;
    }else{
      this.loading.create("Menyimpan");
      console.log(this.addEdit.value);
      if(this.id == 'add'){
        this.addEdit.controls['image'].setValue(this.img);
        console.log(this.addEdit.value)
        this.crud.create(this.addEdit.value).then((res) => {
          console.log(res);
          this.loading.dismiss();
          this.dismiss();
        }).catch((err) => {
          console.log(err)
          this.loading.dismiss()
          this.dismiss();
        })
      }else{
        this.crud.update(this.id, this.addEdit.value)
        this.loading.dismiss()
        this.dismiss()
      }
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.act.create({
      header: 'Masukkan Gambar',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Buka Kamera',
        icon: 'camera',
        handler: () => {
          this.takePhoto(1)
          console.log('camera clicked');
        }
      }, {
        text: 'Buka Galeri',
        icon: 'image',
        handler: () => {
          this.takePhoto(0)
          console.log('gallery clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
