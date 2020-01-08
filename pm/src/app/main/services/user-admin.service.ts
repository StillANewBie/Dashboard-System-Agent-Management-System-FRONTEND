import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserAdminDTO } from '../components/user-admin/user-admin.component';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { UserDetailsDialogComponent } from '../components/shared-components/user-details-dialog/user-details-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class UserAdminService {

    constructor(private http: HttpClient, private dialog: MatDialog) {}

    getAllUsers(): Observable<any> {
        return this.http.get(`${environment.API_URL}/user-admin/users`, {withCredentials: true})
    }

    openUserAdminDialog(param) {
		// open dialog
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80vw';
        dialogConfig.height = '80vh';
        dialogConfig.data = param;
        
        const dialogRef = this.dialog.open(UserDetailsDialogComponent, dialogConfig);
    }
}