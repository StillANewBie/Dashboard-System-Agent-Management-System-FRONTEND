import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { UserAdminDTO } from '../components/user-admin/user-admin.component';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { UserDetailsDialogComponent } from '../components/shared-components/user-details-dialog/user-details-dialog.component';
import { ImageCropComponent } from '../components/shared-components/image-crop/image-crop.component';

@Injectable({
	providedIn: 'root'
})
export class UserAdminService {
	constructor(private http: HttpClient, private dialog: MatDialog) {}

	getAllUsers(): Observable<any> {
		return this.http.get(`${environment.API_URL}/user-admin/users`, { withCredentials: true });
	}

	openUserAdminDialog(param) {
		// open dialog
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = false;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '100vw';
		dialogConfig.height = '90vh';
		dialogConfig.data = param;

		const dialogRef = this.dialog.open(UserDetailsDialogComponent, dialogConfig);
	}

	openImageCropDialog(param: UserAdminDTO): Observable<any> {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '30vw';
		dialogConfig.height = '50vh';
		dialogConfig.minHeight = '300px';
		dialogConfig.minWidth = '300px';
		dialogConfig.data = { src: param.userInfo.profileImage };

		const dialogRef = this.dialog.open(ImageCropComponent, dialogConfig);
		return dialogRef.afterClosed();
    }
    
	b64toBlob(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);

		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ ab ], { type: 'image/jpeg' });
    }
    
	uploadImage(data, userId) {
		const config = {
			reportProgress: true,
			withCredential: true,
			headers: {
				'Content-Type': 'undefined',
				'Access-Control-Allow-Credentials': true
			}
		};

		let formData: FormData = new FormData();
		formData.append('data', this.b64toBlob(data), 'asdf.jpg');

		formData.append('userId', userId);
		const options = {
			headers: new HttpHeaders().append('Access-Control-Allow-Credentials', 'true')
		};

		this.http
			.post(`${environment.API_URL}/user-admin/upload-image`, formData, { withCredentials: true })
			.subscribe((res) => console.log(res), (err) => console.log(err));
    }
    
    getRoles(): Observable<any> {
        return this.http.get(`${environment.API_URL}/user-admin/roles`);
    }

    getGroupLevels(): Observable<any> {
        return this.http.get(`${environment.API_URL}/user-admin/group-level`);
    }

    getGroups(): Observable<any> {
        return this.http.get(`${environment.API_URL}/user-admin/groups`);
    }
}
