import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendamentoRoutingModule } from './agendamento-routing.module';
import { AgendamentoListComponent } from './pages/agendamento-list/agendamento-list.component';
import { AgendamentoFormComponent } from './pages/agendamento-form/agendamento-form.component';


@NgModule({
  declarations: [
    AgendamentoListComponent,
    AgendamentoFormComponent
  ],
  imports: [
    CommonModule,
    AgendamentoRoutingModule
  ]
})
export class AgendamentoModule { }
