import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../shared-components/image-crop/image-crop.component';

@Component({
  selector: 'app-day-dialog',
  templateUrl: './day-dialog.component.html',
  styleUrls: ['./day-dialog.component.scss']
})
export class DayDialogComponent implements OnInit {

  dataTree: DayDialogData[] = [];

  constructor(private dialogRef: MatDialogRef<DayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data)
    let set = new Set();
    this.data.owned.forEach(el => {
      if (!set.has(el.meetingId)) {
        set.add(el.meetingId);
        this.dataTree.push({
          meetingId: el.meetingId, 
          meetingTitle: el.meetingTitle, 
          meetingMemo: el.meetingMemo,
          date: el.date,
          time: el.time,
          active: !el.meetingCancelled,
          attendees: [
            {
              firstName: el.inviteeFirstName,
              lastName: el.inviteeLastName,
              email: el.inviteeEmail,
              image: el.inviteeImage
            }
          ]
        })
      } else {
        for (let at of this.dataTree) {
          if (at.meetingId === el.meetingId) {
            at.attendees.push({
              firstName: el.inviteeFirstName,
              lastName: el.inviteeLastName,
              email: el.inviteeEmail,
              image: el.inviteeImage
            })
          }
        }
      }
    });
    this.data.attending.forEach(el => {
        this.dataTree.push({
          meetingId: el.meetingId, 
          meetingTitle: el.meetingTitle, 
          meetingMemo: el.meetingMemo,
          date: el.date,
          time: el.time,
          active: !el.meetingCancelled,
          attendees: [
            {
              firstName: el.initiatorFirstName,
              lastName: el.initiatorLastName,
              email: el.initiatorEmail,
              image: el.initiatorImage
            }
          ]
        })
    });

    console.log(this.dataTree);

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
}

export interface Attendee {
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  decision?: number;
}