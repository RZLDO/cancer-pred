import accountModel from './accountModel.mjs';
import userRolesModel from './roleModel.mjs';
import passientModel from './pasientModel.mjs';
import predictionsModel from './predictionModel.mjs';

userRolesModel.hasMany(accountModel, { foreignKey: 'id_role' });
accountModel.belongsTo(userRolesModel, { foreignKey: 'id_role' });

passientModel.belongsTo(accountModel, { foreignKey : 'id_account', as : 'user' });
accountModel.hasMany(passientModel, { foreignKey : 'id_account' });

passientModel.hasMany(predictionsModel, {foreignKey : 'id_pasien'})
predictionsModel.belongsTo(passientModel, { foreignKey : 'id_pasien', as : 'pasient'})



export { userRolesModel, accountModel, passientModel, predictionsModel};
