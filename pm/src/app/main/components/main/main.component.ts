import { Component, OnInit } from '@angular/core';
import { DashboardModuleService } from '../../services/dashboard-module.service';
import { UserAdminDTO } from '../user-admin/user-admin.component';
import { AppState } from '../../../ngrx/app.state';
import { Store } from '@ngrx/store';
import { UserAdminService } from '../../services/user-admin.service';
import { LOGIN_INFO } from '../../../ngrx/reducers/login.reducer';
import { AuthenticationService } from '../../../login/services/authentication.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: [ './main.component.scss' ]
})
export class MainComponent implements OnInit {
	showWide: boolean = false;
	showWideSpan: boolean = false;
	dashboardMode: boolean = false;
	currentUser: UserAdminDTO;
	
	constructor(		
		private store: Store<AppState>,
		public uas: UserAdminService,
		private as: AuthenticationService,
		private router: Router,
		public dmService: DashboardModuleService // for html!
	) {
		this.store.select(el => el.loginInfo).subscribe((res) => {
				this.currentUser = res;
      });
	}

	openMyProfile() {
		this.uas.openUserAdminDialog(this.currentUser).afterClosed().subscribe(result => {

		});
	}

	showWideEvent() {
		this.showWide = !this.showWide;
		if (this.showWide) {
			setTimeout(() => (this.showWideSpan = this.showWide), 300);
		} else {
			this.showWideSpan = this.showWide;
			this.dashboardMode = false;
		}
	}

	openDashboard() {
		this.showWide = true;
		setTimeout(() => (this.showWideSpan = this.showWide), 300);
		this.dashboardMode = true;
	}

	logout() {
		this.as.logout();
		this.router.navigate(['login']).catch();
		window.location.reload();
	}

	ngOnInit() {
		this.uas.getUndecidedEventCountByToken(JSON.parse(localStorage.getItem('currentUser')).token)
						.subscribe(
							res => this.uas.notificationCount = res,
							err => console.error(err)
						);
    if (!this.currentUser || !this.currentUser.username) {
			this.uas.getCurrentUser(JSON.parse(localStorage.getItem('currentUser')).token).subscribe(
				(res) => {
					this.currentUser = res;
					this.store.dispatch({
            type: LOGIN_INFO,
            payload: this.currentUser
					});
        },
				(err) => console.error(err)
			);
		} 
	}
}
