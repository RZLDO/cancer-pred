
import { userRolesModel, accountModel, passientModel } from '../model/defineDatabaseRelations.mjs'

const pasientRepository ={
    async fetchPasient(){
        return await passientModel.findAll({
            include : {
                model: accountModel,
                as: 'user', 
                include: {
                    model: userRolesModel,     // model relasinya
                    as: 'role'            // alias dari relasinya
                  }
            },
        });
    },
    async createNewpassient(
        idAccount, 
        name, 
        gender, 
        birthdate, 
        address,
    ){ 
        const pasient = await passientModel.create({
            idAccount : idAccount, 
            nama : name, 
            jenisKelamin : gender, 
            tanggalLahir : birthdate, 
            alamat : address
        }, ); 

        return pasient;
    }, 

    async fetchPassientById(
        pasientId,
    ){
        const pasient = await passientModel.findOne({
            where : {
                idPasient : pasientId
            },
            include : {
                model: accountModel,
                as: 'user',
                include: {
                    model: userRolesModel,     // model relasinya
                    as: 'role'            // alias dari relasinya
                  }
            },
        })

        if(!pasient){
            const error = new Error('pasient with that id not found'); 
            error.status = 404; 
            throw error
        }

        return pasient;
    },

    async fetchPasientByAccountId(
        accountId 
    ){ 
        const pasient = await passientModel.findAll({
            where : {
                idAccount : accountId
            },
            include : {
                model: accountModel,
                as: 'user',
                include: {
                    model: userRolesModel,     // model relasinya
                    as: 'role'            // alias dari relasinya
                  }
            },
        })

        if(!pasient){
            const error = new Error('pasient with that id not found'); 
            error.status = 404; 
            throw error
        }

        return pasient;
    }
}

export default pasientRepository;