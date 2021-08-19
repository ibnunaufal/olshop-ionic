import { Component, OnInit } from '@angular/core';
import { CrudService } from './../services/crud.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';
import { AddeditPage  } from '../addedit/addedit.page';
import { Router } from '@angular/router';

export class product {
  $key: string;
  name: string;
  description: string;
  price: number;
  image: string;
  kategori: string;
}
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  products: product[];
  loading = true;

  constructor(
    private crud: CrudService,
    private domSanitizer: DomSanitizer,
    private storage: Storage,
    private router: Router,
    private modalctrl: ModalController
  )
  {

    this.getAwal();
    // this.storage.set("asd", "tes");
    this.storage.get("asd").then((res) => {
      console.log(res);
    })
  }

  getImgContent(img): SafeUrl {

    // img = this.apiUrl + 'main_a/image/get/' + img + '/pas';
    return this.domSanitizer.bypassSecurityTrustUrl(img);

  }

  ngOnInit() {
  }

  getAwal(){
    this.crud.getProducts().subscribe((res) => { //getTasks().subscribe((res) => {
      this.products = res.map((t) => {
        // this.loaded = true;
        return {
          id: t.payload.doc.id,
          ...t.payload.doc.data() as product
        };
      })
      this.loading = false;
      console.log(this.products)
    });
  }

  async addEdit(type, id){
    const modal = await this.modalctrl.create({
      component: AddeditPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'id' : id
      }
    });
    return await modal.present();
  }

  del(id){
    console.log(id)
    if (window.confirm('Anda yakin akan menghapus ini?')) {
      this.crud.delete(id)
    }
  }

  logout(){
    if (window.confirm('Anda yakin akan keluar?')) {
      this.crud.logout();
      this.router.navigate(['/tabs/tab3'])
    }
  }
}
