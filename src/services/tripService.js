const TripModel = require("../models/trip.js");
const userService = require("./userService.js");

const getAllPublic = () => {
  return TripModel.find({ isPublic: true }).sort({ addedOn: -1 }).lean();
};

const create = async (data) => {
  const newTrip = await TripModel.create(data);
  console.log(newTrip);
  await userService.joinTrip(newTrip._id, data.owner);
  return newTrip;
};

const getAll = () => {
  return TripModel.find({ deleted: false }).lean();
};

const getOne = (id, notLean) => {
  if (notLean) {
    return TripModel.findById(id).populate("passengers owner");
  }
  return TripModel.findById(id).populate("passengers owner").lean();
};

const updateOne = (id, data) => {
  return TripModel.findByIdAndUpdate(id, data, { runValidators: true, new: true });
};

const deleteOne = async (id) => {
  const item = await getOne(id, true);
  console.log(item);

  await item.updateOne({ $set: { deleted: true } });

  return;
  // return TripModel.findByIdAndDelete(id);
};

const join = async (tripId, user) => {
  const trip = await TripModel.findById(tripId);
  console.log(user.id);
  trip.passengers.push(user.id);
  // await userService.joinTrip(tripId, user.id);
  return trip.updateOne({ $set: { passengers: trip.passengers } });
};

const search = async (typeStr) => {
  console.log(typeStr);
  const searchObj = { type: new RegExp(typeStr, "i") };
  return TripModel.find(searchObj).lean();
};

const houseService = { getAllPublic, create, getAll, getOne, updateOne, deleteOne, join, search };

module.exports = houseService;
