import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidDimension(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidDimension',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          if (value.endsWith('m') || value.endsWith('cm')) {
            const isMeter = value.endsWith('m');
            const num = parseFloat(value.slice(0, isMeter ? -1 : -2));
            return !isNaN(num) && num > 0;
          }
          return false;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is invalid dimension. It should be a positive number followed by "m" or "cm".'`;
        },
      },
    });
  };
}
