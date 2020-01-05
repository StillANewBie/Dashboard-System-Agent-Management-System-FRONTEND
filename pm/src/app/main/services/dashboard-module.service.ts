import { Injectable } from "@angular/core";
import { GridsterConfig, GridType, DisplayGrid, GridsterItem } from 'angular-gridster2';
import { HttpClient } from '@angular/common/http';
import { UUID } from 'angular2-uuid'
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ModuleConfigComponent } from '../components/dashboard/modules/module-config/module-config.component';

export interface IComponent {
    id: string,
    componentRef: string,
    option?: any
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

        }
    }

    layout: GridsterItem[] = [];
    components: IComponent[] = [];

    dropId: string;
    dashboardFromDb: any = null;

    moduleConfig: any = {};

    constructor(private http: HttpClient, private dialog: MatDialog) {}


	dropItem(dragId: string): void {
		const newContainerId = UUID.UUID();

        // open dialog
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';
        dialogConfig.height = "300px";
        dialogConfig.data = newContainerId;

        const dialogRef = this.dialog.open(ModuleConfigComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.moduleConfig = result;
        })


		this.layout.push({
			cols: 4,
			rows: 3,
			id: newContainerId,
			x: 0,
			y: 0
		});

		const { components } = this;

		const comp: IComponent = components.find((c) => c.id === newContainerId);
		const updateIdx: number = comp ? components.indexOf(comp) : components.length;

		const componentItem: IComponent = {
			id: newContainerId,
			componentRef: dragId
		};

		this.components = Object.assign([], components, { [updateIdx]: componentItem });
		setTimeout(() => {
			// this.postDashboardInfo();
        }, 100);
    }
    
    deleteItem(id: string) : void {
        const item = this.layout.find((d) => d.id === id);
        this.layout.splice(this.layout.indexOf(item), 1);
        const comp = this.components.find((c) => c.id === id);
        this.components.splice(this.components.indexOf(comp), 1);
    }

	setDropId(dropId: string): void {
		this.dropId = dropId;
	}

	getComponentRef(id: string): string {
		const comp = this.components.find((c) => c.id === id);
		return comp ? comp.componentRef : null;
    }
    
    postDashboardInfo() {
        // TODO
    }

    getDashboardInfo() {
        // TODO
    }

    initModules() {
        // TODO
    }


}