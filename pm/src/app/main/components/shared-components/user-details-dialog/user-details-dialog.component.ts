import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAdminDTO } from '../../user-admin/user-admin.component';
import { UserAdminService } from '../../../services/user-admin.service';

@Component({
	selector: 'app-user-details-dialog',
	templateUrl: './user-details-dialog.component.html',
	styleUrls: [ './user-details-dialog.component.scss' ]
})
export class UserDetailsDialogComponent implements OnInit, OnDestroy {
	hideDelay = new FormControl(1000);
	imgSrc: string = '';

	constructor(
		private uas: UserAdminService,
		public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UserAdminDTO
	) {}

	closeDialog(): void {
		this.dialogRef.close();
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
