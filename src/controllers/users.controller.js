import { usersService } from "../repositoryServices/index.js";
import customError from "../services/errors/errors.generate.js"
import { errorsMessage, errorsName } from "../services/errors/errors.enum.js";
import passport from "passport";
import { uManager } from "../DAL/dao/mongo/users.dao.js";




export const findUserById = (req, res) => {
    passport.authenticate("jwt", { session: false }),

    async (req, res) => {
        const { idUser } = req.params;
        const user = await usersService.findById(idUser);
        if (!user) {
            customError.createError(errorsName.USER_NOT_FOUND,errorsMessage.USER_NOT_FOUND,500)
            }
        res.json({ message: "User", user });
}};

export const findUserByEmail = async (req, res) => {
    const { UserEmail } = req.body;
    const user = await usersService.findByEmail(UserEmail);
    if (!user) {
        customError.createError(errorsName.USER_NOT_FOUND,errorsMessage.USER_NOT_FOUND,500)
    }
    res.status(200).json({ message: "User found", user });
};

export const createUser =  async (req, res) => {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password) {
        customError.createError(errorsName.DATA_NOT_RECEIVED,errorsMessage.DATA_NOT_RECEIVED,500)
    }
    const createdUser = await usersService.createOne(req.body);
    res.status(200).json({ message: "User created", user: createdUser });
};

export const changeRole= async (req, res) => {
        const { idUser } = req.params;
        const user = await usersService.findById(idUser);
        if (!user) {
            customError.createError(errorsName.USER_NOT_FOUND,errorsMessage.USER_NOT_FOUND,500)
            }
        
    try {
        console.log(user)
        let roleChange;
        if (user.role === 'PREMIUM') {
            roleChange = { role: 'USER' }
        } else if (user.role === 'USER' ){
            roleChange = { role: 'PREMIUM' }
        }

        const result =await uManager.updateUser(user.email,roleChange)
        /* const newUser= upd //aca hay q implementar el resto
        console.log(user)
        if(user.role=="USER"){
            user.role="ADMIN"
        }*/
        res.status(200).json({message:"role updated",user:result})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
