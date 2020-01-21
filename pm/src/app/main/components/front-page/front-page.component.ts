import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { MatDialog } from '@angular/material';
import { DayDialogComponent } from './day-dialog/day-dialog.component';
import { FrontPageService, MeetingDTO } from '../../services/front-page.service';
import { Store } from '@ngrx/store';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { AppState } from 'src/app/ngrx/app.state';
import { UserAdminDTO } from '../user-admin/user-admin.component';

export const colors: any = {
	red: {
		primary: '#ad2121',
		secondary: '#FAE3E3'
	},
	blue: {
		primary: '#1e90ff',
		secondary: '#D1E8FF'
	},
	yellow: {
		primary: '#e3bc08',
		secondary: '#FDF1BA'
	},
	grey: {
		primary: 'grey',
		secondary: '#555'
	}
};

@Component({
	selector: 'app-front-page',
	templateUrl: './front-page.component.html',
	styleUrls: [ './front-page.component.scss' ]
})
export class FrontPageComponent implements OnInit {
	view: CalendarView = CalendarView.Month;
	viewDate: Date = new Date();
	events: CalendarEvent[] = [];
	currentUser: UserAdminDTO;
	meetingsInitiator: MeetingDTO[];
	meetingsInvitee: MeetingDTO[];

	constructor(public dialog: MatDialog, private fps: FrontPageService, private store: Store<AppState>) {
		this.store.select((el) => el.loginInfo).subscribe((res) => {
			this.currentUser = res;
			this.getInitiatorEvents();
		});
	}

	getInitiatorEvents() {
		this.fps.findMeetingsByInitiatorId(this.currentUser.userId).subscribe(
			(res) => {
				this.meetingsInitiator = res;
				this.events = [];
				const set = new Set();
				for (let el of res) {
					if (!set.has(el.meetingId) && !el.meetingCancelled) {
						this.events.push({
							id: el.meetingId,
							start: new Date(new Date(el.date).setDate(new Date(el.date).getDate() + 1)),
							title: el.meetingTitle,
							color: this.compareTime(el.time.toString(), el.date) ? colors.red : colors.grey
						});
						set.add(el.meetingId);
					}
				}
				this.fps.findMeetingsByInviteeId(this.currentUser.userId).subscribe(
					(res) => {
						const temp: CalendarEvent[] = [];
						this.meetingsInvitee = res;
						for (let el of res) {
							if (!set.has(el.meetingId) && !el.meetingCancelled && el.result != 2) {
								temp.push({
									id: el.meetingId,
									start: new Date(new Date(el.date).setDate(new Date(el.date).getDate() + 1)),
									title: el.meetingTitle,
									color: this.compareTime(el.time.toString(), el.date) ? colors.yellow : colors.grey
								});
								set.add(el.meetingId);
							}
						}
						this.events = [ ...this.events, ...temp ];
					},
					(err) => console.error(err)
				);
			},
			(err) => {
				console.error(err);
			}
		);
	}

	compareTime(time: string, date: Date): boolean {
		const now = new Date();
		const tmpDate = new Date(new Date(date).setDate(new Date(date).getDate() + 1));
		const c1 = tmpDate >= new Date(new Date().setHours(0, 0, 0, 0));
		if (!c1) {
			return false;
		}

		const arr = time.split(':');

		if (new Date(tmpDate.setHours(0, 0, 0, 0)).toString() == new Date(new Date().setHours(0, 0, 0, 0)).toString()) {

			if (
				Number.parseInt(arr[0]) < now.getHours() ||
				(Number.parseInt(arr[0]) == now.getHours() && Number.parseInt(arr[1]) < now.getMinutes()) ||
				(Number.parseInt(arr[0]) == now.getHours() &&
					Number.parseInt(arr[1]) == now.getMinutes() &&
					Number.parseInt(arr[2]) < now.getSeconds())
			) {
				return false;
			}
		}

		return true;
	}

	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			const data = { owned: [], date, attending: [] };
			data.owned =
				this.meetingsInitiator &&
				this.meetingsInitiator.filter((el) => {
					return events.filter((at) => at.id == el.meetingId).length >= 1;
				});
			data.attending =
				this.meetingsInvitee &&
				this.meetingsInvitee.filter((el) => {
					return events.filter((at) => at.id == el.meetingId).length >= 1;
				});
			this.openDialog(data);
		}
	}

	openDialog(data): void {
		const dialogRef = this.dialog.open(DayDialogComponent, {
			width: '55vw',
			height: '90vh',
			data
		});

		dialogRef.afterClosed().subscribe((result) => {
			this.getInitiatorEvents();
		});
	}

	ngOnInit() {}
}
