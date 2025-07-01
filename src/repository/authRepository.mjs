import {accountModel}  from '../model/defineDatabaseRelations.mjs';
import bcrypt from 'bcrypt';
const authRepository = {
  async register(username, password, roleId, name) {
    const user = await accountModel.findOne({
      where: {
        username: username,
      },
    });

    if (user) {
      const error = new Error('username has registered');
      error.status = 409;
      throw error;
    }
    
    return accountModel.create({
      username: username,
      password: password,
      idRole: roleId,
      name : name
    });
  },

  async login(username, password) {
    const user = await accountModel.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      const error = new Error('Invalid username or password');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid username or password');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

};

export default authRepository;
