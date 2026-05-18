export default function declineName(name) {
  const nameArr = name.split('');
  nameArr[nameArr.length - 1] = 'ы';
  const declinedName = nameArr.join('');

  return declinedName;
}
