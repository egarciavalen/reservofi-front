import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatTimepickerModule} from '@angular/material/timepicker';
@Component({
  selector: 'app-input-date-time',
  imports: [ReactiveFormsModule, MatInputModule, MatTimepickerModule],
  templateUrl: './input-date-time.html',
  styleUrl: './input-date-time.scss',
})
export class InputDateTime {

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
