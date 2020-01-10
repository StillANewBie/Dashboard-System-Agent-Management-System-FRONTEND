import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAdminDTO, Role } from '../../user-admin/user-admin.component';
import { UserAdminService } from '../../../services/user-admin.service';

@Component({
	selector: 'app-user-details-dialog',
	templateUrl: './user-details-dialog.component.html',
	styleUrls: [ './user-details-dialog.component.scss' ]
})
export class UserDetailsDialogComponent implements OnInit, OnDestroy {
	hideDelay = new FormControl(1000);
  imgSrc: string = '';
  profileForEdit: UserAdminDTO;
  profileEditing: boolean = false;
  roleList: Role[];

	constructor(
		private uas: UserAdminService,
		public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UserAdminDTO
	) {
    this.uas.getRoles().subscribe(res => this.roleList = res, err => console.log(err));
  }

	closeDialog(): void {
		this.dialogRef.close();
  }
  
  editProfile() {
    this.profileForEdit = JSON.parse(JSON.stringify(this.data));
    this.profileEditing = true;
    console.log(this.roleList);
    
  }

  cancelEditing() {
    this.profileEditing = null;
    this.profileEditing = false;
  }

  submitEditing() {
    console.log(this.profileForEdit);
    this.profileEditing = false;
    this.profileEditing = null; 
  }

	replaceImage(e) {
		this.uas.openImageCropDialog(this.data).subscribe(
			(res) => {
        this.imgSrc = res;
        console.log(res);
        this.uas.uploadImage(res, this.data.userId);
			},
			(err) => {
				console.log(err);
			}
		);
	}

	ngOnInit() {
		console.log(this.data);
	}

	ngOnDestroy() {}
}
