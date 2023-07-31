import {
  FocusMonitor,
} from '@angular/cdk/a11y';
import {
  coerceBooleanProperty,
} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  MatLegacyFormFieldControl as MatFormFieldControl,
} from '@angular/material/legacy-form-field';
import {
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import {
  DoubleInputsModel,
  DoubleInputsPlaceholderModel,
} from './double-input-form.model';
import {
  O3rComponent,
} from '@o3r/core';

/** This decorator causes an issue where this custom form field control is
 *  not recognized by the MatFormField class. Check the console for errors
 */
@O3rComponent({
  componentType: 'Component'
})
@Component({
  selector: 'double-input-form',
  templateUrl: './double-input-form.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: MatFormFieldControl,
    useExisting: DoubleInputFormComponent
  }]
})
export class DoubleInputFormComponent implements ControlValueAccessor, MatFormFieldControl<DoubleInputsModel>, OnInit, OnChanges, OnDestroy {
  @ViewChild('first', {static: false})
  protected first!: ElementRef;

  /**
   * Subscriptions
   */
  public subscriptions: Subscription[] = [];

  /**
   * @inheritdoc
   */
  @Input()
  public id: string;

  /**
   * @inheritDoc
   */
  @Input()
  public firstMaxLength = 2;

  /**
   * @inheritDoc
   */
  @Input()
  public lastMaxLength = 2;

  /**
   * @inheritDoc
   */
  @Input()
  public placeholders?: DoubleInputsPlaceholderModel;

  /**
   * @inheritDoc
   */
  @Input()
  public required = false;

  /**
   * @inheritdoc
   */
  @Input()
  public disabled = false;

  /**
   * @inheritdoc
   */
  @Input()
  public value: any;

  /**
   * @inheritdoc
   */
  @Input()
  public placeholder = '';

  /**
   * @inheritdoc
   */
  @Input()
  public submitTrigger$?: Observable<boolean>;

  /**
   * @inheritdoc
   */
  @Input()
  public focusOnSubmit?: boolean = false;

  /**
   * @inheritdoc
   */
  @Input()
  public disableForm = false;

  /**
   * Inputs parts definition
   */
  public parts: UntypedFormGroup;

  /**
   * State
   */
  public stateChanges: Subject<void> = new Subject();

  /**
   * Focus state
   */
  public focused = false;

  /**
   * Type of the control
   */
  public controlType = 'double-input-form';

  /**
   * @inheritDoc
   */
  public get errorState(): boolean {
    return !!this.ngControl.control && !!this.ngControl.touched && this.ngControl.control.invalid;
  }

  /**
   * @inheritDoc
   */
  public get empty(): boolean {
    const {
      value: {first, last}
    } = this.parts;
    return !first && !last;
  }

  /**
   * @inheritDoc
   */
  @HostBinding('class.floating')
  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  /**
   * @inheritDoc
   */
  @HostBinding('attr.aria-describedby')
  public describedBy = '';

  constructor(
    protected _focusMonitor: FocusMonitor,
    protected _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.parts = new UntypedFormGroup({
      first: new UntypedFormControl(''),
      last: new UntypedFormControl('')
    });
    this.id = 'double-input-form-' + crypto.randomUUID();
    this.subscriptions.push(
      _focusMonitor.monitor(_elementRef, true).subscribe((origin) => {
        if (this.focused && !origin) {
          this.onTouched();
        }
        this.focused = !!origin;
        this.stateChanges.next();
      })
    );
  }

  /**
   * Form submit logic
   */
  protected submitAction() {
    this.parts.updateValueAndValidity();
    if (this.focusOnSubmit || this.ngControl?.control?.invalid) {
      this.first.nativeElement.focus();
    }
  }

  public ngOnInit() {
    if (this.submitTrigger$) {
      this.subscriptions.push(
        this.submitTrigger$.subscribe(() => {
          this.submitAction();
        })
      );
    }
  }

  /**
   * @inheritdoc
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (_: any) => {};

  /**
   * @inheritdoc
   */
  public onTouched = () => {};

  /**
   * @inheritdoc
   */
  public ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * @inheritdoc
   */
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['required']) {
      this.required = coerceBooleanProperty(changes['required'].currentValue);
      this.stateChanges.next();
    }

    if (changes['placeholder']) {
      this.required = coerceBooleanProperty(changes['placeholder'].currentValue);
      this.stateChanges.next();
    }

    if (changes['value']) {
      const {first, last} = changes['value'].currentValue || new DoubleInputsModel('', '');
      this.parts.setValue({first, last});
      this.stateChanges.next();
    }

    if (changes['disableForm']) {
      if (this.disabled) {
        this.parts.controls['first'].disable();
        this.parts.controls['last'].disable();
      } else {
        this.parts.controls['first'].enable();
        this.parts.controls['last'].enable();
      }
    }
  }

  /**
   * @inheritdoc
   */
  public setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  /**
   * @inheritdoc
   */
  public onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  /**
   * @inheritdoc
   */
  public writeValue(inputs: any): void {
    inputs = (inputs?.first && inputs?.last) ? inputs : this.value || new DoubleInputsModel();
    this.parts.setValue(inputs);
  }

  /**
   * @inheritdoc
   */
  public registerOnChange(fn: (inputs: DoubleInputsModel | null) => void): void {
    this.subscriptions.push(this.parts.valueChanges.subscribe(fn));
  }

  /**
   * @inheritdoc
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * @inheritdoc
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * @inheritdoc
   */
  public _handleInput(): void {
    this.onChange(this.parts.value);
  }
}
