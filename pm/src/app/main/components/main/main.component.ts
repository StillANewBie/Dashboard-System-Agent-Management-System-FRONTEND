import { Component, OnInit } from '@angular/core';
import { DashboardModuleService } from '../../services/dashboard-module.service';
import { UserAdminDTO } from '../user-admin/user-admin.component';
import { AppState } from '../../../ngrx/app.state';
import { Store } from '@ngrx/store';
import { UserAdminService } from '../../services/user-admin.service';
import { LOGIN_INFO } from '../../../ngrx/reducers/login.reducer';

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
		private dmService: DashboardModuleService,
		private store: Store<AppState>,
		private uas: UserAdminService
	) {
		this.store.subscribe((el) => {
      if (el.loginInfo instanceof UserAdminDTO) {
        this.currentUser = el.loginInfo;
      }
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

	ngOnInit() {
    
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
