const router = require("express").Router();

const { isAuth } = require("../middlewares/userMiddleware.js");
const tripService = require("../services/tripService.js");

const create = async (req, res) => {
  console.log(req.body);
  const escapedData = {
    startPoint: req.body.startPoint,
    endPoint: req.body.endPoint,
    date: req.body.date,
    time: req.body.time,
    carImage: req.body.carImage,
    carBrand: req.body.carBrand,
    seats: req.body.seats,
    description: req.body.description,
    price: req.body.price,
    isPublic: Boolean(req.body.isPublic),
  };

  if (Object.values(escapedData).includes("")) {
    console.log("empty detected");
    escapedData.error = [{ message: "All fields are mandatory" }];
    res.render("trips/create", escapedData);
    return;
  }

  try {
    escapedData.owner = req.user.id;
    await tripService.create(escapedData);
    res.redirect("/");
  } catch (err) {
    const errKeys = Object.keys(err?.errors);
    console.log(errKeys);
    if (
      errKeys.includes("startPoint") ||
      errKeys.includes("date") ||
      errKeys.includes("time") ||
      errKeys.includes("carImage") ||
      errKeys.includes("carBrand") ||
      errKeys.includes("seats") ||
      errKeys.includes("price") ||
      errKeys.includes("description")
    ) {
      const errMess = [
        err.errors.startPoint?.message,
        err.errors.endPoint?.message,
        err.errors.imageUrl?.message,
        err.errors.date?.message,
        err.errors.time?.message,
        err.errors.carImage?.message,
        err.errors.carBrand?.message,
        err.errors.seats?.message,
        err.errors.price?.message,
        err.errors.description?.message,
      ]
        .filter((e) => e != undefined)
        .map((e) => ({ message: e }));

      escapedData.error = errMess;
      res.render(`trips/create`, escapedData);
    } else {
      console.log(err);
      throw err;
    }
  }
};

const getAll = async (req, res) => {
  const allTrips = await tripService.getAll();
  res.render("trips/allTrips", { allTrips });
};

const details = async (req, res) => {
  const viewObj = {};
  const trip = await tripService.getOne(req.params.id);
  viewObj.trip = trip;
  viewObj.isOwner = trip.owner._id == req?.user?.id;
  viewObj.isPassenger = trip.passengers.some((x) => x._id == req?.user?.id);
  viewObj.availableSeats = trip.seats - trip.passengers.length;
  viewObj.passengers = trip.passengers.map((p) => p.email).join(", ");
  // console.log(viewObj);
  res.render("trips/details", viewObj);
};

const loadEdit = async (req, res) => {
  const trip = await tripService.getOne(req.params.id);
  if (req.user.id != trip.owner._id) {
    res.redirect("/");
    return;
  }

  res.render("trips/edit", trip);
};

const edit = async (req, res) => {
  let trip = await tripService.getOne(req.params.id);
  if (req.user.id != trip.owner._id) {
    res.redirect("/");
    return;
  }

  const escapedTrip = {
    _id: req.params.id,
    startPoint: req.body.startPoint,
    endPoint: req.body.endPoint,
    date: req.body.date,
    time: req.body.time,
    carImage: req.body.carImage,
    carBrand: req.body.carBrand,
    seats: req.body.seats,
    description: req.body.description,
    price: req.body.price,
    isPublic: Boolean(req.body.isPublic),
  };

  if (Object.values(escapedTrip).includes("")) {
    console.log("empty detected");
    escapedTrip.error = [{ message: "All fields are mandatory" }];
    res.render(`course/edit-course`, escapedTrip);
    return;
  }

  try {
    await tripService.updateOne(req.params.id, escapedTrip);
    res.redirect(`/trips/details/${req.params.id}`);
  } catch (err) {
    const errKeys = Object.keys(err?.errors);
    if (
      errKeys.includes("startPoint") ||
      errKeys.includes("date") ||
      errKeys.includes("time") ||
      errKeys.includes("carImage") ||
      errKeys.includes("carBrand") ||
      errKeys.includes("seats") ||
      errKeys.includes("price") ||
      errKeys.includes("description")
    ) {
      const errMess = [
        err.errors.startPoint?.message,
        err.errors.endPoint?.message,
        err.errors.imageUrl?.message,
        err.errors.date?.message,
        err.errors.time?.message,
        err.errors.carImage?.message,
        err.errors.carBrand?.message,
        err.errors.seats?.message,
        err.errors.price?.message,
        err.errors.description?.message,
      ]
        .filter((e) => e != undefined)
        .map((e) => ({ message: e }));

      escapedTrip.error = errMess;
      res.render(`trips/edit`, escapedTrip);
    } else {
      throw err;
    }
  }
};

const remove = async (req, res) => {
  let trip = await tripService.getOne(req.params.id);
  if (req.user.id != trip.owner._id) {
    res.redirect("/");
    return;
  }

  try {
    await tripService.deleteOne(req.params.id);
    res.redirect("/trips/list");
  } catch (err) {
    console.log(err);
  }
};

const join = async (req, res) => {
  let trip = await tripService.getOne(req.params.id);
  if (req.user.id == trip.owner._id) {
    res.redirect("/");
    return;
  }

  try {
    await tripService.join(req.params.id, req.user);
    res.redirect(`/trips/details/${req.params.id}`);
  } catch (err) {
    console.log(err);
  }
};

router.get("/list", getAll);
router.get("/offer", isAuth, (req, res) => res.render("trips/create"));
router.post("/offer", isAuth, create);

router.get("/details/:id", details);
router.get("/edit/:id", isAuth, loadEdit);
router.post("/edit/:id", isAuth, edit);

router.get("/join/:id", isAuth, join);
router.get("/delete/:id", isAuth, remove);

module.exports = router;
