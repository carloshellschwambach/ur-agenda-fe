import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class UserFormComponent implements OnInit, OnChanges {
    @Input() visible = false;
    @Input() user: User | null = null;
    @Input() isDeleteMode = false;
    @Output() close = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    userForm: FormGroup;
    isEditMode = false;
    loading = false;
    availableRoles = [
        { name: 'Admin', value: 'ADMIN' },
        { name: 'Dono', value: 'OWNER' },
        { name: 'Gerente', value: 'MANAGER' },
        { name: 'Funcionário', value: 'EMPLOYEE' },
        { name: 'Usuário', value: 'USER' }
    ];

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private toastr: ToastrService,
        private authService: AuthService
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: [''],
            roles: this.fb.array([], Validators.required)
        });
    }

    ngOnInit(): void {
    }

    // Role Permission Helpers
    isRoleVisible(roleValue: string): boolean {
        if (roleValue === 'ADMIN') {
            return this.authService.hasRole('ADMIN');
        }
        return true;
    }

    canToggleRole(roleValue: string): boolean {
        if (this.isDeleteMode) return false;

        if (roleValue === 'OWNER') {
            return this.authService.hasRole('OWNER') || this.authService.hasRole('ADMIN');
        }
        if (roleValue === 'ADMIN') {
            return this.authService.hasRole('ADMIN');
        }

        return true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible'] && this.visible) {
            // Reset form state on open
            if (this.isDeleteMode) {
                this.userForm.disable();
            } else {
                this.userForm.enable();
            }

            if (this.user) {
                this.isEditMode = true;
                this.patchForm(this.user);
                this.userForm.get('password')?.clearValidators();
                if (this.isDeleteMode) {
                    this.userForm.get('password')?.disable();
                }
            } else {
                this.isEditMode = false;
                this.resetForm();
                this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
                if (!this.isDeleteMode) {
                    this.userForm.get('password')?.enable();
                }
            }
            this.userForm.get('password')?.updateValueAndValidity();
        }
    }

    get rolesFormArray() {
        return this.userForm.get('roles') as FormArray;
    }

    onRoleChange(e: any): void {
        const roleValue = e.target.value;
        if (!this.canToggleRole(roleValue)) return;

        const roles: FormArray = this.rolesFormArray;
        if (e.target.checked) {
            roles.push(this.fb.control(e.target.value));
        } else {
            let i = 0;
            roles.controls.forEach((item: any) => {
                if (item.value == e.target.value) {
                    roles.removeAt(i);
                    return;
                }
                i++;
            });
        }
    }

    isRoleSelected(value: string): boolean {
        return this.rolesFormArray.value.includes(value);
    }

    patchForm(user: User): void {
        this.userForm.patchValue({
            name: user.name,
            username: user.username,
            email: user.email
        });

        this.rolesFormArray.clear();
        if (user.roles) {
            user.roles.forEach(role => {
                this.rolesFormArray.push(this.fb.control(role));
            });
        }
    }

    resetForm(): void {
        this.userForm.reset();
        this.rolesFormArray.clear();
    }

    onSubmit(): void {
        if (this.isDeleteMode) {
            this.onDelete();
            return;
        }

        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const userData = this.userForm.value;

        if (this.isEditMode) {
            delete userData.password;
        }

        const request = this.isEditMode && this.user
            ? this.userService.update(this.user.id, userData)
            : this.userService.create(userData);

        request.subscribe({
            next: () => {
                this.toastr.success(`Usuário ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso`, 'Sucesso');
                this.saved.emit();
                this.close.emit();
                this.loading = false;
            },
            error: (err) => {
                this.toastr.error(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} usuário`, 'Erro');
                this.loading = false;
            }
        });
    }

    onDelete(): void {
        if (!this.user) return;

        this.loading = true;
        this.userService.delete(this.user.id).subscribe({
            next: () => {
                this.toastr.success('Usuário excluído com sucesso', 'Sucesso');
                this.saved.emit();
                this.close.emit();
                this.loading = false;
            },
            error: (err) => {
                this.toastr.error('Erro ao excluir usuário', 'Erro');
                this.loading = false;
            }
        });
    }

    onCancel(): void {
        this.close.emit();
    }
}
