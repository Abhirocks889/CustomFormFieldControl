import {
  CommonModule,
} from '@angular/common';
import {
  NgModule,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DoubleInputFormComponent,
} from './double-input-form.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [DoubleInputFormComponent],
  exports: [DoubleInputFormComponent]
})
export class DoubleInputFormModule {}
