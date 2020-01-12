import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { UserAdminService } from '../../../services/user-admin.service';

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
  @ViewChild('stepper', null) 
  private stepper: MatStepper;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private uas: UserAdminService,
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

  submitUser(form: FormGroup) {
    console.log(form);
    this.uas.registerUser(form.value.username, form.value.p1).subscribe(
      res => {
        this.stepper.next();
      },
      err => console.error(err));
  }

  submitUserInfo(form: FormGroup) {
    console.log(form);
    this.stepper.next();
  }

  submitGroupRole(form: FormGroup) {
    console.log(form);
  }

  static validatePasswords(ps: FormGroup) {
    const {p1, p2} = ps.value;
    console.log(p1);
    console.log(p2);
    return p1 === p2? null: {passwordsNotMatch: 'passwords has to match!'}
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', [
      Validators.required,
      Validators.minLength(6)]],
      passwords: this.fb.group({
        p1: ['', [Validators.required, Validators.minLength(6)]],
        p2: ['', [Validators.required, Validators.minLength(6)]]
      }, {validator: [AddUserComponent.validatePasswords]}) 
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
