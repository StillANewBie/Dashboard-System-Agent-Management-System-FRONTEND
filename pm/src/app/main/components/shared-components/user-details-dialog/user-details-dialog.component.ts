import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAdminDTO } from '../../user-admin/user-admin.component';

@Component({
	selector: 'app-user-details-dialog',
	templateUrl: './user-details-dialog.component.html',
	styleUrls: [ './user-details-dialog.component.scss' ]
})
export class UserDetailsDialogComponent implements OnInit, OnDestroy {
	constructor(
		public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UserAdminDTO
	) {}

	onNoClick(): void {
		this.dialogRef.close();
	}

	ngOnInit() {}

	ngOnDestroy() {}
}
