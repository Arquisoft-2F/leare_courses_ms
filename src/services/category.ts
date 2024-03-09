import { db } from "../utils/dbserver";
import { v4 as uuidv4} from 'uuid';

type Category = {
    category_name: string;
}

export const getCategory = async (category_id: string):Promise<any> =>{
    const query = `
        SELECT * FROM Category WHERE category_id = $1
    `
    return db.query(query,[category_id])
}

export const listCategories = async (): Promise<any> => {
    return db.query('SELECT * FROM Category')
}

export const createCategory = async (category_name:string): Promise<any> => {
    try{
        const query = `
            INSERT INTO Category (category_name) VALUES ($1) RETURNING *
        `
        return db.query(query,[category_name])
    }catch(error){
        await db.query('ROLLBACK')
        throw error
    }
    
}

export const editCategory = async (category_id: string,category_name:string): Promise<any> => {
    try{
        const query = `
            UPDATE Category SET category_name = $1 WHERE category_id = $2 RETURNING *
        `
        return db.query(query,[category_name,category_id])

    }catch(error){
        db.query('ROLLBACK')
        throw error
    }
    
}

export const deleteCategory = async (category_id:string): Promise<any> => {
    try{
        const query = `
            DELETE FROM Course_Category WHERE category_id = $1;
            DELETE FROM Category WHERE category_id = $1;
        `
        return db.query(query,[category_id])
    }catch(error){
        db.query('ROLLBACK')
        throw error
    }
}