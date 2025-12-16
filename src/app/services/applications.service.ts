import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private apiUrl = 'https://localhost:7250/api/applications';

  constructor(private http: HttpClient) {}

  getMyApplications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createApplication(data: { type: string; message: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}