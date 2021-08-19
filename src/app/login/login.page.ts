import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  name;
  password;
  constructor(
    private crud: CrudService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(){
    if(this.name && this.password){
      this.crud.login(this.name, this.password).then((res) => {
        console.log(res);
        this.router.navigate(["/admin"])
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  logout(){
    this.crud.logout().then(() => {
      console.log("logout")
    }).catch((err) => {
      console.log(err)
    })
  }
}
