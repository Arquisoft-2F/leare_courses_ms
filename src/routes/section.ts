import express, { response } from "express";
import type { Request, Response } from "express";
import * as SectionService from "../services/section"

export const SectionRouter = express.Router()

SectionRouter.get("/modules/:module_id/sections/:page", async (req:Request, res: Response) =>{
    try{
        const module_id = req.params.module_id
        const page = parseInt(req.params.page)
        const response = await SectionService.listModuleSections(module_id,page)
        res.status(200)
        res.send(response.rows)
    }catch(error:any){
        console.log(error)
        res.status(500)
        res.json({
            "message": "error obteniendo secciones de modulo",
            "error": error
        })
    }
})

SectionRouter.get("/sections/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id
        const response = await SectionService.getSection(req.params.id)
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
            "message": "error obteniendo seccion",
            "error": error
        })
    }
})

SectionRouter.post("/sections", async (req:Request, res: Response) =>{
    try{
        
        const module_id = req.body.module_id
        const section_name = req.body.section_name
        const section_content = req.body.section_content
        const video_id = req.body.video_id
        const files_array = req.body.files_array
        const pos_index = req.body.pos_index

        const response = await SectionService.createSection(module_id, section_name, section_content, video_id, files_array, pos_index)
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
            "message": "error creando seccion",
            "error": error
        })
    }
})

SectionRouter.patch("/sections/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id;
        const sectionEdit = req.body
        const response = await SectionService.editSection(id,sectionEdit)
        res.status(200)
        res.send(response.rows[0])
        // res.json({
        //     "message": "edited successfully"
        // })
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error editando seccion",
            "error": error
        })
    }
})

SectionRouter.delete("/sections/:id", async (req:Request, res: Response) =>{
    try{
        const section_id = req.params.id;
        const response = await SectionService.deleteSection(section_id)
        res.status(200)
        res.json({
            "message":"deleted successfully"
        })
    }catch(error:any){
        res.status(500)
        console.log(error)
        res.json({
            "message": "error eliminando seccion",
            "error": error
        })
    }
})

