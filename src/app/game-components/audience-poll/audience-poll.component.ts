import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-audience-poll',
  templateUrl: './audience-poll.component.html',
  styleUrls: ['./audience-poll.component.css']
})
export class AudiencePollComponent implements OnInit {
private barchartDataArray: Array<number>;
message: string;

  constructor(private dataService: DataService) {
    this.barchartDataArray = [];
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Don\'t Know'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any;

  public chartOptions = {
    legend: {
        labels: {
            fontColor: 'goldenrod',
            fontSize: 36
        }
    },
    responsive: true,
    scales: {
        yAxes: [{
            ticks: {
                fontColor: 'black',
                fontSize: 18,
                beginAtZero: true
            }
        }],
        xAxes: [{
          gridLines: {
            color: 'rgba(0, 0, 0, 0)'
          },
            ticks: {
                fontColor: 'black',
                fontSize: 14,
                beginAtZero: true
            }
        }]
    }
};

randomInteger(min: number, max: number) {
  console.log(this.message);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

  ngOnInit(): void {
    this.dataService.currentMessage.subscribe(message => this.message = message);
    this.prepareChartArray();
    this.prepareChart();
  }
  prepareChartArray() {
    if (this.message && this.message !== 'default message') {
      this.barchartDataArray = JSON.parse('[' + this.message + ']');
    }
    else {
      for (let index = 0; index < 5; index++) {
        this.barchartDataArray.push(this.randomInteger(8, 100));
      }
    }
  }


  private prepareChart() {
    this.barChartData = [
      {
        label: 'Audience Poll',
        data: this.barchartDataArray,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 210, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ];
  }
}
