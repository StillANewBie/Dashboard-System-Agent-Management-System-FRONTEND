import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserAdminDTO } from '../../user-admin/user-admin.component';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-user-details-dialog',
	templateUrl: './user-details-dialog.component.html',
  styleUrls: [ './user-details-dialog.component.scss' ],
})
export class UserDetailsDialogComponent implements OnInit, OnDestroy {

  hideDelay = new FormControl(1000);
  
	constructor(
		public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UserAdminDTO
	) {}

	closeDialog(): void {
		this.dialogRef.close();
  }

  replaceImage(e) {
    
  }

	ngOnInit() {
    console.log(this.data);
    
  }

	ngOnDestroy() {}
}
