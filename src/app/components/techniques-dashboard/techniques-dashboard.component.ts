import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import jsPDF from 'jspdf';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';

@Component({
  selector: 'app-techniques-dashboard',
  templateUrl: './techniques-dashboard.component.html',
  styleUrls: ['./techniques-dashboard.component.css']
})
export class TechniquesDashboardComponent {
  chart: any;
  semesters: any;
  selectedsemesters: any[] = [];
  labels: string[] = [];
  //data: any[] = [];
  responseData: any;
  loading: boolean = false;

  datasets: any[] = [];

  colors:any = [
    "rgba(54, 162, 235, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(75, 192, 75, 0.7)",
    "rgba(33, 102, 172, 0.7)",
    "rgba(200, 200, 200, 0.7)",
    "rgba(255, 105, 180, 0.7)",
    "rgba(34, 139, 34, 0.7)",
    "rgba(255, 215, 0, 0.7)",
    "rgba(255, 127, 80, 0.7)",
    "rgba(135, 206, 235, 0.7)",
    "rgba(255, 0, 255, 0.7)",
    "rgba(128, 128, 0, 0.7)",
    "rgba(165, 42, 42, 0.7)",
    "rgba(220, 20, 60, 0.7)",
    "rgba(144, 238, 144, 0.7)",
    "rgba(0, 255, 255, 0.7)"
  ]

  techniquesAdoptedData = {
    labels:this.labels,
    datasets: this.datasets
  }

  constructor(private backendSvc: BackendCommunicationService) {}

  ngOnInit() {
    this.loading = true;
    this.initializeData();
  }

  initializeData() {
    this.backendSvc.getTechniquesAdopted().subscribe(response => {
        this.loading = false;
        console.log(response);
        this.semesters = response?.classes;
        this.techniquesAdoptedData.labels = response?.labels;
        this.responseData = response?.responseData;
        this.drawLearningMethods();
      }
    );
  }

  drawLearningMethods() {
    this.chart = new Chart("techniques_adopted_graph", {
      type: "bar",
      data: this.techniquesAdoptedData,
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              font: {
                size: 14  // Increase font size
              },
              callback: (value, index, values) => {
                console.log(value, index, values)
                return `${value}%`;
              }
            }
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                  size: 14  // Increase font size
              }
            }
          }
        }
      }
    });
  }

  onSelectionChange(semester:any) {
    console.log('Click', semester)
    if (this.selectedsemesters.includes(semester)) {
      this.selectedsemesters = this.selectedsemesters.filter(item => item != semester);
    } else {
      this.selectedsemesters.push(semester);
    }

    this.updateGraphData();
    this.chart.update();
  }

  isSelected(semester:any) {
    if (this.selectedsemesters.includes(semester)) {
      return true;
    } else {
      return false;
    }
  }

  updateGraphData() {
    this.techniquesAdoptedData.datasets = [];
    let totalSum = this.getTotalSum();
    for (let i = 0; i < this.semesters.length; i++) {
      let semester = this.semesters[i];
      if (!this.selectedsemesters.includes(semester)) {
        continue;
      }
      console.log('Processing data for ', semester, this.responseData);
      let semesterDetails = this.responseData.find((item:any) => semester.id === item._id);
      console.log('Semester Details', semesterDetails);
      let graphData = {
        label: this.getSemesterName(semesterDetails),
        data: this.getSemesterData(semesterDetails, totalSum),
        backgroundColor: this.colors[i],
        barThickness: 20
      }
      this.techniquesAdoptedData.datasets.push(graphData);
    }
  }

  getTotalSum() {
    let sum = 0;
    for (let i = 0; i < this.semesters.length; i++) {
      let semester = this.semesters[i];
      if (!this.selectedsemesters.includes(semester)) {
        continue;
      }
      let semesterDetails = this.responseData.find((item:any) => semester.id === item._id);
      semesterDetails?.techniques.forEach((technique:any) => {
        let count = technique?.counts;
        sum += count;
      });
    }
    return sum;
  }

  getSemesterName(semesterDetails:any) {
    return `${semesterDetails?.semester}-${semesterDetails?.name}-${semesterDetails?.year}`;
  }

  getSemesterData(semesterDetails:any, totalSum:any) {
    let graphData:any = [];
    let graphDataPercentage:any = [];
    let size = this.techniquesAdoptedData.labels.length;
    for (let i = 0; i < size; i++) {
      graphData[i] = 0;
      graphDataPercentage[i] = 0;
    }
    semesterDetails?.techniques.forEach((technique:any) => {
      let index = this.techniquesAdoptedData.labels.indexOf(technique?.technique);
      let count = technique?.counts;
      graphData[index] = count;
    });
    for(let i = 0; i < graphData.length; i++) {
      graphDataPercentage[i] = ((graphData[i]/totalSum) * 100).toFixed(2);
    }
    return graphDataPercentage;
  }

  downloadPDF() {
    const canvas = document.getElementById('techniques_adopted_graph') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // Save the current state
    ctx.save();
    // Set the canvas background color to white
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const canvasImage = canvas.toDataURL('image/jpeg', 1.0);
    ctx.restore();

    const pdf = new jsPDF('landscape');
    pdf.setFontSize(16);
    pdf.text('Techniques Adopted', 10, 20);
    pdf.addImage(canvasImage, 'JPEG', 10, 25, 270, 140);
    pdf.save('Techniques Adopted');

    // Setting color back to the normal background
    ctx.fillStyle = 'rgba(198, 226, 226, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

