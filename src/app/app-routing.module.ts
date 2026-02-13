import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/appointments',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'appointments',
        loadChildren: () => import('./modules/appointments/appointments.module').then(m => m.AppointmentsModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
