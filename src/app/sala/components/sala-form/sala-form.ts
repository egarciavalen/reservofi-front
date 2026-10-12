import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-sala-form',
  imports: [],
  templateUrl: './sala-form.html',
  styleUrl: './sala-form.scss',
})
export class SalaForm {

  private readonly http = inject(HttpClient);
  fileName = "";

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file:File | undefined= input.files?.[0];
    
    if (file) {
      this.fileName = file.name;
      console.log(file);

    }

  }
}
