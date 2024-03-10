import express, { response } from "express";
import type { Request, Response } from "express";
import * as ModuleService from "../services/module"

export const ModuleRouter = express.Router()

ModuleRouter.get("/coursemodules/:course_id/:page", async (req:Request, res: Response) =>{
    try{
        const course_id = req.params.course_id
        const page = parseInt(req.params.page)
        const response = await ModuleService.listModules(course_id,page)
        res.status(200)
        res.send(response.rows)
    }catch(error:any){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error"
        })
    }
})

ModuleRouter.get("/modules/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id
        const response = await ModuleService.getModule(req.params.id)
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

ModuleRouter.post("/modules", async (req:Request, res: Response) =>{
    try{
        const module_name = req.body.module_name
        const course_id = req.body.course_id
        const pos_index = req.body.pos_index
        
        const response = await ModuleService.createModule(module_name,course_id,pos_index)
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

ModuleRouter.patch("/modules/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id;
        const moduleEdit = req.body
        const response = await ModuleService.editModule(id,moduleEdit)
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

ModuleRouter.delete("/modules/:id", async (req:Request, res: Response) =>{
    try{
        const module_id = req.params.id;
        const response = await ModuleService.deleteModule(module_id)
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

