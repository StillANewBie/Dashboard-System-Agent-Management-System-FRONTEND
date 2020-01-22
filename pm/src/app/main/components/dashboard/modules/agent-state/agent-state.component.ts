import { Component, Injector, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi } from 'ag-grid-community';
import { CurrentAgentStateDTO, ModulesService } from '../../../../services/modules.service';
import { GroupDTO } from '../module-config/module-config.component';
import { UserAdminDTO } from '../../../user-admin/user-admin.component';
import { UserAdminService } from '../../../../services/user-admin.service';

@Component({
	selector: 'app-agent-state',
	templateUrl: './agent-state.component.html',
	styleUrls: [ './agent-state.component.scss' ]
})
export class AgentStateComponent implements OnInit, OnDestroy {
	gid: number = 1;
	data: CurrentAgentStateDTO[] = [];
	headerHeight: number;
	selectedGroup: GroupDTO;

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

	constructor(private ms: ModulesService, 
		public injector: Injector,
		private uas: UserAdminService) {
		this.columnDefs = [
			{ headerName: 'Call Id', field: 'callId', sortable: true, filter: 'agNumberColumnFilter' },
			{
				headerName: 'Priority',
				field: 'priority',
				sortable: true,
				filter: 'agNumberColumnFilter',
				cellStyle: (params) => {
					if (params.value > 1) {
						return { color: 'red' };
					} else if (params.value === 1) {
						return { color: 'orange' };
					} else {
						return { color: 'green' };
					}
				}
			},
			{
				headerName: 'Queue Time',
				field: 'queueTime',
				sortable: true,
				filter: 'agNumberColumnFilter',
				cellStyle: (params) => {
					if (params.value > 60) {
						return { color: 'white', background: 'red' };
					} else if (params.value > 30) {
						return { color: 'black', background: 'yellow' };
					} else {
						return { color: 'white', background: 'green' };
					}
				}
			},
			{ headerName: 'Service Start', field: 'serviceStart', sortable: true, filter: 'agTextColumnFilter' },
			{
				headerName: 'Service Time (S)',
				field: 'serviceTime',
				sortable: true,
				filter: 'agNumberColumnFilter'
			},
			{ headerName: 'Agent Name', field: 'name', sortable: true, filter: true },
			{ headerName: 'Group Name', field: 'groupName', sortable: true, filter: true }
		];
		this.headerHeight = 40;
	}

	updateData() {
		this.ms.getCurrentAgentState(this.selectedGroup.groupId || this.gid).subscribe(
			(res: CurrentAgentStateDTO[]) => {
				this.data = res.map((el) => {
					return { ...el, name: el.firstName + ' ' + el.lastName };
				});
				if (this.agApi) {
					this.agApi.setRowData(this.data);
					this.agApi.redrawRows();
				}
			},
			(error) => {
				console.log(error);
			}
		);
	}
	
	onCellClicked(e) {
		if (e.column && e.column.colDef && e.column.colDef.field === "name") {
			this.uas.getUserById(e.data.agentId).subscribe(
				res => {
					this.uas.openUserAdminDialog(res).afterClosed().subscribe(result => {
					});
				},
				err => {
					console.error(err);
				}
			)
		}
	}

	ngOnInit() {
		this.updateData();
		setInterval(() => {
			this.updateData();
		}, 5000);

		setInterval(() => {
			this.agApi && this.resizeTable(null);
		}, 1000);
	}

	ngOnDestroy() {
		this.agApi = null;
		this.agGrid = null;
	}
}
