import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    updateProfile(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    getProfile(id: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getAll(page: number = 0, size: number = 10, sort: string = 'name,asc'): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}&sort=${sort}`);
    }

    create(user: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, user);
    }

    update(id: string, user: any): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, user);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
