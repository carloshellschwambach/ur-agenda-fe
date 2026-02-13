import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss'],
    imports: [ReactiveFormsModule]
})
export class UserProfileComponent implements OnInit {
    profileForm: FormGroup;
    currentUser: User | null = null;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private userService: UserService,
        private toastr: ToastrService
    ) {
        this.profileForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            // Password update could be a separate section or logic, let's keep it simple for now
        });
    }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        if (this.currentUser) {
            this.profileForm.patchValue({
                name: this.currentUser.name,
                email: this.currentUser.email
            });
        }
    }

    onSubmit(): void {
        if (this.profileForm.invalid || !this.currentUser) return;

        this.isLoading = true;
        const updatedData = this.profileForm.value;

        this.userService.updateProfile(this.currentUser.id, updatedData).subscribe({
            next: (user) => {
                this.isLoading = false;
                // Update local user data
                const updatedUser = { ...this.currentUser, ...user };
                this.authService.setUser(updatedUser as User);
                this.currentUser = updatedUser;

                this.toastr.success('Perfil atualizado com sucesso!', 'Sucesso');
            },
            error: (err) => {
                this.isLoading = false;
                this.toastr.error('Erro ao atualizar perfil.', 'Erro');
                console.error(err);
            }
        });
    }

    getInitials(name: string): string {
        return name ? name.charAt(0).toUpperCase() : '';
    }
}
