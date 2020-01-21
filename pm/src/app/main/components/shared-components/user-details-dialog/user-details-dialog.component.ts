import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { UserAdminDTO, RoleDTO, GroupLevelDTO, UserInfoDTO } from '../../user-admin/user-admin.component';
import { UserAdminService } from '../../../services/user-admin.service';
import { GroupDTO } from '../../dashboard/modules/module-config/module-config.component';

@Component({
	selector: 'app-user-details-dialog',
	templateUrl: './user-details-dialog.component.html',
	styleUrls: [ './user-details-dialog.component.scss' ]
})
export class UserDetailsDialogComponent implements OnInit, OnDestroy {
	hideDelay = new FormControl(1000);
	imgSrc: string = '';
	profileForEdit: UserAdminDTO;
	profileEditing: boolean = false;
	roleList: RoleDTO[];
	groupLevelList: GroupLevelDTO[];
	groupList: GroupDTO[];
	dataChanged: boolean = false;

	constructor(
		private uas: UserAdminService,
		public dialogRef: MatDialogRef<UserDetailsDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: UserAdminDTO,
		private snackBar: MatSnackBar
	) {
		this.uas.getRoles().subscribe(
			(res) => {
				this.roleList = res;
				if (!this.profileForEdit) {
					this.profileForEdit = { roles: [ this.roleList[0] ] };
				}
			},
			(err) => console.log(err)
		);
		this.uas.getGroupLevels().subscribe((res) => (this.groupLevelList = res), (err) => console.log(err));
		this.uas.getGroups().subscribe(
			(res) => {
				this.groupList = res;
				this.groupList.sort((a, b) => a.groupName.localeCompare(b.groupName));
			},
			(err) => console.log(err)
		);
	}

	closeDialog(): void {
		this.profileEditing = null;
		this.profileEditing = false;
		this.dialogRef.close({ dataChanged: this.dataChanged });
	}

	editProfile() {
		this.profileForEdit = JSON.parse(JSON.stringify(this.data));
		if (this.data.roles.length < 1) {
			this.profileForEdit = {...this.profileForEdit, roles: this.roleList}
		} 
		if (!this.data.group) {
			this.profileForEdit = {...this.profileForEdit, group: this.groupList[0]}
		}
		this.profileEditing = true;
	}

	cancelEditing() {
		this.profileEditing = null;
		this.profileEditing = false;
	}

	submitEditing() {
		if (
			!this.profileForEdit.userInfo.lastName ||
			!this.profileForEdit.userInfo.firstName ||
			!this.profileForEdit.userInfo.lastName.trim() ||
			!this.profileForEdit.userInfo.firstName.trim()
		) {
			this.openSnackBar('Name cannot be empty!', 'OK');
			return;
		} else if (!this.profileForEdit.userInfo.email || !this.profileForEdit.userInfo.email.trim()) {
			this.openSnackBar('Email cannot be empty!', 'OK');
			return;
		} else if (
			this.profileForEdit.group.groupLevelInfo.groupLevel !=
			this.groupList.find((el) => el.groupId === this.profileForEdit.group.groupId).groupLevelInfo.groupLevel
		) {
			this.openSnackBar("Group Level doesn't match!", 'OK');
			return;
		}

		this.uas.saveUserInfo(this.profileForEdit.userInfo, this.data.userId, false).subscribe(
			(res) => {
				this.data.userInfo = this.profileForEdit.userInfo;
			},
			(err) => console.error(err)
		);
		this.uas.saveUserGroupInfo(this.profileForEdit.userId, this.profileForEdit.group.groupId).subscribe(
			(res) => {
				this.data.group = this.profileForEdit.group;
				this.dataChanged = true;
			},
			(err) => console.error(err)
		);
		this.uas.saveUserRoleInfo(this.profileForEdit.userId, this.profileForEdit.roles[0].id).subscribe(
			(res) => {
				this.data.roles = this.profileForEdit.roles;
				this.dataChanged = true;
			},
			(err) => console.error(err)
		);

		this.profileEditing = false;
		this.profileEditing = null;
	}

	openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 5000
		});
	}

	replaceImage(e) {
		this.uas.openImageCropDialog(this.data).subscribe(
			(res) => {
				this.imgSrc = res;
				this.uas.uploadImage(res, this.data.userId);
				this.dataChanged = true;
			},
			(err) => {
				console.log(err);
			}
		);
	}

	activeOnChange(e) {
		console.log(e);
		this.uas.setUserActiveStatus(this.data.userId, e.checked).subscribe((res) => {}, (err) => console.log(err));
		this.dataChanged = true;
	}

	ngOnInit() {
		console.log(this.data);
	}

	ngOnDestroy() {}
}
