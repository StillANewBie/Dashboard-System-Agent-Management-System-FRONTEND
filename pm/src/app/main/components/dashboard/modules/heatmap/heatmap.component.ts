import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as LF from 'leaflet';
import * as LFH from 'leaflet-heatmap';
import { ModulesService } from '../../../../services/modules.service';
import { GroupDTO } from '../module-config/module-config.component';

@Component({
	selector: 'app-heatmap',
	templateUrl: './heatmap.component.html',
	styleUrls: [ './heatmap.component.scss' ]
})
export class HeatmapComponent implements OnInit, AfterViewInit {
  private map;
  uuid: string;
  mapId: string;
  data: any;
  selectedGroup: GroupDTO;

	constructor(private ms: ModulesService) {
  }

	private initMap(): void {
    console.log(this.mapId);
    
		this.map = LF.map(this.mapId, {
			center: [ 40, -100 ],
			zoom: 4,
			maxBoundsViscosity: 1.0,
			maxBounds:[ [-90, -160], [90, 200] ],
			zoomDelta: 0.5,
			zoomSnap: 0.5,
			dragging: true,
		});

		const tiles = LF.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 9,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 1,
			zoomDelta: 0.5,
			zoomSnap: 0.5,
			// noWrap: true,
			maxBounds:[ [-90, -160], [90, 200] ],
		});

		tiles.addTo(this.map);
	}

	ngOnInit() {
    this.mapId = 'map' + this.uuid;

    this.ms.getHeatmapData(this.selectedGroup.groupId).subscribe(res => {
      this.data = res
    })
  }

	ngAfterViewInit() {
    setTimeout(() => this.initMap());
	}
}
