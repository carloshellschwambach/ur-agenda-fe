import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsListComponent } from './pages/appointments-list/appointments-list.component';
import { AppointmentsFormComponent } from './pages/appointments-form/appointments-form.component';


@NgModule({
  declarations: [
    AppointmentsListComponent,
    AppointmentsFormComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule
  ]
})
export class AppointmentsModule { }
