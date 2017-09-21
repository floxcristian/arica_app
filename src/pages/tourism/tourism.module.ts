import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourismPage } from './tourism';

@NgModule({
  declarations: [
    TourismPage,
  ],
  imports: [
    IonicPageModule.forChild(TourismPage),
  ],
})
export class TourismPageModule {}
