import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../../ngrx/app.state';
import { LOGIN_INFO } from '../../../ngrx/reducers/login.reducer';
import { UserAdminDTO } from 'src/app/main/components/user-admin/user-admin.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {return this.loginForm.controls;}

  onSubmit(f, e) {
    e.preventDefault();
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

      this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.store.dispatch({
            type: LOGIN_INFO,
            payload: data.user
          });
          this.router.navigate([this.returnUrl]);

        },
        err => {
          console.log(err)
          this.loading = false;
          if (err == 'Unauthorized') {
            // TODO
          }
        }
      );
  } 

}
