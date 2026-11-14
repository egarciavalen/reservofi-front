import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-input-date',
  imports: [ReactiveFormsModule, MatInputModule, MatDatepickerModule],
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
