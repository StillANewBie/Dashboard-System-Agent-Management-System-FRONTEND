import { Component, OnInit } from '@angular/core';
import { FrontPageService } from '../../../services/front-page.service';
import { Chart } from 'chart.js';
import { DisplayGrid } from 'angular-gridster2';
import { Subject, Observable } from 'rxjs';
import Rx from 'rxjs';
import { switchMap } from 'rxjs/operators';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
	selector: 'app-outcome',
	templateUrl: './outcome.component.html',
	styleUrls: [ './outcome.component.scss' ]
})
export class OutcomeComponent implements OnInit {
	chart: any;
	data: OutcomeDTO[];
	days: number = 7;
	getRequest;

	constructor(private fps: FrontPageService) {
		this.fps.getOutcomes(this.days).subscribe(
			(res) => {
				this.updateChart(res);
			},
			(err) => {
				console.error(err);
			}
    );
	}

	updateChart(res) {
		this.data = res;
		// if (Array.isArray(this.data)) {
			this.chart = new Chart('canvas-avg', {
				type: 'doughnut',
				data: {
					labels: this.data.map((el) => el.outcomeType),
					datasets: [
						{
							data: this.data.map((el) => el.count),
							backgroundColor: this.data.map((el) => {
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
							hoverBorderColor: this.data.map((el) => {
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
						position: 'right'
          },
          title: {
            display: true,
            text: 'Call Outcomes',
            position: 'top',
            padding: 20
            
          },
					tooltips: {
						enabled: true
					},
					layout: {
						padding: {
							left: 20,
							right: 10,
							top: 10,
							bottom: 10
						}
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
        plugins: [ChartDataLabels]
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
	}
}

export interface OutcomeDTO {
	outcomeType: String;
	count: number;
	daysBeforeNow: number;
}
