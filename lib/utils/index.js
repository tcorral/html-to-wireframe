module.exports = {
  arrayToString: function (array){
    var strArr = [];
    array.forEach(function (item) {
      strArr.push('"' + item + '"')
    });
    return '[' + strArr.join(',') + ']';
  }
};