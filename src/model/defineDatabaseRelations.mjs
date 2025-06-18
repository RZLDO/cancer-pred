import accountModel from './accountModel.mjs';
import userRolesModel from './roleModel.mjs';
import passientModel from './pasientModel.mjs';

userRolesModel.hasMany(accountModel, { foreignKey: 'id_role' });
accountModel.belongsTo(userRolesModel, { foreignKey: 'id_role' });

passientModel.belongsTo(accountModel, { foreignKey : 'id_account', as : 'user' });
accountModel.hasHook(passientModel, { foreignKey : 'id_account' });


export { userRolesModel, accountModel, passientModel};
