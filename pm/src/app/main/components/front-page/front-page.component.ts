import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { MatDialog } from '@angular/material';
import { DayDialogComponent } from './day-dialog/day-dialog.component';
import { FrontPageService, MeetingDTO } from '../../services/front-page.service';
import { Store } from '@ngrx/store';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { AppState } from 'src/app/ngrx/app.state';
import { UserAdminDTO } from '../user-admin/user-admin.component';

const colors: any = {
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
  }
}

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  currentUser: UserAdminDTO;
  meetingsInitiator: MeetingDTO[];
  meetingsInvitee: MeetingDTO[];

  constructor(public dialog: MatDialog, private fps: FrontPageService, private store: Store<AppState>) { 

		this.store.subscribe((el) => {
      if (el.loginInfo && el.loginInfo.userId) {
        this.currentUser = el.loginInfo;
        this.getInitiatorEvents();
      }
    });  
  }

  getInitiatorEvents() {
    this.fps.findMeetingsByInitiatorId(this.currentUser.userId).subscribe(
      res => {
        this.meetingsInitiator = res;
        this.events = [];
        const set = new Set();
        console.log(res)
        for (let el of res) {
          if (!set.has(el.meetingId)) {
            this.events.push({
              start: new Date(el.date),
              title: el.meetingTitle,
              color: colors.red
            })
            set.add(el.meetingId);
          } 
        }
        this.fps.findMeetingsByInviteeId(this.currentUser.userId).subscribe (
          res => {
          console.log(res)
          const temp: CalendarEvent[] = [];
          for (let el of res) {
            if (!set.has(el.meetingId)) {
              temp.push({
                start: new Date(el.date),
                title: el.meetingTitle,
                color: colors.red
              })
              set.add(el.meetingId);
            } 
          }
          this.events = [...this.events, ...temp];
        },
        err => console.error(err))
      },
      err => {
        console.error(err);
      }
    )
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      console.log(this.viewDate)
    }
    this.openDialog(date);
  }

  openDialog(date): void {
    const dialogRef = this.dialog.open(DayDialogComponent, {
      width: '50vw',
      height: '50vh',
      data: {date}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  ngOnInit() {
  }

}
