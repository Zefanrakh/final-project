const bcrypt = require("bcryptjs");

const hashed = (password) => {
  const salt = bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt);
};

const isSame = (password, hashed) => {
  return bcrypt.compareSync(password, hashed);
};

module.exports = {
  hashed,
  isSame,
};
