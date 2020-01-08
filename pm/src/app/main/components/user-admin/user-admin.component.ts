import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { UserAdminService } from '../../services/user-admin.service';
import { GroupDTO } from '../dashboard/modules/module-config/module-config.component';

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
				filter: 'agTextColumnFilter'
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

	onGridReady(params) {
    this.agApi = params.api;
    this.updateUserList();
		this.agApi.sizeColumnsToFit();
		// this.updateHeaderStyle();
	}

	resizeTable(e = null) {
		if (this.agApi) {
			this.agApi.sizeColumnsToFit();
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
						groupLevelName: el.group && el.group.groupLevelInfo.groupLevelName
					};
				});
				if (this.agApi) {
					this.agApi.setRowData(this.userList);
					this.agApi.redrawRows();
					console.log(this.agApi);
				}
			},
			(err) => {
				console.log(err);
			}
		);
	}
	ngOnInit() {}

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
}

export interface UserInfoDTO {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	profileImage: string;
}

export interface role {
	id: number;
	roleName: string;
	authority: string;
}
