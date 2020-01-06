import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as LF from 'leaflet';
import { ModulesService } from '../../../../services/modules.service';
import { GroupDTO } from '../module-config/module-config.component';

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
  layerGroup;
  phoneIcon;

	constructor(private ms: ModulesService) {}

	private initMap(): void {
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
			layers: [ tiles ]
		});

		tiles.addTo(this.map);
  }
  
  updateMarkers() {
    this.ms.getHeatmapData(this.selectedGroup.groupId).subscribe((res) => {
      this.data = res;
      console.log(res);
      // this.map._panes.markerPane.remove();
      this.layerGroup = LF.layerGroup().addTo(this.map);
      Object.keys(this.data).forEach(k => {
        const lat = this.data[k][0].latitude;
        const lng = this.data[k][0].longitude;
        LF.marker([lat, lng], {icon: this.phoneIcon}).addTo(this.layerGroup).bindPopup(`<b>Density: ${this.data[k].length}</b> <br>
                                                                <b>Area Code: ${k}</b>`);
      })
    });
  }

	ngOnInit() {
    this.phoneIcon = LF.icon({
      iconUrl: 'https://mercury-pm-images.s3.amazonaws.com/icons/phone_red.png',
  
      iconSize:     [35, 35], // size of the icon
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, -5]
    })

    this.mapId = 'map' + this.uuid;
    this.updateMarkers();
    setInterval(()=> {
      this.layerGroup.clearLayers();
      this.updateMarkers();
    }, 5000);
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
