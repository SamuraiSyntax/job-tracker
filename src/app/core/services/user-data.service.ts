
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserDataService {
    private readonly API_URL = `${environment.apiUrl}/user`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    exportUser(): Observable<Blob> {
        const token = this.authService.getToken();
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.get(`${this.API_URL}/export`, {
            responseType: 'blob',
            observe: 'response' as 'response',
            headers
        })
            .pipe(
                map((resp) => {
                    if (!resp.body) {
                        throw new Error('Aucune donnée à exporter.');
                    }
                    return resp.body;
                })
            );
    }

    importUser(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.API_URL}/import`, formData);
    }
    deleteUser(): Observable<any> {
        const token = this.authService.getToken();
        let headers = new HttpHeaders();
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return this.http.delete(`${this.API_URL}/delete`, { headers });
    }
}
