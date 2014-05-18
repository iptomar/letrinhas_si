var Q = require('Q');

function willThrow() {
  return Q.fcall(function () {
    throw 'AHH!!'
  });
}

willThrow()
  .then(function (_) {
    console.log('On then');
  })
  .catch(function (err) {
    console.error('Whoops: ', err);
  });