import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  userInfoForm: FormGroup;
  groupRoleForm: FormGroup;
  linearMode: boolean = true;

  constructor(private fb: FormBuilder,
		public dialogRef: MatDialogRef<AddUserComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

  resetUser(e) {
    this.userForm.reset();
  }

  resetUserInfo(e) {
    this.userInfoForm.reset();
  }

  resetGroupRole(e) {
    this.groupRoleForm.reset();
  }

  closeDialog(userAdded: boolean) {
    this.dialogRef.close({userAdded});
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: [''],
      p1: [''],
      p2: ['']
    });
    this.userInfoForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      desc: ['']
    });
    this.groupRoleForm = this.fb.group({
      role: [''],
      groupLevel: [''],
      group: ['']
    });

  }

}
