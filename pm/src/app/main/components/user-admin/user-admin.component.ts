import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { UserAdminService } from '../../services/user-admin.service';
import { GroupDTO } from '../dashboard/modules/module-config/module-config.component';
import * as $ from 'jquery';

@Component({
	selector: 'app-user-admin',
	templateUrl: './user-admin.component.html',
	styleUrls: [ './user-admin.component.scss' ]
})
export class UserAdminComponent implements OnInit, OnDestroy {
	@ViewChild('agGrid', null)
	agGrid: AgGridAngular;
	agApi: GridApi = null;
	columnDefs;
	headerHeight: number;
	userList: UserAdminDTO[];

	constructor(private uas: UserAdminService) {
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
								onerror="this.src='https://mercury-pm-images.s3.amazonaws.com/images/profile.png'"/>
							<div class="ml-3"> ${e.data.name} </div>
						</div>
					`;
				},
				sort: 'asc'
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
				this.userList = res.map((el) => {
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

export interface UserAdminDTO {
	userId: number;
	username: string;
	name?: string;
	group: GroupDTO;
	userInfo: UserInfoDTO;
	roles: RoleDTO[]
}

export interface UserInfoDTO {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	profileImage: string;
	description: string;
}

export interface RoleDTO {
	id: number;
	roleName: string;
	authority: string;
}

export interface GroupLevelDTO {
	groupLevel: number;
	groupLevelName: string;
}