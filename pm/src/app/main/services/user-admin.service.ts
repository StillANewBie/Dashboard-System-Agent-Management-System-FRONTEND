import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserAdminDTO } from '../components/user-admin/user-admin.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    getAllUsers(): Observable<any> {
        return this.http.get(`${environment.API_URL}/user-admin/users`, {withCredentials: true})
    }

    openUserAdminDialog(data) {
        const dialogRed = this.dialog.open()
    }
}