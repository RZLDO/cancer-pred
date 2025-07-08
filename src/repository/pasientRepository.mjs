
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
            nama: nama,
            jenisKelamin: jenisKelamin.toUpperCase().startsWith("L") ? "L" : "P",
            tanggalLahir: tanggalLahir,
            alamat: alamat,
          };
          console.log(pasientData);
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