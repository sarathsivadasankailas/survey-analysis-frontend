import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';

@Component({
  selector: 'app-learnings-dashboard',
  templateUrl: './learnings-dashboard.component.html',
  styleUrls: ['./learnings-dashboard.component.css']
})
export class LearningsDashboardComponent {
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

  learningMethodsData = {
    labels:this.labels,
    datasets: this.datasets
  }

  constructor(private backendSvc: BackendCommunicationService) {}


  ngOnInit() {
    this.loading = true;
    this.initializeData();
  }

  initializeData() {
    this.backendSvc.getLearningMethods().subscribe(response => {
        this.loading = false;
        console.log(response);
        this.semesters = response?.classes;
        this.learningMethodsData.labels = response?.labels;
        this.responseData = response?.responseData;
        this.drawLearningMethods();
      }
    );
  }

  drawLearningMethods() {
    this.chart = new Chart("learning_methods_graph", {
      type: "bar",
      data: this.learningMethodsData,
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
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
    //console.log('Selected Semesters', this.selectedsemesters);

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
    // Clearing the dataset
    this.learningMethodsData.datasets = [];
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
        data: this.getSemesterData(semesterDetails),
        backgroundColor: this.colors[i],
        barThickness: 20
      }

      this.learningMethodsData.datasets.push(graphData);
    }
  }

  getSemesterName(semesterDetails:any) {
    return `${semesterDetails?.semester}-${semesterDetails?.name}-${semesterDetails?.year}`;
  }

  getSemesterData(semesterDetails:any) {
    let graphData = [];
    let size = this.learningMethodsData.labels.length;
    for (let i = 0; i < size; i++) {
      graphData[i] = 0;
    }
    semesterDetails?.methods.forEach((method:any) => {
        let index = this.learningMethodsData.labels.indexOf(method.method);
        let scores = method?.scores;
        let totalScores = 0;
        for (let i=0; i< scores.length; i++) {
          totalScores  = totalScores + ((i+1)*scores[i]);
        }
        graphData[index] = totalScores;
      });
      return graphData;
  }

  downloadPDF() {
    const canvas = document.getElementById('learning_methods_graph') as HTMLCanvasElement;
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
    pdf.text('Learning Methods', 10, 20);
    pdf.addImage(canvasImage, 'JPEG', 10, 25, 270, 140);
    pdf.save('Learning Methods');

    // Setting color back to the normal background
    ctx.fillStyle = 'rgba(198, 226, 226, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
