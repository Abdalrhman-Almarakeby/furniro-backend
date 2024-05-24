import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidWeight(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidWeight',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          if (value.endsWith('kg') || value.endsWith('g')) {
            const isKg = value.endsWith('kg');
            const num = parseFloat(value.slice(0, isKg ? -2 : -1));
            return !isNaN(num) && num > 0;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is invalid weight. It should be a positive number followed by "kg" or "g".`;
        },
      },
    });
  };
}
