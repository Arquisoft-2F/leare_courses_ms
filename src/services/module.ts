import { db } from "../utils/dbserver";
import { v4 as uuidv4} from 'uuid';

interface ModuleUpdate {
    module_name?: string;
    pos_index?:number;
}

export const getModule = async (module_id: string):Promise<any> =>{
    const query = `
    SELECT
    m.module_id,
    m.module_name,
    m.course_id,
    m.pos_index AS module_pos_index,
        CASE
            WHEN count(s.section_id) = 0 THEN '[]'::json
            ELSE json_agg(json_build_object(
                'section_id', s.section_id,
                'section_name', s.section_name,
                'section_content', s.section_content,
                'video_id', s.video_id,
                'files_array', s.files_array,
                'pos_index', s.pos_index
            ))
        END AS sections
    FROM
        Module m
    LEFT JOIN
        Section s ON m.module_id = s.module_id
    WHERE
        m.module_id = $1
    GROUP BY
        m.module_id,
        m.module_name,
        m.course_id,
        m.pos_index
    ORDER BY
        m.pos_index;
    `
    return db.query(query,[module_id])
}

export const listModules = async (course_id:string,page:number): Promise<any> => {
    const rowsPerPage = 2;
    const query = `
    SELECT
    m.module_id,
    m.module_name,
    m.course_id,
    m.pos_index AS module_pos_index,
    CASE
        WHEN count(s.section_id) = 0 THEN '[]'::json
        ELSE json_agg(json_build_object(
            'section_id', s.section_id,
            'section_name', s.section_name,
            'section_content', s.section_content,
            'video_id', s.video_id,
            'files_array', s.files_array,
            'pos_index', s.pos_index
        ))
    END AS sections
    FROM
        Module m
    LEFT JOIN
        Section s ON m.module_id = s.module_id
    WHERE
        m.course_id = $3
    GROUP BY
        m.module_id,
        m.module_name,
        m.course_id,
        m.pos_index
    ORDER BY
        m.pos_index
    LIMIT 
        $2
    OFFSET 
        ($1 - 1) * $2;
    `
    return db.query(query,[page, rowsPerPage,course_id])
}

export const createModule = async (module_name:string,course_id:string,pos_index:number): Promise<any> => {
    try{
        const query = `
            INSERT INTO Module 
                (module_name, course_id, pos_index, created_at, updated_at) 
            VALUES 
                ($1,$2,$3,CURRENT_DATE,CURRENT_DATE)
            RETURNING *
        `
        const result = await db.query(query,[module_name,course_id,pos_index]);
        return result
        
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
    
    
}

export const editModule = async (module_id: string, updates: ModuleUpdate): Promise<any> => {
    try{
        const setClause = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(updates);
        

        
        const updateCourseQuery = `
            UPDATE Module
            SET updated_at = CURRENT_DATE, ${setClause}
            WHERE module_id = $1
            RETURNING *
        `;
        
        const result = await db.query(updateCourseQuery, [module_id,...values]);
        return result
            
        
    
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
    
}


export const deleteModule = async (module_id:string): Promise<any> => {
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
            DELETE FROM Module WHERE module_id = $1
        `
        return db.query(query,[module_id])
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
}