const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  deleted: { type: Boolean, default: false },
  startPoint: { type: String, required: true, minlength: [4, "Start point name is too short"] },
  endPoint: { type: String, required: true, minlength: [4, "End point name is too short"] },
  date: { type: String, required: true },
  time: {
    type: String,
    required: true,
    validate: [/^[0-2]{1}[0-9]{1}\:[0-5]{1}[0-9]{1}$/, "Please input a valid deprat time"],
  },
  carImage: {
    type: String,
    required: true,
    validate: [/^https?:\/{2}/, "Please enter a valid URL"],
  },
  carBrand: {
    type: String,
    required: true,
    minlength: [4, "Too short car brand -- BMW is not allowed"],
  },
  seats: {
    type: Number,
    required: true,
    min: [0, "Seats must be between 0 and 4"],
    max: [4, "Seats must be between 0 and 4"],
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price must be between 1 and 50. Nobody rides for free"],
    max: [50, "Price must be between 1 and 50. Nobody rides for free"],
  },
  description: { type: String, required: true, minlength: [20, "Description is too short"] },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const TripModel = mongoose.model("trip", TripSchema);

module.exports = TripModel;
