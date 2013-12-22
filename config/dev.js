// TODO: encrypt this file
module['exports'] = {
  "frontend": {
    port: 8888
  },
  "coldstorage": {
    "bitcoin": [{ public_key: "148dBGs99rnFHSu3euZYziABse6Prs5L7J" }],
    "dogecoin": [{ public_key: "DS6p3PRcPrECMRzX37H92PFoifnrj717ZB" }],
    "peercoin": [{ public_key: "PRsyinCxhkJ5ib7cWXzqTTYXN7mwJybtA4" }]
  },
  "deposits": {
    "bitcoin": {
      host: 'localhost',
      port: 8333,
      user: 'username',
      pass: 'password',
    },
    "peercoin": {
      host: 'localhost',
      port: 9902,
      user: 'username',
      pass: 'password'
    },
    "dogecoin": {
      host: 'localhost',
      port: 9903,
      user: 'username',
      pass: 'password'
    }
  },
  "withdrawals": {
    "bitcoin": {
      host: 'localhost',
      port: 9801,
      user: 'username',
      pass: 'password',
    },
    "peercoin": {
      host: 'localhost',
      port: 9802,
      user: 'username',
      pass: 'password'
    },
    "dogecoin": {
      host: 'localhost',
      port: 9803,
      user: 'username',
      pass: 'password'
    }
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