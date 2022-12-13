import { Request, Response, Router } from "express";
import { log_error } from "./logger";

export const router: Router = require("express").Router();

router.get("/", async (req: Request<any>, res: Response<any>) => {
    try {
        res.status(200).send("OK");
    } catch (err) {
        if (typeof err === "string") {
            console.error(err);
        } else if (err instanceof Error) {
            log_error(err, res);
        }
    }
});
