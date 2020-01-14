import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
	ModuleConfigComponent,
	ModuleConfigDTO
} from '../components/dashboard/modules/module-config/module-config.component';

export interface IComponent {
	id: string;
	componentRef: string;
	option?: ModuleConfigDTO;
}

@Injectable({
	providedIn: 'root'
})
export class DashboardModuleService {
	options: GridsterConfig = {
		draggable: {
			enabled: true,
			ignoreContentClass: 'ag-table',
			ignoreContent: true, // if true drag will start only from elements from `dragHandleClass`
			dragHandleClass: 'drag-handler' // drag event only from this class. If `ignoreContent` is true.
		},
		pushItems: true,
		resizable: {
			enabled: true
		},
		gridType: GridType.Fixed,
		fixedColWidth: 200,
		fixedRowHeight: 120,
		displayGrid: DisplayGrid.None,
		itemChangeCallback: (e1, e2) => {
			this.layout.map((el) => {
				if (el.id == e1.id) {
					el = e1;
				}
				return el;
			});
			setTimeout(() => {
				this.postDashboardInfo();
			}, 500);
		}
	};

	layout: GridsterItem[] = [];
	components: IComponent[] = [];
	dropId: string;
	dashboardFromDb: any = null;
	moduleConfig: any = {};
	dashboardLoaded: boolean = false;

	constructor(private http: HttpClient, private dialog: MatDialog) {}

	dropItem(dragId: string): void {
		const newContainerId = UUID.UUID();
		const newContainerRef = {
			id: newContainerId,
			componentRef: dragId
		};

		if (dragId !== 'outcomes') {
			// open dialog
			const dialogConfig = new MatDialogConfig();

			dialogConfig.disableClose = true;
			dialogConfig.autoFocus = true;
			dialogConfig.width = '400px';
			dialogConfig.height = '300px';
			dialogConfig.data = newContainerRef;

			const dialogRef = this.dialog.open(ModuleConfigComponent, dialogConfig);
			dialogRef.afterClosed().subscribe((result) => {
				// TODO add cancel function
				if (result) {
					this.layout.push({
						cols: 4,
						rows: 3,
						id: newContainerId,
						x: 0,
						y: 0
					});

					const { components } = this;
					setTimeout(() => {
						this.postDashboardInfo();
					}, 100);
				}
			});
		} else {
			this.layout.push({
				cols: 4,
				rows: 4,
				id: newContainerId,
				x: 0,
				y: 0
			});
			if (!Array.isArray(this.components)) {
				this.components = [];
			}
			this.components.push({...newContainerRef, option: {type: 7, uuid: newContainerId}});
			const { components } = this;
			setTimeout(() => {
				this.postDashboardInfo();
			}, 100);
		}
	}

	deleteItem(id: string): void {
		const item = this.layout.find((d) => d.id === id);
		this.layout.splice(this.layout.indexOf(item), 1);
		const comp = this.components.find((c) => c.id === id);
		this.components.splice(this.components.indexOf(comp), 1);
		this.postDashboardInfo();
	}

	setDropId(dropId: string): void {
		this.dropId = dropId;
	}

	getComponentRef(id: string): IComponent {
		const comp = this.components.find((c) => c.id === id);
		return comp;
	}

	postDashboardInfo() {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-type': 'text/plain'
			}),
			withCredentials: true
		};
		this.http
			.post(
				`${environment.API_URL}/dashboard/state`,
				{ layout: this.layout, components: this.components },
				httpOptions
				// {withCredentials: true}
			)
			.subscribe((res) => {}, (err) => console.log(err));
	}

	getDashboardInfo(): Observable<any> {
		return this.http.get(`${environment.API_URL}/dashboard/state`, { withCredentials: true });
	}

	initModules() {
		this.getDashboardInfo().subscribe(
			(res) => {
				this.dashboardFromDb = res;
				if (this.dashboardFromDb) {
					this.dashboardFromDb.layout && this.dashboardFromDb.layout.forEach((el) => this.layout.push(el));
					this.components = this.dashboardFromDb.components;
				}
				this.dashboardLoaded = true;
			},
			(err) => {}
		);
	}
}
