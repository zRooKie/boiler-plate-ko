if(process.env.NODE_ENV === 'procuction') {
  module.exports = require('./prod');
} else {
  module.exports = require('./dev');
}