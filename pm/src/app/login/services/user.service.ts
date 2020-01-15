import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { UserAdminDTO } from '../../main/components/user-admin/user-admin.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<UserAdminDTO[]>(`${environment.API_URL}/user-admin/users`);
  }
}