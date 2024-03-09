import express, { response } from "express";
import type { Request, Response } from "express";
import * as CategoryService from "../services/category"

export const CategoryRouter = express.Router()

CategoryRouter.get("/categories", async (req:Request, res: Response) =>{
    try{
        const response = await CategoryService.listCategories()
        res.status(200)
        res.send(response.rows)
    }catch(error:any){
        res.status(500)
        res.json({
            "message": "error"
        })
    }
})

CategoryRouter.get("/categories/:id", async (req:Request, res: Response) =>{
    try{
        const id = req.params.id
        const response = await CategoryService.getCategory(req.params.id)

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

CategoryRouter.post("/categories", async (req:Request, res: Response) =>{
    try{
        const category_name = req.body.category_name;
        // console.log(category_name)
        const response = await CategoryService.createCategory(category_name)
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

CategoryRouter.put("/categories/:id", async (req:Request, res: Response) =>{
    try{
        const category_name = req.body.category_name;
        const id = req.params.id
        const response = await CategoryService.editCategory(id,category_name)
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

CategoryRouter.delete("/categories/:id", async (req:Request, res: Response) =>{
    try{
        const category_id = req.params.id;
        const response = await CategoryService.deleteCategory(category_id)
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

