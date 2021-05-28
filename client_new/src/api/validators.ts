import type {Validator} from "./validator";
import {joinValidators} from "./validator";


const prequisite: Validator = (value: any) =>
    (value === undefined || value === null) ? 'Ce champ comporte un bug' : null;

export const requiredValidator: Validator = joinValidators([
    prequisite,
    (value: any) => (value === '') ? 'Ce champ est requis' : null,
]);

export const maximumLengthValidatorBuilder = (len: number): Validator => joinValidators([
    prequisite,
    (value: any) => (value.toString().length > len) ? `Ce champ doit faire au maximum ${len} caractères` : null,
]);

const numbersOnlyRegex = new RegExp('^\\d+$');
export const numbersOnlyValidator: Validator = joinValidators([
    prequisite,
    (value: any) => (numbersOnlyRegex.test(value)) ? null : 'Ce champ comporte autre chose que des chiffres sans espaces',
]);
