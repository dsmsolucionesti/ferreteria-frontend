import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clp',
})
export class ClpPipe implements PipeTransform {
  transform(value: any): string {
    if (value == null) return '';

    if (typeof value === 'string') {
      value = Number(value);
    }

    return '$' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
