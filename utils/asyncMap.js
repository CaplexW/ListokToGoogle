export default async function asyncMap(array, asyncFn) {
  const promises = array.map(item => asyncFn(item));
  return Promise.all(promises);
}