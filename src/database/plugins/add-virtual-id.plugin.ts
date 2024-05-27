import { Schema } from 'mongoose';

export function addVirtualId(schema: Schema) {
  schema.virtual('id').get(function () {
    return this._id;
  });
}
