import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BusinessDTO } from '../models/appointment.model';

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    private apiUrl = `${environment.apiUrl}/businesses`;

    constructor(private http: HttpClient) { }

    getAllBusinesses(): Observable<any> { // TODO: Define Page<BusinessDTO> properly if needed
        return this.http.get<any>(this.apiUrl);
    }
}
