const formatHelper = (data, dataLength, height, width) => {
  let label;
  switch (dataLength) {
    case 5:
      label = `${data[0]}`;
      break;
    case 6:
      label = `${data[0]} ${data[1]}`;
      break;
    case 7:
      label = `${data[0]} ${data[1]} ${data[2]}`;
      break;
    case 8:
      label = `${data[0]} ${data[1]} ${data[2]} ${data[3]}`;
      break;
    case 9:
      label = `${data[0]} ${data[1]} ${data[2]} ${data[3]} ${data[4]}`;
      break;
    case 10:
      label = `${data[0]} ${data[1]} ${data[2]} ${data[3]} ${data[4]} ${data[5]}`;
      break;
    default:
      console.log('invalid data length given during formatHelper');
  }

  const dataPosition = [
    parseInt(data[dataLength - 4]), 
    parseInt(data[dataLength - 3]), 
    parseInt(data[dataLength - 2]), 
    parseInt(data[dataLength - 1])
  ];

  const [ left, top, right, bottom ] = dataPosition;

  const xCoordinate = Math.floor((right - left) / 2 + left);
  const yCoordinate = Math.floor((top - bottom) / 2 + bottom);
 
  const labelData = {
    label,
    x: xCoordinate,
    y: yCoordinate,
    height,
    width,
  };

  return labelData;
};

module.exports = formatHelper;