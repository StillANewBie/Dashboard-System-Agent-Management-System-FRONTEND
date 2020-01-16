import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent } from 'angular-calendar';
import { MatDialog } from '@angular/material';
import { DayDialogComponent } from './day-dialog/day-dialog.component';
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

@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss']
})
export class FrontPageComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  constructor(public dialog: MatDialog) { }


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
