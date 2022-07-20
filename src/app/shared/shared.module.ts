import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, MatIconModule, MatButtonModule,MatFormFieldModule,MatSelectModule,MatInputModule,MatDatepickerModule,MatNativeDateModule
  ],
  exports: [
    MatIconModule, MatButtonModule, MatFormFieldModule,MatSelectModule,MatInputModule,MatDatepickerModule,MatNativeDateModule
  ]
})
export class SharedModule { }
