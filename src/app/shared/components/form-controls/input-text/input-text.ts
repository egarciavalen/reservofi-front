import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-input-text',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './input-text.html',
  styleUrl: './input-text.scss',
})

export class InputText {

    // Inputs
  @Input() label!: String;
  @Input() control!: FormControl;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() errorMessage?: string;

  constructor() {}

  get errorMessageToShow(): string | null {

    if (this.control.hasError('required')) {
      return this.label + ' es obligatorio';
    }

    if (this.control.hasError('minlength')) {
      const required = this.control.getError('minlength')?.requiredLength;
      return this.label + ` ha de tener ${required} caracteres como mínimo`;
    }

    if (this.control.hasError('maxlength')) {
      const required = this.control.getError('maxlength')?.requiredLength;
      return this.label + ` ha de tener ${required} caracteres como máximo`;
    } 
    return null;
  }


}
