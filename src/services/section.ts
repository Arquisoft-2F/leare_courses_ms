import { db } from "../utils/dbserver";
import { v4 as uuidv4} from 'uuid';

interface SectionUpdate {
    module_id?: string;
    section_name?:string;
    section_content?:string;
    video_id?:string;
    files_array?:Array<string>
    pos_index?:number
}

export const getSection = async (section_id: string):Promise<any> =>{
    const query = `
        SELECT * FROM Section WHERE section_id = $1
    `
    return db.query(query,[section_id])
}

export const listModuleSections = async (module_id:string,page:number): Promise<any> => {
    const rowsPerPage = 2;
    const query = `
    SELECT * FROM Section WHERE module_id = $3
    LIMIT 
        $2
    OFFSET 
        ($1 - 1) * $2;
    `
    return db.query(query,[page, rowsPerPage,module_id])
}

export const createSection = async (module_id:string,section_name:string,section_content:string,video_id:string,files_array:Array<string>,pos_index:number): Promise<any> => {
    try{
        const query = `
            INSERT INTO Section 
                (module_id, section_name, section_content, video_id, files_array, pos_index, created_at, updated_at) 
            VALUES 
                ($1,$2,$3,$4,$5,$6,CURRENT_DATE,CURRENT_DATE) 
            RETURNING *
        `
        const result = await db.query(query,[module_id, section_name, section_content, video_id, files_array, pos_index]);
        return result
        
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
}

export const editSection = async (section_id: string, updates: SectionUpdate): Promise<any> => {
    try{
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(updates);
        

        
        const updateCourseQuery = `
            UPDATE Section
            SET updated_at = CURRENT_DATE, ${setClause}
            WHERE section_id = $1
            RETURNING *
        `;
        
        const result = await db.query(updateCourseQuery, [section_id,...values]);
        return result
            
        
    
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
    
}


export const deleteSection = async (section_id:string): Promise<any> => {
    // const query = `
    //     DELETE FROM Course_Category WHERE course_id = '${course_id}';
    //     DELETE FROM Module WHERE course_id = '${course_id}';
    //     ALTER TABLE Section 
    //     ADD CONSTRAINT fk_module_section FOREIGN KEY (module_id) 
    //     REFERENCES Module(module_id) 
    //     ON DELETE CASCADE;
    //     DELETE FROM Course WHERE course_id = '${course_id}';
    // `
    try{
        const query = `
            DELETE FROM Section WHERE section_id = $1
        `
        return db.query(query,[section_id])
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
}