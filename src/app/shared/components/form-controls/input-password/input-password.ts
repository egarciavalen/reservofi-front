import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-input-password',
  imports: [MatInputModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './input-password.html',
  styleUrl: './input-password.scss',
})
export class InputPassword {

    // Inputs
  @Input() label!: String;
  @Input() control!: FormControl;
  @Input() placeholder?: string;
  @Input() errorMessage?: string;

  hide: boolean;

  constructor() {
    this.hide = false;
  }

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
