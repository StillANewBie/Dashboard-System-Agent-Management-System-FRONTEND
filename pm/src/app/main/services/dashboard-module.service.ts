import { Injectable } from '@angular/core';
import { GridsterConfig, GridType, DisplayGrid, GridsterItem } from 'angular-gridster2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {
	ModuleConfigComponent,
	ModuleConfigDTO
} from '../components/dashboard/modules/module-config/module-config.component';
import { ModulesService } from './modules.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
			ignoreContentClass: 'ag-table'
		},
		pushItems: true,
		resizable: {
			enabled: true
		},
		gridType: GridType.Fixed,
		fixedColWidth: 200,
		fixedRowHeight: 120,
		displayGrid: DisplayGrid.None,
		itemResizeCallback: (e1, e2) => {
			console.log(e1);
            console.log(e2);
            
            this.layout.map(el => {
                if (el.id == e1.id) {
                    el = e1;
                }
                return el;
            })
            setTimeout( () => {
                this.postDashboardInfo()
            }, 500)
		}
	};

	layout: GridsterItem[] = [];
	components: IComponent[] = [];

	dropId: string;
	dashboardFromDb: any = null;

	moduleConfig: any = {};

    constructor(private http: HttpClient, private dialog: MatDialog) {}

	dropItem(dragId: string): void {
		const newContainerId = UUID.UUID();
		const newContainerRef = {
			id: newContainerId,
			componentRef: dragId
		};

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

			this.layout.push({
				cols: 4,
				rows: 3,
				id: newContainerId,
				x: 0,
				y: 0
			});

			const { components } = this;
			console.log(components);
			// const comp: IComponent = components.find((c) => c.id === newContainerId);
			// const updateIdx: number = comp ? components.indexOf(comp) : components.length;

			// const componentItem: IComponent = {
			// 	id: newContainerId,
			// 	componentRef: dragId,
			// 	option: result
			// };

			// this.components = Object.assign([], components, { [updateIdx]: componentItem });
			setTimeout(() => {
				this.postDashboardInfo();
			}, 100);
		});
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
        console.log(this.layout);

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
			.subscribe((res) => console.log(res), (err) => console.log(err));
	}

	getDashboardInfo(): Observable<any> {
		return this.http.get(`${environment.API_URL}/dashboard/state`, { withCredentials: true });
	}

	initModules() {
		this.getDashboardInfo().subscribe(
			(res) => {
				this.dashboardFromDb = res;
				console.log(res);
				if (this.dashboardFromDb) {
					this.dashboardFromDb.layout && this.dashboardFromDb.layout.forEach((el) => this.layout.push(el));
					this.components = this.dashboardFromDb.components;
				}
			},
			(err) => {}
		);
	}
}
