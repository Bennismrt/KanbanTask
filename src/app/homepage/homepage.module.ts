import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomepageComponent } from './homepage.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { HomepageService } from './_service/homepage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { NewTaskDialog } from './dialog/new-task-dialog.component';

const routes: Routes = [
    {path: '', component: HomepageComponent}
];

@NgModule({
  declarations: [
    HomepageComponent,
    NewTaskDialog
  ],
  exports: [NewTaskDialog],
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    DragDropModule,
    MatDialogModule,
    RouterModule.forChild(routes),
  ],
  providers: [HomepageService],
  bootstrap: [HomepageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomepageModule { }
