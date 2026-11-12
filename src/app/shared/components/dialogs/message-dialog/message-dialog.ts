import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})
export class MessageDialog {

  // El propósito de este componente es tener un diálogo reutilizable para mostrar mensajes al usuario cuando hace alguna acción

  // Del componente correspondiente se inyecta el mensaje
  readonly data = inject<string>(MAT_DIALOG_DATA);

}
