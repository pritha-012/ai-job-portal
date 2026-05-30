import { User } from '../models/index.js';

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

export const findUserByEmail = async (email) => {
    // We use +password to explicitly pull the password field for verification, 
    // since we set select: false in the model
    return await User.findOne({ email }).select('+password'); 
};
export const saveUser = async (userDocument) => {
    return await userDocument.save();
};