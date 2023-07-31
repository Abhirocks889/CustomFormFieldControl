import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CustomFormControl';

  passportInfoForm = new UntypedFormGroup({
    expiryDate: new UntypedFormControl(null, {
      updateOn: 'blur'
    })
  });

  get expiryControl(): FormControl {
    return this.passportInfoForm.controls['expiryDate'] as FormControl;
  }
}
