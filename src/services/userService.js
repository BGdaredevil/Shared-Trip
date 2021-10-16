const UserModel = require("../models/user.js");

const register = async (user) => {
  return UserModel.create({
    email: user.email,
    password: user.password,
    gender: user.gender,
  });
};

const login = async (user) => {
  try {
    const item = await UserModel.findOne({ email: user.email });
    if (!item) {
      return null;
    }
    const validPass = await item.verifyPass(user.password);
    console.log("pass is ", validPass);
    if (validPass) {
      return item;
    } else {
      return null;
    }
  } catch (err) {
    // console.log(err);
    throw err;
  }
};

const getUser = (id, notLean) => {
  if (notLean) {
    return UserModel.findById(id).populate("tripHistory");
  }

  return UserModel.findById(id).populate("tripHistory").lean();
};

const joinTrip = async (tripId, userId) => {
  const user = await UserModel.findById(userId);
  user.tripHistory.push(tripId);
  return user.updateOne({ $set: { tripHistory: user.tripHistory } });
};

const checkUsername = async (name) => {
  let temp = await UserModel.findOne({ email: name }).lean();
  return temp != null;
};

const userService = { register, login, getUser, joinTrip, checkUsername };

module.exports = userService;
