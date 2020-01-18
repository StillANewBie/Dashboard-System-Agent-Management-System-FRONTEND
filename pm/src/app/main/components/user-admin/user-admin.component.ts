import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import * as $ from 'jquery';
import { AppState } from 'src/app/ngrx/app.state';
import { UserAdminService } from '../../services/user-admin.service';
import { GroupDTO } from '../dashboard/modules/module-config/module-config.component';
import { USER_LIST } from '../../../ngrx/reducers/user-list.reducer';

@Component({
	selector: 'app-user-admin',
	templateUrl: './user-admin.component.html',
	styleUrls: [ './user-admin.component.scss' ]
})
export class UserAdminComponent implements OnInit, OnDestroy {
	@ViewChild('agGrid', undefined)
	agGrid: AgGridAngular;
	agApi: GridApi = null;
	columnDefs;
	headerHeight: number;
	userList: UserAdminDTO[];
	res: any[];

	constructor(private uas: UserAdminService, private store: Store<AppState>) {
		this.columnDefs = [
			{
				headerName: 'Name',
				field: 'name',
				sortable: true,
				filter: 'agTextColumnFilter',
				cellRenderer: (e) => {
					return `
						<div style="cursor: pointer;" class="d-flex align-items-center name_cell">
							<img src="${e.data.profileImage}" 
								class="profile_image" 
								onerror="this.src='assets/img/profile.png'" />
							<div class="ml-3"> ${e.data.name} </div>
						</div>
					`;
				},
				sort: 'asc',
				comparator: function(a,b) {
				if (typeof a === 'string') {
					 return a.toLowerCase().localeCompare(b.toLowerCase());
				} else {
					 return (a > b ? 1 : (a < b ? -1 : 0));
				}
			}
			},
			{
				headerName: 'Role',
				field: 'role',
				sortable: true,
				filter: 'agTextColumnFilter'
			},
			{
				headerName: 'Group',
				field: 'groupName',
				sortable: true,
				filter: 'agTextColumnFilter'
			},
			{
				headerName: 'Group Level',
				field: 'groupLevelName',
				sortable: true,
				filter: 'agTextColumnFilter'
			},
			{
				headerName: 'Active',
				filed: 'active',
				sortable: true,
				filter: false,
				valueGetter: (params) => {
					return params.data.active? '✓': '⨯';
				},
				cellStyle: (params) => {
					if (params.data.active) {
						return {'font-size': '2rem', color: 'green'};
					} else {
						return {'font-size': '2rem', color: 'red'};
					}
				}
			}
		];
		this.headerHeight = 40;
	}

	getRowHeight(e) {
		return 60;
	}

	onGridReady(params) {
		this.agApi = params.api;
		this.updateUserList();
		this.agApi.sizeColumnsToFit();
		// this.updateHeaderStyle();
	}
	
	onCellClicked(e) {
		if (e.column && e.column.colDef && e.column.colDef.field === "name") {
			this.uas.openUserAdminDialog(e.data).afterClosed().subscribe(result => {
				if (result)	this.updateUserList();
			});
		}
	}

	updateTableStyle() {
		$('.ag-theme-material .ag-cell').css({ display: 'flex', 'align-items': 'center' });
		$('.ag-header-cell').css({ 'font-size': '1.3rem', background: '#222', color: '#EEE' });
		$('.ag-theme-material .ag-icon').css({'color':'#AAA'});
		$('.ag-header-cell-text').css({width: '10rem', 'text-shadow': '2px 2px 1px grey'});
	}

	resizeTable(e = null) {
		if (this.agApi) {
			this.agApi.sizeColumnsToFit();
			this.updateTableStyle();
		}
	}

	updateUserList() {
		this.uas.getAllUsers().subscribe(
			(res) => {
				this.res = res;

				this.userList = this.res.filter(el => el.active).map((el) => {
					return {
						...el,
						name: el.userInfo && el.userInfo.firstName + ' ' + el.userInfo.lastName,
						profileImage: el.userInfo && el.userInfo.profileImage,
						email: el.userInfo && el.userInfo.email,
						role: el.roles && el.roles[0] && el.roles[0].roleName,
						groupName: el.group && el.group.groupName,
						groupLevelName: el.group && el.group.groupLevelInfo.groupLevelName,
						rowHeight: 100
					};
				});

				////////////////////////////////////////////////
				this.store.dispatch({
					type: USER_LIST,
					payload: this.userList
				});
				/////////////////////////////////////////////////


				if (this.agApi) {
					this.agApi.setRowData(this.userList);
					this.agApi.redrawRows();
				}
				this.updateTableStyle();
			},
			(err) => {
				console.log(err);
			}
		);
		this.updateTableStyle();
	}

	addUserDialog(e) {
		this.uas.openAddUserDialog().afterClosed().subscribe(
			res => {
				if (res) this.updateUserList();
			}
		)
	}

	onActiveFilterChange(e) {
		console.log(e);
		
		if (!e.checked) {
			this.userList = this.res.filter(el => el.active).map((el) => {
				return {
					...el,
					name: el.userInfo && el.userInfo.firstName + ' ' + el.userInfo.lastName,
					profileImage: el.userInfo && el.userInfo.profileImage,
					email: el.userInfo && el.userInfo.email,
					role: el.roles && el.roles[0].roleName,
					groupName: el.group && el.group.groupName,
					groupLevelName: el.group && el.group.groupLevelInfo.groupLevelName,
					rowHeight: 100
				};
			});
		} else {
			this.userList = this.res.map((el) => {
				return {
					...el,
					name: el.userInfo && el.userInfo.firstName + ' ' + el.userInfo.lastName,
					profileImage: el.userInfo && el.userInfo.profileImage,
					email: el.userInfo && el.userInfo.email,
					role: el.roles && el.roles[0].roleName,
					groupName: el.group && el.group.groupName,
					groupLevelName: el.group && el.group.groupLevelInfo.groupLevelName,
					rowHeight: 100
				};
			});
		}
				
		if (this.agApi) {
			this.agApi.setRowData(this.userList);
			this.agApi.redrawRows();
		}
		this.updateTableStyle();

	}

	ngOnInit() {
		setInterval(() => {
			this.agApi && this.resizeTable(null);
		}, 1000);
	}

	ngOnDestroy() {
		this.agApi = null;
		this.agGrid = null;
	}
}

export class UserAdminDTO {
	userId?: number;
	username?: string;
	name?: string;
	group?: GroupDTO;
	userInfo?: UserInfoDTO;
	roles?: RoleDTO[];
	active?: boolean;
	password?: string;
	token?: string;
}

export interface UserInfoDTO {
	id?: number;
	firstName: string;
	lastName: string;
	email: string;
	profileImage?: string;
	description?: string;
	user?: UserAdminDTO;
}

export interface RoleDTO {
	id?: number;
	roleName?: string;
	authority?: string;
}

export interface GroupLevelDTO {
	groupLevel: number;
	groupLevelName: string;
}