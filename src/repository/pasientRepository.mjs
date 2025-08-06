
import { userRolesModel, accountModel, passientModel, predictionsModel } from '../model/defineDatabaseRelations.mjs'

const pasientRepository ={
    async fetchPasient(){
        return await passientModel.findAll({
            include : {
                model: accountModel,
                as: 'user', 
                include: {
                    model: userRolesModel,    
                    as: 'role'        
                  }
            },
        });
    },

    async getTotalPasient() {
        const total = await passientModel.count();
        return total;
    },
          
    async createNewpassientWithOcr(ocr, idAccount){
        const parsedOcr = JSON.parse(ocr);
        
        const isExist = await passientModel.findOne({
            where : { 
                nik : parsedOcr.nik
            }
        })
        if(isExist){
            return isExist;
        }
        const pasientData = {
            idAccount: idAccount,
            nama: parsedOcr.nama,
            nik : parsedOcr.nik,
            jenisKelamin: parsedOcr.jenis_kelamin.toUpperCase().startsWith("L") ? "L" : "P",
            tanggalLahir: new Date(parsedOcr.tanggal_lahir.split("-").reverse().join("-")),
            alamat: parsedOcr.alamat
          };
           
        const pasient = await passientModel.create(pasientData); 

        return pasient;
    }, 
    async createNewpassient(nama, jenisKelamin, tanggalLahir, alamat, idAccount, nik){
        console.log('userId :' + idAccount);
        const isExist = await passientModel.findOne({
            where : { 
                nik : nik
            }
        })
        const userExist = await accountModel.findOne({
            where : {
                idAccount : idAccount
            }
        })

        if(!userExist){
            const error = new Error('Invalid account id');
            error.statusCode = 404;
            throw error;
        }

        if(isExist){
            return isExist;
        }
        const pasientData = {
            idAccount: idAccount,
            nama: nama,
            jenisKelamin: jenisKelamin.toUpperCase().startsWith("L") ? "L" : "P",
            tanggalLahir: tanggalLahir,
            alamat: alamat,
            nik : nik
          };
        const pasient = await passientModel.create(pasientData); 

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
                  },
                
            },
            include : {
                model : predictionsModel,
                as : 'pemeriksaan'
            }
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