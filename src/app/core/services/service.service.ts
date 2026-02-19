import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceDTO } from '../models/appointment.model';

@Injectable({
    providedIn: 'root'
})
export class ServiceService {
    private apiUrl = `${environment.apiUrl}/services`;

    constructor(private http: HttpClient) { }

    getAllServices(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }
}
