const creds = {
  development: {
    username: "tecdemyuser",
    password: "TeChDemy7873!",
    database: "tecdemydb",
    host: "34.229.82.103",
    dialect: "mysql",
    //logging: false
    dialectOptions: {
      charset: "utf8",
      dateStrings: true,
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
};

module.exports = creds;
