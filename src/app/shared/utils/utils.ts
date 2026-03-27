import { AbstractControl, ValidationErrors } from '@angular/forms';

export function formatearRut(rut: string): string {
  rut = rut.replace(/\./g, '').replace('-', '');

  if (rut.length < 2) return rut;

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let cuerpoFormateado = '';
  let i = 0;

  for (let j = cuerpo.length - 1; j >= 0; j--) {
    cuerpoFormateado = cuerpo[j] + cuerpoFormateado;
    i++;
    if (i === 3 && j !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
      i = 0;
    }
  }

  return `${cuerpoFormateado}-${dv}`;
}

export function rutValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value) return null;

  const rut = value.replace(/\./g, '').replace('-', '');

  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);

  const dvFinal =
    dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvFinal ? null : { rutInvalido: true };
}

export function passwordsMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const repeat = control.get('repeatPassword')?.value;

  if (!password || !repeat) return null;

  return password === repeat ? null : { passwordsMismatch: true };
}
