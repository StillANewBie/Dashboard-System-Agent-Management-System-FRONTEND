import { HeatmapComponent } from '../components/dashboard/modules/heatmap/heatmap.component';
import { AgetStateComponent } from '../components/dashboard/modules/aget-state/aget-state.component';
import { AgentStateComponent } from '../components/dashboard/modules/agent-state/agent-state.component';
import { Directive, OnChanges, Input, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

export const moduleComponents = {
	heatmap: HeatmapComponent,
	agentState: AgentStateComponent
};

@Directive({
	selector: '[dashboardModule]'
})
export class DashboardModuleDirective implements OnChanges {
	@Input() componentRef: string;

	component: ComponentRef<any>;

    constructor(private container: ViewContainerRef, private resolver: ComponentFactoryResolver) {}
    
    ngOnChanges(e): void {
        const component = moduleComponents[this.componentRef];
        if (component) {
            const factory = this.resolver.resolveComponentFactory<any>(component);
            this.component = this.container.createComponent(factory);
            // TODO config injection
        }
    }
}
