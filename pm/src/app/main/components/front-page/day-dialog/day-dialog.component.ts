import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogData } from '../../shared-components/image-crop/image-crop.component';
import { FrontPageService } from '../../../services/front-page.service';
import { OrganizeMeetingComponent } from '../organize-meeting/organize-meeting.component';

@Component({
	selector: 'app-day-dialog',
	templateUrl: './day-dialog.component.html',
	styleUrls: [ './day-dialog.component.scss' ]
})
export class DayDialogComponent implements OnInit {
	owned: DayDialogData[] = [];
	attending: DayDialogData[] = [];
	showAttendees: number;
	showInitiator: number;

	constructor(
		private dialogRef: MatDialogRef<DayDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fps: FrontPageService,
		public dialog: MatDialog
	) {}

	toggleAttendees(i: number) {
		this.showAttendees = this.showAttendees === i ? -1 : i;
	}

	toggleInitiator(i: number) {
		this.showInitiator = this.showInitiator === i ? -1 : i;
	}

	convertResult(n: number): string {
		switch (n) {
			case 0:
				return 'Undecided';
			case 1:
				return 'Going';
			case 2:
				return 'Not going';
			default:
				return 'Undecided';
		}
	}

	cancelMeeting($event, data: DayDialogData) {
		this.fps.cancelMeeting(data.meetingId).subscribe((res) => {
			if (res.success) {
				this.owned.map((el) => {
					if (el.meetingId == data.meetingId) {
						el.active = false;
					}
				});
			}
		});
	}

	going($event, data: DayDialogData) {
		this.fps.alterMeetingDecision(data.meetingInviteesId, 1).subscribe((res) => {
			if (res.success) {
				this.attending.map((el) => {
					if (el.meetingId == data.meetingId) {
						el.result = 1;
						el.decision = this.convertResult(1);
					}
				});
			}
		});
	}

	notGoing($event, data) {
		this.fps.alterMeetingDecision(data.meetingInviteesId, 2).subscribe((res) => {
			if (res.success) {
				this.attending.map((el) => {
					if (el.meetingId == data.meetingId) {
						el.result = 2;
						el.decision = this.convertResult(2);
					}
				});
			}
		});
	}

	initiateMeeting() {
		const dialogRef = this.dialog.open(OrganizeMeetingComponent, {
			width: '50vw',
			height: '70vh',
			data: this.data
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				this.dialogRef.close();
			}
		});
	}

	compareTime(time: string): boolean {
		const now = new Date();

		const arr = time.split(':');

		if (
			Number.parseInt(arr[0]) < now.getHours() ||
			(Number.parseInt(arr[0]) == now.getHours() && Number.parseInt(arr[1]) < now.getMinutes()) ||
			(Number.parseInt(arr[0]) == now.getHours() &&
				Number.parseInt(arr[1]) == now.getMinutes() &&
				Number.parseInt(arr[2]) < now.getSeconds())
		) {
			return false;
		}

		return true;
	}

	ngOnInit() {
		console.log(this.data);

		let set = new Set();
		this.data &&
			this.data.owned &&
			this.data.owned.forEach((el) => {
				if (!set.has(el.meetingId)) {
					set.add(el.meetingId);
					this.owned.push({
						meetingId: el.meetingId,
						meetingTitle: el.meetingTitle,
						meetingInviteesId: el.meetingInviteesId,
						meetingMemo: el.meetingMemo || 'N/A',
						date: el.date,
						time: el.time,
						active: !el.meetingCancelled,
						attendees: [
							{
								firstName: el.inviteeFirstName,
								lastName: el.inviteeLastName,
								email: el.inviteeEmail,
								image: el.inviteeImage,
								decision: this.convertResult(el.result),
								result: el.result
							}
						]
					});
				} else {
					for (let at of this.owned) {
						if (at.meetingId === el.meetingId) {
							at.attendees.push({
								firstName: el.inviteeFirstName,
								lastName: el.inviteeLastName,
								email: el.inviteeEmail,
								image: el.inviteeImage,
								decision: this.convertResult(el.result),
								result: el.result
							});
						}
					}
				}
			});
		this.data &&
			this.data.attending &&
			this.data.attending.forEach((el) => {
				this.attending.push({
					meetingId: el.meetingId,
					meetingTitle: el.meetingTitle,
					meetingInviteesId: el.meetingInviteesId,
					meetingMemo: el.meetingMemo || 'N/A',
					date: el.date,
					time: el.time,
					active: !el.meetingCancelled,
					decision: this.convertResult(el.result),
					result: el.result,
					attendees: [
						{
							firstName: el.initiatorFirstName,
							lastName: el.initiatorLastName,
							email: el.initiatorEmail,
							image: el.initiatorImage
						}
					]
				});
			});
	}
}

export interface DayDialogData {
	meetingId?: number;
	meetingTitle?: string;
	meetingMemo?: string;
	meetingInviteesId?: number;
	date?: string;
	time?: string;
	active?: boolean;
	attendees?: Attendee[];
	decision?: number | string;
	result?: number;
}

export interface Attendee {
	firstName?: string;
	lastName?: string;
	email?: string;
	image?: string;
	decision?: number | string;
	result?: number;
}
