const formatHelper = require('./formatHelper');

const formatToUsableData = (data, imageSize) => {
  data = data.replace(/]|\[|,/g, '').split('\n');
  data.pop();
  
  const newData = [];
  data.forEach((eachData) => {
    eachData = eachData.split(' ')
    eachData.pop();
    newData.push(eachData);
  });

  const { height, width } = imageSize;
  const usableData = [];
  newData.forEach((eachNewData) => {
    eachNewData.length >= 5 && eachNewData.length <= 10
      ? usableData.push(formatHelper(eachNewData, eachNewData.length, height, width))
      : console.log('either an invalid data or object was not detected');
  });

  return usableData;
};

module.exports = formatToUsableData;