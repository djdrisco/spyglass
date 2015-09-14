module.exports = {

  // Web server listening port
  'serverPort': 4000,
  
  // String to prefix all links to app
  'baseUrl': '/spyglass',

  //update per your environment
  "mongodb": {
    "host": "",
    "port": 0
  },

  ////update per your environment
  "dbs": {
    "session": ""
  },
  ////update per your environment
  "webserver": {
    "cookieSecret": ""
  },
  // API version locking
  'apiVersion': '2015-03-01',
  
  // AWS regions upon which all API calls will iterate over
  //'regions': [
  //  'us-east-1',
  //  'us-west-1',
  //  'us-west-2',
  //  'eu-west-1',
  //  'eu-central-1',
  //  'ap-southeast-1',
  //  'ap-southeast-2',
  //  'ap-northeast-1',
  //  'sa-east-1'
  //]

    'regions': [
        'us-east-1'
    ]
  
};
