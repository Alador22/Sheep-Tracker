const userInfo = (req, res, next) => {};

const signUp = (req, res, next) => {
  const { email, password } = req.body;

  const newUser = {
    email,
    password,
  };

  newUser.save(newUser);

  res.status(201).json({ user: newUser });
};

const logIn = (req, res, next) => {};

const updatePassword = (req, res, next) => {};

const removeAccount = (req, res, next) => {};

exports.userInfo = userInfo;
exports.signUp = signUp;
exports.logIn = logIn;
exports.updatePassword = updatePassword;
exports.removeAccount = removeAccount;
