import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, UserFormComponent]
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    page = 0;
    size = 10;
    totalPages = 0;
    currentUser: User | null = null;

    // Modal State
    showModal = false;
    selectedUser: User | null = null;
    isDeleteMode = false;

    columns = [
        { field: 'actions', header: 'Ações', visible: true },
        { field: 'name', header: 'Nome', visible: true },
        { field: 'username', header: 'Usuário', visible: true },
        { field: 'email', header: 'Email', visible: true },
        { field: 'role', header: 'Cargo', visible: true }
    ];
    sortField = 'name';
    sortDirection = 'asc';
    showColumnSelector = false;
    searchTerm: string = '';

    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.currentUser = this.authService.getUser();
        this.loadUsers();
    }

    get filteredUsers(): User[] {
        if (!this.searchTerm) return this.users;
        const lowerTerm = this.searchTerm.toLowerCase();
        return this.users.filter(user =>
            user.name.toLowerCase().includes(lowerTerm) ||
            user.email.toLowerCase().includes(lowerTerm) ||
            user.username?.toLowerCase().includes(lowerTerm)
        );
    }

    getRoleTranslation(role: string): string {
        if (!role) return '';
        switch (role.toUpperCase()) {
            case 'ADMIN': return 'Administrador';
            case 'OWNER': return 'Proprietário';
            case 'USER': return 'Usuário';
            case 'PROFESSIONAL': return 'Profissional';
            case 'CUSTOMER': return 'Cliente';
            case 'EMPLOYEE': return 'Funcionário';
            case 'MANAGER': return 'Gerente';
            default: return role;
        }
    }

    loadUsers(): void {
        const sort = `${this.sortField},${this.sortDirection}`;
        this.userService.getAll(this.page, this.size, sort).subscribe({
            next: (data) => {
                this.users = data.content;
                this.totalPages = data.totalPages;
            },
            error: (err) => {
                this.toastr.error('Erro ao carregar usuários', 'Erro');
                console.error(err);
            }
        });
    }

    toggleColumnSelector(): void {
        this.showColumnSelector = !this.showColumnSelector;
    }

    toggleColumn(col: any): void {
        col.visible = !col.visible;
    }

    onSort(field: string): void {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.loadUsers();
    }

    isColumnVisible(field: string): boolean {
        return this.columns.find(c => c.field === field)?.visible ?? true;
    }

    canEdit(targetUser: User): boolean {
        if (!this.currentUser) return false;

        const isSelf = this.currentUser.id === targetUser.id;
        if (isSelf) return true;

        const iamAdmin = this.currentUser.roles.includes('ADMIN');
        const iamOwner = this.currentUser.roles.includes('OWNER');

        const targetIsAdmin = targetUser.roles?.includes('ADMIN');
        const targetIsOwner = targetUser.roles?.includes('OWNER');

        // OWNER cannot edit ADMIN (Admin > Owner)
        if (iamOwner && targetIsAdmin) return false;

        return true;
    }

    canDelete(targetUser: User): boolean {
        // Same logic as edit for now, plus no self-delete usually, but API handles that?
        return this.canEdit(targetUser) && this.currentUser?.id !== targetUser.id;
    }

    // Modal Logic
    openNewUserModal(): void {
        this.selectedUser = null;
        this.isDeleteMode = false;
        this.showModal = true;
    }

    editUser(id: string): void {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.selectedUser = user;
            this.isDeleteMode = false;
            this.showModal = true;
        }
    }

    deleteUser(id: string): void {
        const user = this.users.find(u => u.id === id);
        if (user) {
            this.selectedUser = user;
            this.isDeleteMode = true;
            this.showModal = true;
        }
    }

    onModalClose(): void {
        this.showModal = false;
        this.selectedUser = null;
        this.isDeleteMode = false;
    }

    onModalSaved(): void {
        this.loadUsers();
    }

    nextPage(): void {
        if (this.page < this.totalPages - 1) {
            this.page++;
            this.loadUsers();
        }
    }

    prevPage(): void {
        if (this.page > 0) {
            this.page--;
            this.loadUsers();
        }
    }
}
