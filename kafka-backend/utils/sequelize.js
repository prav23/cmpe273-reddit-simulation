module.exports = {
  HOST: "reddit.c3fgcmxhqen1.us-east-2.rds.amazonaws.com",
  PORT: 8000,
  USER: "cmpe273",
  PASSWORD: "cmpe273groupproject",
  DB: "reddit",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};