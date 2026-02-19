import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

@Injectable({
    providedIn: 'root'
})
export class AppointmentsService {
    private apiUrl = `${environment.apiUrl}/appointments`;

    constructor(private http: HttpClient) { }

    getAppointments(page: number = 0, size: number = 1000): Observable<Page<Appointment>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', 'startTime,asc');

        return this.http.get<Page<Appointment>>(this.apiUrl, { params });
    }

    getAppointmentById(id: string): Observable<Appointment> {
        return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
    }

    create(appointment: any): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, appointment);
    }

    update(id: string, appointment: any): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
