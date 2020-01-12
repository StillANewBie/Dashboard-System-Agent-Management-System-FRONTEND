import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { UserAdminService } from '../../../services/user-admin.service';
import { UserAdminDTO, UserInfoDTO } from '../user-admin.component';

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
  user: UserAdminDTO;
  @ViewChild('stepper', null) 
  private stepper: MatStepper;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>,
    private uas: UserAdminService,
		@Inject(MAT_DIALOG_DATA) public data: any) { }

  get username() {return this.userForm.get('username')}
  get passwords() {return this.userForm.get('passwords')}

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
      (res: UserAdminDTO) => {
        this.user = res;
        console.log(res)
        this.stepper.next();
      },
      err => console.error(err));
  }

  submitUserInfo(form: FormGroup) {
    if (this.user) {
      const ui: UserInfoDTO = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        description: form.value.desc
      }
      console.log(ui);
      
      this.uas.registerUserInfo(ui, this.user.userId).subscribe(
        res => {
          console.log(res);
        },
        err => console.error(err)
      )
      console.log(form);
      this.stepper.next();
    }
  }

  submitGroupRole(form: FormGroup) {
    console.log(form);
  }

  static validatePasswords(ps: FormGroup) {
    const {p1, p2} = ps.value;
    if (p1 && p1.length < 6) return {minlength: 'Password must have a minimum length of 6!'}
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
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      desc: ['']
    });
    this.groupRoleForm = this.fb.group({
      role: ['', [Validators.required]],
      groupLevel: ['', [Validators.required]],
      group: ['', [Validators.required]]
    });

  }

}
