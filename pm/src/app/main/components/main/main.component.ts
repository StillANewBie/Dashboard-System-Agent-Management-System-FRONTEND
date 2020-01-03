import { Component, OnInit } from '@angular/core';
import { DashboardModuleService } from '../../services/dashboard-module.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  showWide:boolean = false;
  showWideSpan:boolean = false;
  dashboardMode: boolean = false;
  constructor(private dmService: DashboardModuleService ) { }

  showWideEvent() {
    this.showWide = !this.showWide;
    if (this.showWide) {
      setTimeout(() => this.showWideSpan = this.showWide, 200)
    } else {
      this.showWideSpan = this.showWide
    }
  }

  openDashboard() {
    this.showWide = true;
    setTimeout(() => this.showWideSpan = this.showWide, 200);
    this.dashboardMode = true;
  }

  ngOnInit() {
  }

}
