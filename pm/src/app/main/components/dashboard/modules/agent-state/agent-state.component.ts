import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { CurrentAgentStateDTO, ModulesService } from '../../../../services/modules.service';

@Component({
	selector: 'app-agent-state',
	templateUrl: './agent-state.component.html',
	styleUrls: [ './agent-state.component.scss' ]
})
export class AgentStateComponent implements OnInit {
	gid: number = 1;
  data: CurrentAgentStateDTO[] = [];
  
	@ViewChild('agGrid', null)
	agGrid: AgGridAngular;
	agApi: GridApi = null;
	title = 'app';
  newInjector: Injector;
  columnDefs;

	onGridReady = (params) => {
		this.agApi = params.api;
		this.agApi.sizeColumnsToFit();
	};

	resizeTable(e = null) {
    if (this.agApi) {
      this.agApi.sizeColumnsToFit();
    }
	}

	onResize(e) {
		this.resizeTable(e);
		
	}

	constructor(private ms: ModulesService, public injector: Injector) {
    this.columnDefs = [
      { headerName: 'Call Id', field: 'make', sortable: true, filter: 'agNumberColumnFilter' },
      { headerName: 'Queue Time', field: 'queueTime', sortable: true, filter: 'agNumberColumnFilter' },
      { headerName: 'Service Time', field: 'serviceTime', sortable: true, filter: 'agNumberColumnFilter', type: 'numericColumn' },
      { headerName: 'Agent Name', field: 'name', sortable: true, filter: true},
      { headerName: 'Profile Img', field: 'profileImage' }
    ];
  }

  updateData() {
	this.ms.getCurrentAgentState(this.gid).subscribe(
		(res: CurrentAgentStateDTO[]) => {
			this.data = res.map(el =>  {return {... el, name: el.firstName + " " + el.lastName}});
		},
		(error) => {
			console.log(error);
		}
	);
  }

	ngOnInit() {
		this.updateData();
		setInterval(() => {
			this.updateData();
		}, 5000);

		setInterval(()=> {
			this.agApi && this.resizeTable(null)
		  }, 1000)
	}
}
