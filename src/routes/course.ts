import express, { response } from "express";
import type { Request, Response } from "express";
import * as CourseService from "../services/course"

export const CourseRouter = express.Router()

CourseRouter.get("/courses", async (req:Request, res: Response) =>{
    try{
        const response = await CourseService.listCourses()
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
        res.status(200)
        res.send(response.rows)
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
        await CourseService.createCourse(course_name,course_description,creator_id,picture_id,categories)
        // console.log(response)
        res.status(201)
        res.json({
            "message": "created successfully"
        })
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error"
        })
    }
})

CourseRouter.put("/courses/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id;
        const courseEdit = req.body
        const response = await CourseService.editCourse(id,courseEdit)
        res.status(200)
        res.json({
            "message": "edited successfully"
        })
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
        const response = await CourseService.deleteCourse(course_id)
        res.status(204)
        res.send()
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error"
        })
    }
})

