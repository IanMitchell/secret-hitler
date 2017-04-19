// eslint-disable-next-line func-names, no-extend-native
Array.prototype.shuffle = function () {
  let counter = this.length || 0;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter -= 1;

    const temp = this[counter];
    this[counter] = this[index];
    this[index] = temp;
  }

  return this;
};
