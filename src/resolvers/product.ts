import { Product } from "../model/product";

interface Args {
    id: string;
    name: string;
    price: number;
}

export const ProductsResolver = {
    Query : {
        products: async () => {
            try {
                const products = await Product.find({});
                if (!products) throw new Error('No products found');
                return {
                    success: true,
                    total: products.length,
                    products
                };
            } catch (error) {
                throw error;
            }
        },

        product: async (_ : any, args : Args) => {
            try {
                if (!args.id) throw new Error('No id provided');
                const product = await Product.findById(args.id);
                if (!product) throw new Error('No product found');
                return product;
            } catch (error) {
                throw error;
            }
        }
    },

    Mutation : {
        addProduct: async (_ : any, args : Args) => {
            try {
                const product = await Product.findOne({name: args.name});
                if (product) throw new Error('Product already exists');
                const newProduct = await Product.create({
                    name: args.name,
                    price: args.price
                })
                return newProduct;
            } catch (error) {
                throw error;
            }
        },

        updateProduct: async (_ : any, args : Args) => {
            try {
                const id = args.id;
                if (!id) throw new Error('No id provided');
                const product = await Product.findById(args.id);
                if (!product) throw new Error('No product found');
                const updateProduct = await Product.findByIdAndUpdate(id, {...args}, {new: true, runValidators : true});
                return updateProduct;
            } catch (error) {
                console.log(error)
            }
        },

        deleteProduct: async (_ : any, args : Args) => {
            try {
                const id = args.id;
                if (!id) throw new Error('No id provided');
                const product = await Product.findById(args.id);
                if (!product) throw new Error('No product found');
                const deleteProduct = await Product.findByIdAndDelete(id);
                return {
                    success: true,
                    message: 'Product deleted successfully',
                    id: deleteProduct?._id
                };
            } catch (error) {
                throw error;
            }
        }
    }
}