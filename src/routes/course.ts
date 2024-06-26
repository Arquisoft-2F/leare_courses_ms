import express, { response } from "express";
import type { Request, Response } from "express";
import * as CourseService from "../services/course"

export const CourseRouter = express.Router()

CourseRouter.get("/sections/:id/creator", async(req:Request, res: Response) => {
    try{
        const id = req.params.id
        const response = await CourseService.getCreatorFromSection(id)
        
        if(response.rows.length > 0){
            res.status(200)
            res.send(response.rows[0])
        }else{
            res.status(404)
            res.json({
                "message": "error",
                "error":"no existe una seccion con el id especificado"
            })
        }
        
    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error obteniendo el creador del curso",
            "error":error
        })
    }
})

CourseRouter.get("/modules/:id/creator", async(req:Request, res: Response) => {
    try{
        const id = req.params.id
        const response = await CourseService.getCreatorFromModule(id)
        
        if(response.rows.length > 0){
            res.status(200)
            res.send(response.rows[0])
        }else{
            res.status(404)
            res.json({
                "message": "error",
                "error":"no existe un modulo con el id especificado"
            })
        }
        
    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error obteniendo el creador del curso",
            "error":error
        })
    }
})

CourseRouter.get("/modules/:id/files", async(req:Request, res: Response) => {
    try{
        const id = req.params.id
        const response = await CourseService.getModuleFiles(id)
        
        
        if(response.rows[0].all_files.length > 0){
            res.status(200)
            res.send(response.rows[0])
        }else{
            res.status(404)
            res.json({
                "message": "error obteniendo el arreglo de archivos",
                "error":"no existe un modulo con el id especificado"
            })
        }

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error obteniendo el arreglo de archivos",
            "error":error
        })
    }
})

CourseRouter.get("/courses/:id/files", async(req:Request, res: Response) => {
    try{
        const id = req.params.id
        const response = await CourseService.getCourseFiles(id)
        console.log(response.rows[0].all_files)

        if(response.rows[0].all_files == null){
            res.status(404)
            res.json({
                "message": "error obteniendo el arreglo de archivos",
                "error":"no existe un curso con el id especificado"
            })
        }else{
            res.status(200)
            res.send(response.rows[0])
        }

    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error",
            "error":error
        })
    }
})


CourseRouter.get("/courses/categories", async(req:Request, res: Response) => {
    try{
        const categories = req.body.categories
        const response = await CourseService.coursesByCategory(categories)
        res.status(200)
        res.send(response.rows)
    }catch(error){
        res.status(500)
        res.json({
            "message": "error obteniendo cursos por categoria",
            "error": error
        })
    }
})

CourseRouter.get("/listcourses/:page", async (req:Request, res: Response) =>{
    try{
        const page = parseInt(req.params.page)
        const response = await CourseService.listCourses(page)
        res.status(200)
        res.send(response.rows)
    }catch(error:any){
        res.status(500)
        res.json({
            "message": "error obteniendo cursos",
            "error": error
        })
    }
})

CourseRouter.get("/courses/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id
        const response = await CourseService.getCourse(req.params.id)

        if (!response.rows[0]){
            res.status(404)
            res.json({
                "message": "not found"
            })
        }else{
            res.status(200)
            res.send(response.rows[0])
        }

    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error obteniendo curso por id",
            "error": error
        })
    }
})

CourseRouter.post("/courses", async (req:Request, res: Response) =>{
    try{
        const course_name = req.body.course_name
        const course_description = req.body.course_description
        const creator_id = req.body.creator_id
        const chat_id = req.body.chat_id
        const picture_id = req.body.picture_id
        const categories = req.body.categories
        const response = await CourseService.createCourse(course_name,course_description,creator_id,chat_id,picture_id,categories)
        // console.log(response)
        res.status(201)
        res.send(response.rows[0])
        // res.json({
        //     "message": "created successfully"
        // })
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error creando curso",
            "error": error
        })
    }
})

CourseRouter.patch("/courses/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id;
        const courseEdit = req.body
        const response = await CourseService.editCourse(id,courseEdit)
        res.status(200)
        res.send(response.rows[0])
        // res.json({
        //     "message": "edited successfully"
        // })
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error editando curso",
            "error": error
        })
    }
})

CourseRouter.delete("/courses/:id", async (req:Request, res: Response) =>{
    try{
        const course_id = req.params.id;
        await CourseService.deleteCourse(course_id)
        res.status(200)
        res.json({
            "message":"deleted successfully"
        })
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error eliminando curso",
            "error": error
        })
    }
})

