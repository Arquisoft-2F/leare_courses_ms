import express, { response } from "express";
import type { Request, Response } from "express";
import * as CourseService from "../services/course"

export const CourseRouter = express.Router()

CourseRouter.get("/modules/:id/files", async(req:Request, res: Response) => {
    try{
        const id = req.params.id
        const response = await CourseService.getModuleFiles(id)
        res.status(200)
        res.send(response.rows[0])
    }catch(error){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error",
            "error":error
        })
    }
})

CourseRouter.get("/courses/:id/files", async(req:Request, res: Response) => {
    try{
        const id = req.params.id
        const response = await CourseService.getCourseFiles(id)
        res.status(200)
        res.send(response.rows[0])
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
            "message": "error"
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
            "message": "error"
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
            "message": "error"
        })
    }
})

CourseRouter.post("/courses", async (req:Request, res: Response) =>{
    try{
        const course_name = req.body.course_name
        const course_description = req.body.course_description
        const creator_id = req.body.creator_id
        const picture_id = req.body.picture_id
        const categories = req.body.categories
        const response = await CourseService.createCourse(course_name,course_description,creator_id,picture_id,categories)
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
            "message": "error"
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
            "message": "error"
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
            "message": "error"
        })
    }
})

