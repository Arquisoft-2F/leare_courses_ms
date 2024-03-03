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
    return db.query(`INSERT INTO Category (category_name) VALUES ('${category_name}')`)
}

export const editCategory = async (category_id: string,category_name:string): Promise<any> => {
    return db.query(`UPDATE Category SET category_name = '${category_name}' WHERE category_id = '${category_id}'`)
}

export const deleteCategory = async (category_id:string): Promise<any> => {
    return db.query(`DELETE FROM Category WHERE category_id = '${category_id}'`)
}