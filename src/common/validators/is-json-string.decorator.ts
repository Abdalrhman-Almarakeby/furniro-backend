import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  validateSync,
} from 'class-validator';

export function IsJsonString(
  dto: Function,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [dto],
      validator: {
        validate(text: string, args: ValidationArguments) {
          const [DtoClass] = args.constraints;

          try {
            const parsed = JSON.parse(JSON.parse(text));
            const object = plainToInstance(DtoClass, parsed);
            const errors = validateSync(object);

            if (errors.length > 0) {
              args.constraints[1] = errors
                .map((err) => Object.values(err.constraints || {}).join(', '))
                .join('; ');
              return false;
            }

            return true;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return args.constraints[1] || 'Invalid JSON string or structure!';
        },
      },
    });
  };
}
