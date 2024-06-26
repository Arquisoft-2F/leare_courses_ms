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

export const getCreatorFromSection = async(section_id : string):Promise<any> => {
    const query = `
        SELECT c.creator_id
        FROM section s
        JOIN module m ON s.module_id = m.module_id
        JOIN course c ON m.course_id = c.course_id
        WHERE s.section_id = $1;
    `
    return db.query(query, [section_id])
}

export const getCreatorFromModule = async(module_id : string):Promise<any> => {
    const query = `
        SELECT c.creator_id
        FROM module m
        JOIN course c ON m.course_id = c.course_id
        WHERE m.module_id = $1;
    `
    return db.query(query, [module_id])
}

export const getModuleFiles = async(module_id : string):Promise<any> => {
    const query = `
    SELECT CASE 
         WHEN COUNT(subquery.section_id) > 0 THEN array_agg(subquery.elements) 
         ELSE '{}' 
       END AS all_files
    FROM (
        SELECT s.section_id, unnest(COALESCE(s.files_array, '{}') || ARRAY[CAST(s.video_id AS TEXT)]) AS elements
        FROM module m
        LEFT JOIN section s ON m.module_id = s.module_id
        WHERE m.module_id = $1
    ) AS subquery;
    `
    return db.query(query, [module_id])
}

export const getCourseFiles = async(course_id : string):Promise<any> => {
    const query = `
    SELECT array_agg(elements) AS all_files
    FROM (
        SELECT CAST(c.picture_id AS TEXT) AS elements
        FROM course c
        WHERE c.course_id = $1
        
        UNION ALL
        
        SELECT unnest(array[CAST(s.video_id AS TEXT)] || COALESCE(s.files_array, '{}')) AS elements
        FROM course c
        JOIN module m ON c.course_id = m.course_id
        JOIN section s ON m.module_id = s.module_id
        WHERE c.course_id = $1
    ) AS combined
    WHERE elements IS NOT NULL;
    `
    return db.query(query, [course_id])
}

export const coursesByCategory = async(categories:Array<string>):Promise<any> => {
    const query = `
    SELECT
    c.course_id,
    c.course_name,
    c.course_description,
    c.creator_id,
    c.chat_id,
    c.public,
    c.picture_id,
    c.created_at,
    c.updated_at,
    json_agg(json_build_object(
        'category_id', cat.category_id,
        'category_name', cat.category_name
    )) AS categories
    FROM
        Course c
    JOIN
        Course_Category cc ON c.course_id = cc.course_id
    JOIN
        Category cat ON cc.category_id = cat.category_id
    WHERE
        cat.category_id = ANY($1) -- Use the ANY operator to match any element in the array
    GROUP BY
        c.course_id
    ORDER BY
        c.course_name; -- or any other desired sorting criteria
    `
    return db.query(query, [categories])
}

export const getCourse = async (course_id: string):Promise<any> =>{
    const query = `
    SELECT 
        c.course_id,
        c.course_name,
        c.course_description,
        c.creator_id,
        c.chat_id,
        c.public,
        c.picture_id,
        c.created_at,
        c.updated_at,
        COALESCE(modules_json, '[]'::json) AS modules,
        COALESCE(categories_json, '[]'::json) AS categories
    FROM 
        Course c
    LEFT JOIN LATERAL (
        SELECT 
            json_agg(
                json_build_object(
                    'module_id', m.module_id,
                    'module_name', m.module_name,
                    'pos_index', m.pos_index,
                    'sections', COALESCE(sections_json, '[]'::json)
                )
            ) AS modules_json
        FROM 
            Module m
        LEFT JOIN LATERAL (
            SELECT 
                json_agg(
                    json_build_object(
                        'section_id', s.section_id,
                        'section_name', s.section_name,
                        'section_content', s.section_content,
                        'video_id', s.video_id,
                        'files_array', s.files_array,
                        'pos_index', s.pos_index
                    )
                ) AS sections_json
            FROM 
                Section s
            WHERE 
                s.module_id = m.module_id
        ) AS sections_agg ON true
        WHERE 
            m.course_id = c.course_id
    ) AS modules_agg ON true
    LEFT JOIN LATERAL (
        SELECT 
            json_agg(
                json_build_object(
                    'category_id', ct.category_id,
                    'category_name', ct.category_name
                )
            ) AS categories_json
        FROM 
            Category ct
        JOIN 
            Course_Category cc ON ct.category_id = cc.category_id
        WHERE 
            cc.course_id = c.course_id
    ) AS categories_agg ON true
    WHERE
        c.course_id = $1;
    `
    return db.query(query,[course_id])
}

