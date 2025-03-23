import mongoose from 'mongoose';

const donorForSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: false },
  },
  { _id: false , versionKey: false}
);

const torahScrollSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, minlength: 2 },
    donorFor: { type: [donorForSchema], required: true },
    image: { type: String, required: true },
  },
  { versionKey: false }
);

const timeSchema = new mongoose.Schema(
  {
    month: { type: String, required: false },
    week: { type: String, required: false },
  },
  { _id: false, versionKey: false }
);

// Custom validation: At least one field must be present
timeSchema.path('month').validate(function () {
  return this.month || this.week;
}, 'At least one of "month" or "week" is required.');

timeSchema.path('week').validate(function () {
  return this.month || this.week;
}, 'At least one of "month" or "week" is required.');


const synagogueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    time: { type: timeSchema, required: false },
    torahScrolls: { 
      type: [torahScrollSchema],
      required: true ,
      validate: {
        validator: array => array.length >= 2,
        message: 'At least two Torah scrolls are required.'
      }
    },
    image: { type: String, required: false },
  },
  { versionKey: false }
);

const Synagogue = mongoose.model('Synagogue', synagogueSchema);
export default Synagogue;
