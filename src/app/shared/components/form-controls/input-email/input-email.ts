import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-input-email',
  imports: [MatFormFieldModule, ReactiveFormsModule ],
  templateUrl: './input-email.html',
  styleUrl: './input-email.scss',
})
export class InputEmail {

    // Inputs
  @Input() label!: String;
  @Input() control!: FormControl;
  @Input() placeholder?: string;
  @Input() errorMessage?: string;

  get errorMessageToShow(): string | null {

    if (this.control.hasError('required')) {
      return this.label + ' es obligatorio';
    }

    if (this.control.hasError('email')) {
      return this.label + ' no es un formato de email válido';
    }
    
    return null;
  }
}
