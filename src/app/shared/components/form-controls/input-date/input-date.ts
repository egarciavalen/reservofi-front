import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-input-date',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './input-date.html',
  styleUrl: './input-date.scss',
})
export class InputDate {

  // Inputs
  @Input() label!: String;
  @Input() control!: FormControl;
  @Input() placeholder?: string;
  @Input() errorMessage?: string;

    get errorMessageToShow(): string | null {

    if (this.control.hasError('required')) {
      return this.label + ' es obligatorio';
    }

    return null;
  }
}
