import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddeditPage } from './addedit.page';

const routes: Routes = [
  {
    path: '',
    component: AddeditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddeditPageRoutingModule {}
