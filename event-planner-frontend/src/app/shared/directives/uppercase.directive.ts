import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (this.control.control) {
      const input = event.target as HTMLInputElement;
      this.control.control.setValue(input.value.toUpperCase());
    }
  }
}