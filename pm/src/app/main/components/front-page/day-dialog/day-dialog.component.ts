import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../../shared-components/image-crop/image-crop.component';

@Component({
  selector: 'app-day-dialog',
  templateUrl: './day-dialog.component.html',
  styleUrls: ['./day-dialog.component.scss']
})
export class DayDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    console.log(this.data)
  }

}
