export default (words) => {
  let ar = [];
  words.forEach((word) => {
    const firstLetter = word.charAt(0).toLocaleUpperCase();
    ar.push(firstLetter);
  });
  return ar.join('');
};
