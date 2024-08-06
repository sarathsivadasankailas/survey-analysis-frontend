import { Injectable } from '@angular/core';
import { BackendCommunicationService } from './backend-communication.service';

@Injectable({
  providedIn: 'root'
})
export class DataProcessorService {

  learningMethods: any;

  constructor() { }

  getLearningMethods(data: any) {
    let classes: any[] = [];
    let learningMethodLabels: any[] = [];
    data.forEach((semester:any) => {
      let semesterName = {
        name: semester?.name,
        year: semester?.year,
        semester: semester?.semester,
        id: semester?._id
      }
      classes.push(semesterName);
      let methods = semester?.methods;
      if (methods) {
        methods.forEach((method:any) => {
          let methodName = method?.method;
          if (!learningMethodLabels.includes(methodName)) {
            learningMethodLabels.push(methodName);
          }
        })
      }
    });

    let response = {
      classes: classes,
      labels: learningMethodLabels,
      responseData: data
    }

    return response;
  }

  getTechniquesAdopted(data: any) {
    let classes: any[] = [];
    let techiniquesLabel: any[] = [];

    data.forEach((semester:any) => {
      let semesterName = {
        name: semester?.name,
        year: semester?.year,
        semester: semester?.semester,
        id: semester?._id
      }
      classes.push(semesterName);
      let techniques = semester?.techniques;
      if (techniques) {
        techniques.forEach((technique:any) => {
          let techniqueName = technique?.technique;
          if (!techiniquesLabel.includes(techniqueName)) {
            techiniquesLabel.push(techniqueName);
          }
        })
      }
    });

    let response = {
      classes: classes,
      labels: techiniquesLabel,
      responseData: data
    }

    return response;
  }
}
