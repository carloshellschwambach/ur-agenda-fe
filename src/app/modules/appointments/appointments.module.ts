import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentsListComponent } from './pages/appointments-list/appointments-list.component';
import { AppointmentsFormComponent } from './pages/appointments-form/appointments-form.component';
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component';


import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    AppointmentsListComponent,
    AppointmentsFormComponent
  ],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    FullCalendarModule,
    AppointmentFormComponent // Import standalone component here
  ]
})
export class AppointmentsModule { }
