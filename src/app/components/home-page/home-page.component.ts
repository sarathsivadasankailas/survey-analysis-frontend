import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  constructor(private backendSvc: BackendCommunicationService, public dialog: MatDialog) {}

  fileName: string = '';
  message: string = '';
  success: boolean = false;
  error: boolean = false;
  learningMethodsReq: any;
  techniquesAdoptedReq: any;
  enableUpload: boolean = false;
  uploadText: string = '';
  disableUpload: boolean = false;
  uploading: boolean = false;

  ngOnInit() {
    let height = window.innerHeight;
    let headerElement = document.getElementById('header');
    if (headerElement) {
      height -= headerElement.clientHeight;
    }
    let element = document.getElementById('home');
    if (element) {
      element.style.height = height + 'px';
    }
  }

  onDownloadTechnologiesAdopted() {
    window.open('../../../assets/templates/TechnologiesAdopted.xlsx')
  }

  onDownloadLearningMethods() {
    window.open('../../../assets/templates/LearningMethods.xlsx')
  }

  reset() {
    this.success = false;
    this.error = false;
    this.message = '';
    this.learningMethodsReq = undefined;
    this.enableUpload = false;
    this.uploadText = '';
    this.disableUpload = false;
    this.uploading = false;
  }

  onFileSelect(event: any) {
    this.reset();
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length === 0) {
      this.fileName = "No file Selected";
    }
    if (target.files.length > 1)  {
      this.message = "Cannot select multiple files";
      this.error = true;
      alert(this.message);
      return;
    }
    const file = target.files[0];
    this.fileName = file.name;
    const fileExtension = this.fileName.slice((this.fileName.lastIndexOf('.') - 1 >>> 0) + 2);
    if (fileExtension !== 'xlsx') {
      this.message = 'Selected file is not an xlsx. Please select a valid xlsx file.';
      this.error = true;

      const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: this.message, type: 'error-msg'}});
      dialogRef.afterClosed();
      return;
    }
    this.readFile(file);
  }

  readFile(file: any) {
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: WorkBook = read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      if (wsname === 'LearningMethods') {
        this.readLearningMethods(wb);
      } else if (wsname === 'TechnologiesAdopted') {
        this.readTechnologiesAdopted(wb);
      } else {
        this.message = 'Invalid xlsx file. Cannot find worksheets with names LearningMethods or TechnologiesAdopted.';
        this.error = true;
        const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: this.message, type: 'error-msg'}});
        dialogRef.afterClosed();
        return;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  readTechnologiesAdopted(wb: any) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    let name = ws['A3'] ? ws['A3'].v : undefined;
    let semester = ws['B3'] ? ws['B3'].v : undefined;
    let year = ws['C3'] ? ws['C3'].v : undefined;

    let techniques: any = [];

    console.log(ws);
    let str = ws['!ref'];
    if (str !== null && str !== undefined) {
      const range = utils.decode_range(str);
      for (let rowNum = 3; rowNum <= range.e.r; rowNum++) {
        // Read learning method Column E
        const techniquesAdoptedCellAddr = { c: 4, r: rowNum };
        const techniquesAdoptedRef = utils.encode_cell(techniquesAdoptedCellAddr);
        const techniquesAdopted = ws[techniquesAdoptedRef] ? ws[techniquesAdoptedRef].v : '';

        const countsCellAddr = { c: 5, r: rowNum };
        const counntsCellRef = utils.encode_cell(countsCellAddr);
        const counts = ws[counntsCellRef] ? ws[counntsCellRef].v : '';

        techniques.push({technique: techniquesAdopted, counts: counts});
      }
      this.techniquesAdoptedReq = {
        name: name,
        semester: semester,
        year: year,
        techniques: techniques
      }
      this.uploadText = 'Upload Technologies Adopted';
      this.enableUpload = true;
    }
  }

  readLearningMethods(wb: any) {
    const wsname: string = wb.SheetNames[0];
    const ws: WorkSheet = wb.Sheets[wsname];

    let name = ws['A3'] ? ws['A3'].v : undefined;
    let semester = ws['B3'] ? ws['B3'].v : undefined;
    let year = ws['C3'] ? ws['C3'].v : undefined;

    let methods: any = [];

    console.log(ws);
    let str = ws['!ref'];
    if (str !== null && str !== undefined) {
      const range = utils.decode_range(str);
      for (let rowNum = 3; rowNum <= range.e.r; rowNum++) {
        // Read learning method Column E
        const learningMethodsCellAddr = { c: 4, r: rowNum };
        const learningMethodsRef = utils.encode_cell(learningMethodsCellAddr);
        const learningMethod = ws[learningMethodsRef] ? ws[learningMethodsRef].v : '';

        let scores: any = [];
        // Read Ratings
        for (let colNum = 5; colNum <=9; colNum++ ) {
          const ratingCellAddr = { c: colNum, r: rowNum };
          const ratingCellRef = utils.encode_cell(ratingCellAddr);
          const rating = ws[ratingCellRef] ? ws[ratingCellRef].v : '';
          scores.push(rating);
        }
        methods.push({method : learningMethod, scores: scores});
      }
      this.learningMethodsReq = {
        name: name,
        semester: semester,
        year: year,
        methods: methods
      }
      this.uploadText = 'Upload Learning Methods';
      this.enableUpload = true;
    } else {
      this.message = "Some error happened while parsing the xlsx. Please try to load again";
      this.error = true;
    }
  }

  uploadFile() {
    if (this.uploadText === 'Upload Learning Methods') {
      this.uploadLearningMethods();
    } else if (this.uploadText === 'Upload Technologies Adopted') {
      this.uploadTechniquesAdopted();
    }
  }

  uploadLearningMethods() {
    this.uploadText = "Uploading Data...";
    this.disableUpload = true;
    if (this.learningMethodsReq !== null && this.learningMethodsReq !== undefined) {
      this.uploading = true;
      this.backendSvc.createLearningMethods(this.learningMethodsReq).subscribe((response:any) => {
        if (response?._id !== null) {
          this.reset();
          const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Successfully Uploaded the data.', type: 'success-msg'}});
          dialogRef.afterClosed();
        }
      }, (error: any) => {
        this.reset();
        const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Error while uploading data. Please validate the file and upload again.', type: 'error-msg'}});
        dialogRef.afterClosed();
      });
    }
  }

  uploadTechniquesAdopted() {
    this.uploadText = "Uploading Data...";
    this.disableUpload = true;
    if (this.techniquesAdoptedReq !== null && this.techniquesAdoptedReq !== undefined) {
      this.uploading = true;
      this.backendSvc.createTechniquesAdopted(this.techniquesAdoptedReq).subscribe((response:any) => {
        if (response?._id !== null) {
          this.reset();
          const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Successfully Uploaded the data.', type: 'success-msg'}});
          dialogRef.afterClosed();
        }
      }, (error: any) => {
        this.reset();
        const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Error while uploading data. Please validate the file and upload again.', type: 'error-msg'}});
        dialogRef.afterClosed();
      });
    }
  }
}
