import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsListComponent } from './pages/appointments-list/appointments-list.component';
import { AppointmentsFormComponent } from './pages/appointments-form/appointments-form.component';

const routes: Routes = [
  { path: '', component: AppointmentsListComponent },
  { path: 'novo', component: AppointmentsFormComponent },
  { path: ':id/editar', component: AppointmentsFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
