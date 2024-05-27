import { Schema } from 'mongoose';

export function setVirtuals(schema: Schema) {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    },
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    },
  });
}
