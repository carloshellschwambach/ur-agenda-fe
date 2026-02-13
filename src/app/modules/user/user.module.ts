import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        UserRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        UserProfileComponent
    ]
})
export class UserModule { }
