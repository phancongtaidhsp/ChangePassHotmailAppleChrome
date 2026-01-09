const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const splitArrayIntoChunks = (array, numChunks) => {
  const chunkSize = Math.floor(array.length / numChunks); // Kích thước mỗi mảng nhỏ
  const remainder = array.length % numChunks;
  const chunks = [];
  for (let i = 0; i < numChunks; i++) {
    chunks.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  if (remainder > 0) {
    chunks[chunks.length - 1] = [...chunks[chunks.length - 1], ...array.slice(array.length - remainder)];
  }
  return chunks;
}

module.exports = {
  delay,
  splitArrayIntoChunks,
};