export const listCourses = async (page:number): Promise<any> => {
    const rowsPerPage = 2
    const query = `
    SELECT 
    c.course_id,
    c.course_name,
    c.course_description,
    c.creator_id,
    c.chat_id,
    c.public,
    c.picture_id,
    c.created_at,
    c.updated_at,
    COALESCE(categories_json, '[]'::json) AS categories,
    COALESCE(modules_json, '[]'::json) AS modules
    FROM 
        Course c
    LEFT JOIN LATERAL (
        SELECT 
            json_agg(
                json_build_object(
                    'category_id', ct.category_id,
                    'category_name', ct.category_name
                )
            ) AS categories_json
        FROM 
            Category ct
        JOIN 
            Course_Category cc ON ct.category_id = cc.category_id
        WHERE 
            cc.course_id = c.course_id
    ) AS categories_agg ON true
    LEFT JOIN LATERAL (
        SELECT 
            json_agg(
                json_build_object(
                    'module_id', m.module_id,
                    'module_name', m.module_name,
                    'pos_index', m.pos_index,
                    'sections', COALESCE(sections_json, '[]'::json)
                )
            ) AS modules_json
        FROM 
            Module m
        LEFT JOIN LATERAL (
            SELECT 
                json_agg(
                    json_build_object(
                        'section_id', s.section_id,
                        'section_name', s.section_name,
                        'section_content', s.section_content,
                        'video_id', s.video_id,
                        'files_array', s.files_array,
                        'pos_index', s.pos_index
                    )
                ) AS sections_json
            FROM 
                Section s
            WHERE 
                s.module_id = m.module_id
        ) AS sections_agg ON true
        WHERE 
            m.course_id = c.course_id
    ) AS modules_agg ON true
    ORDER BY
        c.course_id  
    LIMIT 
        $2
    OFFSET 
        ($1 - 1) * $2; 
    `
    return db.query(query,[page,rowsPerPage])
}

export const createCourse = async (course_name:string,course_description:string,creator_id:string,chat_id:string,picture_id:string, categories:Array<string>): Promise<any> => {
    try{
        const query = `
            INSERT INTO Course 
                (course_name, course_description, creator_id,chat_id, public, picture_id, created_at, updated_at) 
            VALUES 
                ($1,$2,$3,$4,false,$5,CURRENT_DATE,CURRENT_DATE) 
            RETURNING *
        `

        const result = await db.query(query,[course_name,course_description,creator_id,chat_id,picture_id]);
        const assignedId = result.rows[0].course_id;

        categories.forEach(async category => {
            // let catIdQuery = await db.query(`SELECT category_id FROM Category WHERE category_name = '${category}'`)
            // let catId = catIdQuery.rows[0].category_id
            // console.log(catIdQuery)
            const query = `
                INSERT INTO Course_Category (course_id,category_id) VALUES ($1, $2)
            `
            await db.query(query,[assignedId,category])
        });

        return result
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
        let result: any = null;

        if(setClause){
            const updateCourseQuery = `
            UPDATE Course
            SET updated_at = CURRENT_DATE, ${setClause}
            WHERE course_id = $1
            RETURNING *
            `;
        
            result = await db.query(updateCourseQuery, [course_id,...values]);
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

            result = await db.query(`SELECT * FROM Course WHERE course_id = $1`,[course_id])
        }

        return result
    
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
        // const query = `
        //     DELETE FROM Course_Category WHERE course_id = $1;
        //     DELETE FROM Module WHERE course_id = $1;
        //     DELETE FROM Course WHERE course_id = $1;
        // `

        const query1 = `DELETE FROM Course_Category WHERE course_id = $1`;
        await db.query(query1, [course_id]);
        const query2 = `DELETE FROM Module WHERE course_id = $1`;
        await db.query(query2, [course_id]);
        const query3 = `DELETE FROM Course WHERE course_id = $1`;
        await db.query(query3, [course_id]);

        // return db.query(query,[course_id])
    }catch(error){
        await db.query('ROLLBACK');
        throw error
    }
}