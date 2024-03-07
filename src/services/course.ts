import { db } from "../utils/dbserver";
import { v4 as uuidv4} from 'uuid';

interface CourseUpdate {
    course_name?: string;
    course_description?: string;
    creator_id?: string;
    public?: boolean;
    picture_id?: string;
    categories?: Array<string>;
}

export const getCourse = async (course_id: string):Promise<any> =>{
    const query = `
    SELECT 
        c.course_id,
        c.course_name,
        c.course_description,
        c.creator_id,
        c.public,
        c.picture_id,
        c.created_at,
        c.updated_at,
        json_agg(json_build_object('category_id', ct.category_id, 'category_name', ct.category_name)) AS categories
    FROM 
        Course c
    LEFT JOIN 
        Course_Category cc ON c.course_id = cc.course_id
    LEFT JOIN 
        Category ct ON cc.category_id = ct.category_id
    WHERE
        c.course_id = '${course_id}'
    GROUP BY
        c.course_id;
    `
    return db.query(query)
}

export const listCourses = async (): Promise<any> => {
    const query = `
        SELECT 
            c.course_id,
            c.course_name,
            c.course_description,
            c.creator_id,
            c.public,
            c.picture_id,
            c.created_at,
            c.updated_at,
            json_agg(json_build_object('category_id', ct.category_id, 'category_name', ct.category_name)) AS categories
        FROM 
            Course c
        LEFT JOIN 
            Course_Category cc ON c.course_id = cc.course_id
        LEFT JOIN 
            Category ct ON cc.category_id = ct.category_id
        GROUP BY
            c.course_id;
    `
    return db.query(query)
}

export const createCourse = async (course_name:string,course_description:string,creator_id:string,picture_id:string, categories:Array<string>): Promise<any> => {
    try{
        const query = `
            INSERT INTO Course 
                (course_name, course_description, creator_id, public, picture_id, created_at, updated_at) 
            VALUES 
                ('${course_name}','${course_description}','${creator_id}',false,'${picture_id}',CURRENT_DATE,CURRENT_DATE) 
            RETURNING course_id
        `

        const result = await db.query(query);
        const assignedId = result.rows[0].course_id;

        categories.forEach(async category => {
            // let catIdQuery = await db.query(`SELECT category_id FROM Category WHERE category_name = '${category}'`)
            // let catId = catIdQuery.rows[0].category_id
            // console.log(catIdQuery)
            db.query(`INSERT INTO Course_Category (course_id,category_id) VALUES ('${assignedId}','${category}')`)
        });
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
    
    
}

export const editCourse = async (course_id: string, updates: CourseUpdate): Promise<any> => {
    try{
        const {categories, ...updateFields} = updates;
        const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
        const values = Object.values(updateFields);
        

        if(setClause){
            const updateCourseQuery = `
                UPDATE Course
                SET ${setClause}
                WHERE course_id = $1
            `;
            
            await db.query(updateCourseQuery, [course_id,...values]);
            
        }
        if(categories && categories.length>0){
            
            const deleteQuery = `
                DELETE FROM Course_Category
                WHERE course_id = '${course_id}'
            `
            await db.query(deleteQuery);

            const insertQuery = `
                INSERT INTO Course_Category (course_id, category_id)
                VALUES ($1, unnest($2::uuid[]))
            `;
            await db.query(insertQuery, [course_id, categories]);
        }
    
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
    
}


export const deleteCourse = async (course_id:string): Promise<any> => {
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
            DELETE FROM Course_Category WHERE course_id = '${course_id}';
            DELETE FROM Module WHERE course_id = '${course_id}';
            DELETE FROM Course WHERE course_id = '${course_id}';
        `
        return db.query(query)
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
}