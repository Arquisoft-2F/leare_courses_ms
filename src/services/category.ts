import { db } from "../utils/dbserver";
import { v4 as uuidv4} from 'uuid';

type Category = {
    category_name: string;
}

export const getCategory = async (category_id: string):Promise<any> =>{
    return db.query(`SELECT * FROM Category WHERE category_id = '${category_id}'`)
}

export const listCategories = async (): Promise<any> => {
    return db.query('SELECT * FROM Category')
}

export const createCategory = async (category_name:string): Promise<any> => {
    try{
        return db.query(`INSERT INTO Category (category_name) VALUES ('${category_name}')`)
    }catch(error){
        await db.query('ROLLBACK')
        throw error
    }
    
}

export const editCategory = async (category_id: string,category_name:string): Promise<any> => {
    try{
        return db.query(`UPDATE Category SET category_name = '${category_name}' WHERE category_id = '${category_id}'`)
    }catch(error){
        db.query('ROLLBACK')
        throw error
    }
    
}

export const deleteCategory = async (category_id:string): Promise<any> => {
    try{
        const query = `
            DELETE FROM Course_Category WHERE category_id = '${category_id}';
            DELETE FROM Category WHERE category_id = '${category_id}';
        `
        return db.query(query)
    }catch(error){
        db.query('ROLLBACK')
        throw error
    }
}