import {User, IUser} from '../model/user';
import jwt from 'jsonwebtoken';


interface Args {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'User' | 'Adimn';
}

const signUser = (user: IUser) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


export const UsersResolver = {
    Query : {
        users: async () => {
            try {
                const users = await User.find({});
                if (!users) throw new Error('No users found');
                return {
                    success: true,
                    total: users.length,
                    users
                };
            } catch (error) {
                throw error;
            }
        },    

        user: async (_ : any, args : Args) => {
            try {
                if (!args.id) throw new Error('No id provided');
                const user = await User.findById(args.id);
                if (!user) throw new Error('No user found');
                return user;
            } catch (error) {
                throw error;
            }
        },

        getMe: async (_ : any, args : Args, context: any) => {
            return context.user;
        }
    },

    Mutation : {
        regUser: async (_ : any, args : Args) => {
            try {
                const user = await User.findOne({email: args.email});
                if (user) throw new Error('User already exists');
                const newUser = await User.create({
                    username: args.username,
                    email: args.email,
                    password: args.password,
                    role: args.role
                })
                newUser.token = signUser(newUser);
                return newUser;
            } catch (error) {
                throw error;
            }
        },

        loginUser: async (_ : any, args : Args) => {
            try {
                const user = await User.findOne({email: args.email});
                if (!user) throw new Error('User not found');
                const isValid = await user.isValidPassword(args.password);
                if (!isValid) throw new Error('Invalid password');
                user.token = signUser(user); 
                return user;
            } catch (error) {
                throw error;
            }
        },

        updateUser: async (_ : any, args : Args, context: any) => {
            try {
                if (context.user.role !== 'Admin') {
                    throw new Error('Only admins can update users!');
                }
                const id = args.id;
                if (!id) throw new Error('No id provided');
                const user = await User.findById(id);
                if (!user) throw new Error('User not found');
                const updateUser = await User.findByIdAndUpdate(id, {...args}, {new: true, runValidators: true});
                return updateUser;
            } catch (error) {
                throw error;
            }
        },

        deleteUser: async (_ : any, args : Args, context: any) => {
            try {
                if (context.user.role !== 'Admin') {
                    throw new Error('Only admins can update users!');
                }
                const id = args.id;
                if (!id) throw new Error('No id provided');
                const user = await User.findById(args.id);
                if (!user) throw new Error('User not found');
                const deleteUser = await User.findByIdAndDelete(id);
                return {
                    success: true,
                    message: 'User deleted successfully',
                    id: deleteUser?._id
                };
            } catch (error) {
                throw error;
            }
        }
    }
}
