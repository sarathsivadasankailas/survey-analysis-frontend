import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BackendCommunicationService } from 'src/app/services/backend-communication.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent {

  loggedIn: boolean = false;
  selectedOption: any; // Option selected to delete
  caption:any;
  response: any;
  loading: boolean = false;
  selectedViewItem: any;

  constructor(private backendSvc: BackendCommunicationService, public dialog: MatDialog) {}

  onLoginSuccess(event: any) {
    this.loggedIn = true;
  }

  onSelectOption(option: any) {
    this.selectedOption = option;
    this.selectedViewItem = undefined;
    this.response = undefined;
    if (this.selectedOption === 'techniques-adopted') {
      this.caption = 'Techniques Adopted';
    } else if (this.selectedOption === 'learning-methods') {
      this.caption = 'Learning Methods';
    }
  }

  onSearch() {
    this.selectedViewItem = undefined;
    this.response = undefined;
    if (this.selectedOption === null || this.selectedOption === undefined) {
      //alert('Choose an option');
      const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Please select an option to proceed.'}});
      dialogRef.afterClosed();
    } else if (this.selectedOption === 'techniques-adopted') {
      //this.caption = 'Techniques Adopted';
      this.loading = true;
      this.loadTechniquesAdopted();
    } else if (this.selectedOption === 'learning-methods') {
      //this.caption = 'Learning Methods';
      this.loading = true;
      this.loadLearningMethods();
    } else {
      //alert('Choose an option');
      const dialogRef = this.dialog.open(MessageDialogComponent);
      dialogRef.afterClosed();
    }
  }

  loadTechniquesAdopted() {
    this.backendSvc.getTechniquesAdopted().subscribe((response:any) => {
      this.response = response?.responseData;
      this.loading = false;
    });
  }

  loadLearningMethods() {
    this.backendSvc.getLearningMethods().subscribe((response:any) => {
      this.response = response?.responseData;
      this.loading = false;
    });
  }

  onDelete(id:any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed the action
        console.log('User confirmed the action');
        this.deleteItem(id);
        this.selectedViewItem = undefined;
      } else {
        // User canceled the action
        console.log('User canceled the action');
      }
    });
  }

  deleteItem(id:any) {
    console.log('Deleting item ', this.selectedOption, id);
    if (this.selectedOption == 'techniques-adopted') {
      this.backendSvc.deleteTechniquesAdopted(id).subscribe((response:any) => {
        if (response !== null && response?.msg !== null && response?.msg === 'Record deleted') {
          this.loadTechniquesAdopted();
        } else {
          const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Failed to delete item.'}});
          dialogRef.afterClosed();
        }
      })
    } else if (this.selectedOption == 'learning-methods') {
      this.backendSvc.deleteLearningsMethod(id).subscribe((response:any) => {
        if (response !== null && response?.msg !== null && response?.msg === 'Record deleted') {
          this.loadLearningMethods();
        } else {
          const dialogRef = this.dialog.open(MessageDialogComponent, {data: {message: 'Failed to delete item.'}});
          dialogRef.afterClosed();
        }
      });
    } else {

    }
  }

  onView(id:any) {
    let item = this.response.filter((data:any) => data._id === id);
    if (item !== null && item !== undefined && item.length > 0) {
      this.selectedViewItem = item[0];
    }
    console.log(this.selectedViewItem);
  }
}

