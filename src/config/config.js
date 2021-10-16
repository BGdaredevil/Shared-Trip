module.exports = {
  development: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "27017",
    appPort: process.env.APP_PORT || "3030",
    table: process.env.DB_TABLE || "Shared-Trips",
    dBaseUrl: `mongodb://${process.env.DB_HOST || "localhost"}:${process.env.DB_PORT || "27017"}/${
      process.env.DB_TABLE || "Shared-Trips"
    }`,
    saltRounds: 5,
    cookie_name: "Shared-Trips",
    secret: "pesho believes that gosho is something else entirely",
    tokenExpDate: "1h",
  },
  production: {},
};
//it is not clear what should be the case with the history --  i can do it for trips that the owner participated or ones that the owner created or both... also flag deleted
