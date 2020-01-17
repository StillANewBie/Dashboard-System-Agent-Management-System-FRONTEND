import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../shared-components/image-crop/image-crop.component';

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

	constructor(private dialogRef: MatDialogRef<DayDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

	toggleAttendees(i: number) {
		this.showAttendees = this.showAttendees === i ? -1 : i;
	}

	toggleInitiator(i: number) {
		this.showInitiator = this.showInitiator === i ? -1 : i;
	}

	convertResult(n: number): string {
		switch (n) {
			case 0:
				return 'undecided';
			case 1:
				return 'attend';
			case 2:
				return 'not going';
			default:
				return 'undecided';
		}
	}

	ngOnInit() {
		console.log(this.data);
		let set = new Set();
		this.data.owned.forEach((el) => {
			if (!set.has(el.meetingId)) {
				set.add(el.meetingId);
				this.owned.push({
					meetingId: el.meetingId,
					meetingTitle: el.meetingTitle,
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
							decision: this.convertResult(el.result)
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
							decision: this.convertResult(el.result)
						});
					}
				}
			}
		});
		this.data.attending.forEach((el) => {
			this.attending.push({
				meetingId: el.meetingId,
				meetingTitle: el.meetingTitle,
				meetingMemo: el.meetingMemo || 'N/A',
				date: el.date,
				time: el.time,
				active: !el.meetingCancelled,
				decision: this.convertResult(el.result),
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

		console.log(this.attending);
		console.log(this.owned);
		let a = new Date();
	}
}

export interface DayDialogData {
	meetingId?: number;
	meetingTitle?: string;
	meetingMemo?: string;
	date?: string;
	time?: string;
	active?: boolean;
	attendees?: Attendee[];
	decision?: number | string;
}

export interface Attendee {
	firstName?: string;
	lastName?: string;
	email?: string;
	image?: string;
	decision?: number | string;
}
