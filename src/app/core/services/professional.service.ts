import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfessionalDTO } from '../models/appointment.model';

@Injectable({
    providedIn: 'root'
})
export class ProfessionalService {
    private apiUrl = `${environment.apiUrl}/professionals`;

    constructor(private http: HttpClient) { }

    getAllProfessionals(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}
