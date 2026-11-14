import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';

@Component({
  selector: 'app-choose-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './choose-dialog.html',
  styleUrl: './choose-dialog.scss',
})
export class ChooseDialog {

  // Del componente correspondiente se inyecta el mensaje
    readonly data = inject<string>(MAT_DIALOG_DATA);

}
