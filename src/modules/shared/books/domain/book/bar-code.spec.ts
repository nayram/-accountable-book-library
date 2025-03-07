import { FieldValidationError } from '@modules/shared/core/domain/field-validation-error';

import { createBarcode } from './bar-code'; // Assuming barcode.ts is the file

describe('createBarcode', () => {
  it('should return a string when a valid barcode is provided', () => {
    const barcodeValue = '123456789012';
    const barcode = createBarcode(barcodeValue);
    expect(barcode).toBe(barcodeValue);
  });

  it('should throw a FieldValidationError when the barcode is shorter than 12 characters', () => {
    const invalidBarcodeValue = '12345678901'; // 11 characters
    expect(() => createBarcode(invalidBarcodeValue)).toThrow(FieldValidationError);
    expect(() => createBarcode(invalidBarcodeValue)).toThrow(`${invalidBarcodeValue} is not a valid barcode`);
  });

  it('should trim whitespace from teh barcode value', () => {
    const barcodeValueWithWhitespace = '  123456789012  ';
    const barcode = createBarcode(barcodeValueWithWhitespace);
    expect(barcode).toBe('123456789012');
  });

  it('should return the same barcode that was passed in, even if over 12. ', () => {
    const barcodeValue = '1234567890123456';
    const barcode = createBarcode(barcodeValue);
    expect(barcode).toBe(barcodeValue);
  });
});
