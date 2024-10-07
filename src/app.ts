    require("dotenv").config()

    import { connectDB } from "./db/connect";

    import { ApolloServer } from '@apollo/server';

    import { startStandaloneServer } from '@apollo/server/standalone';

    import { mergedGQLSchema } from "./schema";
    import { resolvers } from "./resolvers";

    import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "./model/user";

    const PORT = parseInt(process.env.PORT as string) || 3000;

    const server = new ApolloServer({
        typeDefs : mergedGQLSchema,
        resolvers : resolvers,
        introspection : true
    });

    const start = async () => {
        try {
            await connectDB(process.env.MONGO_URI as string);
            await startStandaloneServer(server, { 
                listen: { port: PORT },
                context: async ({req}) => {
                    const token = req.headers['authorization']?.split(' ')[1];
                    let user;
                    if (token) {
                        try {
                            const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
                            if (typeof decodedToken === 'object' && 'id' in decodedToken) {
                                const jwtVerify = decodedToken as JwtPayload;
                                user = await User.findById(jwtVerify.id);
                            }
                        }   
                        catch(err) {
                            console.log('Invalid token');
                        }
                    }
                    return {user};
                }
            });
            console.log(`Server is listening on port ${PORT}`)
        } catch (error) {
            console.log(error)
        }
    }

    start();