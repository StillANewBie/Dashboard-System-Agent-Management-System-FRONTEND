import { Component, OnInit } from '@angular/core';
import { DashboardModuleService, IComponent } from '../../services/dashboard-module.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


	constructor(private dmService: DashboardModuleService) {
		this.dmService.getDashboardInfo();
	}

	get options(): GridsterConfig {
		return this.dmService.options;
	}

	get layout(): GridsterItem[] {
		return this.dmService.layout;
	}

	get components(): IComponent[] {
		return this.dmService.components;
	}

	ngOnInit() {
		this.dmService.initModules();
	}

}
