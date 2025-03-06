import mongoose from 'mongoose';

const torahScroll = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    

  },
  { versionKey: false }
);

const place = new mongoose.Schema(
  {
    city: { type: String, required: true },
    street: { type: String, required: true },
  },
  { _id: false, versionKey: false }

);

const synagogueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    place: { type: place, required: true},
    torahScrolls: { type: [torahScroll], required: true },
  },
  { versionKey: false }
);

const Synagogue = mongoose.model('Synagogue', synagogueSchema);
export default Synagogue;
