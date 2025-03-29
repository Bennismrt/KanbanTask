import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Developer, MockData } from '../_model/homepage.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task-dialog.component.html'
})
export class NewTaskDialog implements OnInit {
  newTaskKanban = {
    id : '',
    name: '',
    developer: [] as Developer[],
    actualSP : 0,
    date: '',
    estimatedSP: 0,
    isChecked: false,
    priority: '',
    status: '',
    task: '',
    type: ''
  } as MockData;
  isOpenDevNewTaskKanban: boolean = false;
  constructor(
    private dialogRef                     : MatDialogRef<NewTaskDialog>,
    @Inject(MAT_DIALOG_DATA) public data  : any,
  ) {}

  ngOnInit() {
    if (this.data.newTaskKanban !== null) {
      this.newTaskKanban = {
        ...this.data.newTaskKanban,
        developer: [...this.data.newTaskKanban.developer]
      };
    }
  }

  close() {
    this.dialogRef.close();
  }

  getListExistingDeveloper(item: MockData){
    const filteredDevelopers = this.data.listDeveloper.filter((dev: { name: string; }) => 
        !item.developer?.some(existing => existing.name === dev.name)
    );
    return filteredDevelopers;
  }

  setNewTaskDeveloper(dev: Developer){
    this.newTaskKanban.developer.push(dev);
  }
  
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    return moment(event.value).format('DD MMMM, YYYY')
  }

  addNewTaskKanban(){
    const payload = {...this.newTaskKanban, date: this.newTaskKanban.date == '' ? moment().format('DD MMMM, YYYY') : this.newTaskKanban.date, status: this.newTaskKanban.status === '' ? this.data.optionsStatus[0].value : this.newTaskKanban.status, id: this.newTaskKanban.id === '' ? crypto.randomUUID(): this.newTaskKanban.id}
    this.dialogRef.close(payload);
  }

  
  deleteDeveloper(image: Developer){
    this.newTaskKanban.developer = this.newTaskKanban.developer.filter((res) => res.id !== image.id);
  }


}
