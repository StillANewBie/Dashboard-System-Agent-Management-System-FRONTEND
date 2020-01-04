import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "@ag-grid-community/angular";

@Component({
    selector: 'profile-image-cell',
    template: `<span>image</span>`,
    styles: [
        `.btn {
            line-height: 0.5
        }`
    ]
})
export class ProfileImageRendererComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
        console.log(this.params)
    }

    // public invokeParentMethod() {
    //     this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`)
    // }

    refresh(): boolean {
        return false;
    }
}