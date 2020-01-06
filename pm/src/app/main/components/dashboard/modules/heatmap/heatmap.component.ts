import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as LF from 'leaflet';
import HeatmapOverlay from 'leaflet-heatmap/leaflet-heatmap.js';
import * as LFT from 'leaflet-timedimension';
import { ModulesService } from '../../../../services/modules.service';
import { GroupDTO } from '../module-config/module-config.component';
import { Time } from '@angular/common';

@Component({
	selector: 'app-heatmap',
	templateUrl: './heatmap.component.html',
	styleUrls: [ './heatmap.component.scss' ]
})
export class HeatmapComponent implements OnInit, AfterViewInit {
  private map;
  // heatmapLayer;
	uuid: string;
	mapId: string;
	data: any;
	selectedGroup: GroupDTO;

	constructor(private ms: ModulesService) {}

	private initMap(): void {    
    const cfg = {
      "radius": 2,
      "maxOpacity": .8,
      "scaleRadius": true,
      "useLocalExtrema": true,
      "latField": 'lat',
      "lngField": 'lng',
      "valueField": 'value'
    }

    var testData = {
      max: 8,
      data: [{lat: 40, lng:-100, count: 3},{lat: 41, lng:-100, count: 1}]
    };

    let heatmapLayer = new HeatmapOverlay(cfg);

		const tiles = LF.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 9,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			minZoom: 1,
			zoomDelta: 0.5,
			zoomSnap: 0.5,
			// noWrap: true,
			maxBounds: [ [ -90, -160 ], [ 90, 200 ] ]
		});

		this.map = LF.map(this.mapId, {
			center: [ 40, -100 ],
			zoom: 4,
			maxBoundsViscosity: 1.0,
			maxBounds: [ [ -90, -160 ], [ 90, 200 ] ],
			zoomDelta: 0.5,
			zoomSnap: 0.5,
      dragging: true,
      layers: [tiles, heatmapLayer]
    });
    
    heatmapLayer.setData(testData);

		// tiles.addTo(this.map);
	}

	ngOnInit() {
		this.mapId = 'map' + this.uuid;

		this.ms.getHeatmapData(this.selectedGroup.groupId).subscribe((res) => {
			this.data = res;
			console.log(res);
		});
	}

	ngAfterViewInit() {
		setTimeout(() => this.initMap());
	}
}
export interface HeatmapData {
	lat: number;
	lng: number;
	value: number;
	timestamp: Date;
}
