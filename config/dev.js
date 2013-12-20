// TODO: encrypt this file
module['exports'] = {
  "frontend": {
    port: 8888
  },
  "bitcoin": {
    host: 'localhost',
    port: 8333,
    user: 'username',
    pass: 'password'
  },
  "ppcoin": {
    host: 'localhost',
    port: 9902,
    user: 'username',
    pass: 'password'
  },
  "datasource": {
    type: "couchdb",
    username: "admin",
    password: "password",
    port: 5984,
    host: "localhost"
  },
  "sendgrid": {
    api_user: "username",
    api_key: "password"
  }
};