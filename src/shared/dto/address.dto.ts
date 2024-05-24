import { IsString, Matches } from 'class-validator';

export class Address {
  @IsString()
  addressName: string;

  @IsString()
  addressUserName: string;

  @IsString()
  @Matches('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$')
  addressPhoneNumber: string;

  @IsString()
  address: string;
}
