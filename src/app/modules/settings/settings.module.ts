import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsHomeComponent } from './pages/settings-home/settings-home.component';

@NgModule({
    imports: [
        CommonModule,
        SettingsRoutingModule,
        SettingsHomeComponent
    ]
})
export class SettingsModule { }
