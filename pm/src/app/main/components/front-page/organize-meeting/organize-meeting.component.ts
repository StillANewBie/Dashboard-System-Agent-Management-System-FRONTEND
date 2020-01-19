import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ViewChildren,
	ElementRef,
	AfterViewChecked,
	Inject
} from '@angular/core';
import { AppState } from '../../../../ngrx/app.state';
import { Store } from '@ngrx/store';
import { UserAdminDTO } from '../../user-admin/user-admin.component';
import { UserAdminService } from '../../../services/user-admin.service';
import { USER_LIST } from '../../../../ngrx/reducers/user-list.reducer';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FrontPageService } from '../../../services/front-page.service';

@Component({
	selector: 'app-organize-meeting',
	templateUrl: './organize-meeting.component.html',
	styleUrls: [ './organize-meeting.component.scss' ]
})
export class OrganizeMeetingComponent implements OnInit, AfterViewChecked {
	stateCtrl = new FormControl();
	filteredStates: Observable<UserAdminDTO[]>;
	userList: UserAdminDTO[];
	selectedUsers = [ {} ];
	attendeeForm = new FormGroup({
		selected: new FormControl([])
	});
	valueChange: boolean = false;
	meetingTitle: string = '';
	meetingMemo: string = '';
	meetingTime: any;
	currentUser: UserAdminDTO;

	constructor(
		private dialogRef: MatDialogRef<OrganizeMeetingComponent>,
		private fps: FrontPageService,
		private store: Store<AppState>,
		private uas: UserAdminService,
		private er: ElementRef,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.store.select((res) => res.loginInfo).subscribe((res) => {
			this.currentUser = res;

			this.store.select((res) => res.userList).subscribe(
				(res: UserAdminDTO[]) => {
					if (res && res.length >= 1) {
						this.userList = res.filter(el => el.userId != this.currentUser.userId)
																.sort((a, b) => a.username.localeCompare(b.username));
						this.initFilter();
					} else {
						this.uas.getAllUsers().subscribe((res) => {
							this.userList = res;
							this.store.dispatch({
								type: USER_LIST,
								payload: res
							});
							this.initFilter();
						});
					}
				},
				(err) => {
					console.error(err);
				}
			);
		});
	}

	private _filterStates(value: string): UserAdminDTO[] {
		const filterValue = value.toLowerCase();

		return this.userList.filter((state) => state.username.toLowerCase().indexOf(filterValue) === 0);
	}

	initFilter() {
		this.filteredStates = this.stateCtrl.valueChanges.pipe(
			startWith(''),
			map((state) => (state ? this._filterStates(state) : this.userList.slice()))
		);
	}

	addAttendee() {
		this.selectedUsers.push({});
		this.valueChange = true;
	}

	ngAfterViewChecked() {
		if (this.valueChange) {
			setTimeout(() => {
				const temp = this.er.nativeElement.getElementsByClassName('attendee_input');
				temp[this.selectedUsers.length - 1].value = '';
				this.valueChange = false;
			});
		}
	}

	cancel() {
		this.dialogRef.close();
	}

	submit() {
		const element = this.er.nativeElement.getElementsByClassName('attendee_input');
		if (element.length < 1) {
		} else {
			const nameSet = new Set();

			for (let el of element) {
				nameSet.add(el.value);
			}

			// console.log(this.data);
			// console.log(this.data.date.toLocaleDateString());
			// console.log(nameSet);
			// console.log(this.meetingTime);
			// console.log(this.currentUser)

			this.fps
				.initiateMeeting(
					this.meetingTitle,
					this.currentUser.userId,
					this.meetingMemo,
					this.data.date.toLocaleDateString(),
					this.meetingTime
				)
				.subscribe(
					(res) => {
						this.userList.forEach((el) => {
							if (nameSet.has(el.username)) {
								this.fps.saveMeetingInvitee(res, el.userId).subscribe(
									(res1) => {
										this.dialogRef.close(true);
									},
									(err1) => {
										console.error(err1);
									}
								);
							}
						});
					},
					(err) => {
						console.error(err);
					}
				);
		}
	}

	ngOnInit() {
		this.er.nativeElement.getElementsByClassName('time_input')[0].defaultValue = '10:00';
	}
}
