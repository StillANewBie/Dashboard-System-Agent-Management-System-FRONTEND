import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ModulesService } from '../../../../services/modules.service';

@Component({
	selector: 'app-outcome',
	templateUrl: './outcome.component.html',
	styleUrls: [ './outcome.component.scss' ]
})
export class OutcomeComponent implements OnInit {
	chart: any;
	moduleData: OutcomeDTO[];
	type: number = 7;
	getRequest;
  uuid: string;
  canvasId: string = 'canvas-avg';

	constructor(private fps: ModulesService) {
	}

	updateChart(res) {
		this.moduleData = res;
		// if (Array.isArray(this.data)) {
			this.chart = new Chart(this.canvasId || 'canvas-avg', {
				type: 'doughnut',
				data: {
					labels: this.moduleData.map((el) => el.outcomeType),
					datasets: [
						{
							data: this.moduleData.map((el) => el.count),
							backgroundColor: this.moduleData.map((el) => {
								switch (el.outcomeType) {
									case 'PHANTOM':
										return 'orange';
									case 'HANG':
										return 'red';
									case 'AGENT':
										return 'green';
									default:
										return 'grey';
								}
							}),
							hoverBorderColor: this.moduleData.map((el) => {
								switch (el.outcomeType) {
									case 'PHANTOM':
										return 'orange';
									case 'HANG':
										return 'red';
									case 'AGENT':
										return 'green';
									default:
										return 'grey';
								}
							}),
							// fille: true,
							responsive: true,
							maintainAspectRatio: true
						}
					]
				},
				options: {
					legend: {
						display: true,
						position: 'top'
          },
          // title: {
          //   display: true,
          //   text: 'Call Outcomes',
          //   position: 'top',
          //   padding: 20
            
          // },
					tooltips: {
						enabled: true
					},
					layout: {
						// padding: {
						// 	left: 20,
						// 	right: 10,
						// 	top: 10,
						// 	bottom: 10
						// }
          },
          plugins: {
            datalabels: {
              color: '#000',
              anchor: 'end',
              clamp: false,
              align: 'end'
            }
          }
        },
        // plugins: [ChartDataLabels]
			});
		// }
	}

	onSelectChange(e) {
		this.fps.getOutcomes(e.value).subscribe(
		  res => {
        this.chart.destroy();
		    this.updateChart(res);
		  }
    )

		// this.getRequest.next(e.value);
	}

	ngOnInit() {
		// const makeRequest = new Observable();
		// this.getRequest = makeRequest
		// 	.pipe(
		// 		switchMap((value: number) => {
    //       console.log(value)
		// 			return this.fps.getOutcomes(value);
		// 		})
		// 	)
		// 	.subscribe((res) => {
    //     console.log(res)
		// 		// this.updateChart(res);
		// 	});
    this.canvasId = 'canvas' + this.uuid; 
		this.fps.getOutcomes(this.type).subscribe(
			(res) => {
				this.updateChart(res);
			},
			(err) => {
				console.error(err);
			}
    );
	}
}

export interface OutcomeDTO {
	outcomeType: String;
	count: number;
	daysBeforeNow: number;
}
