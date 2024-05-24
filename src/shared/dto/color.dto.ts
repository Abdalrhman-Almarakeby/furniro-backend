import { IsString, Length, Matches } from 'class-validator';

export class Color {
  @IsString()
  @Length(7, 7)
  @Matches(/^#([0-9a-fA-F]{6})$/, {
    message: 'hexCode must be a valid hex color code',
  })
  hexCode: string;

  @IsString()
  name: string;
}
