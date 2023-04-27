import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appClick]'
})
export class ClickDirective {

  constructor() { }

  @HostListener('contextmenu', ['$event'])
    onRightClick(event) {
    event.preventDefault();
  }

}
