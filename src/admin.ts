import { Router, Request } from "express";
import { mongoConfig } from "./config/mongodb";
import { log_error } from "./logger";

export const router: Router = require("express").Router();

router.get("/", async (req, res) => {
    try {
        if (req.query.auth_token !== process.env.AUTH_TOKEN) {
            res.status(403).json({
                success: false,
                message: process.env.AUTH_TOKEN, //"AUTH_TOKEN invalid",
            });
            return;
        }

        const mongoClient = mongoConfig.getMongoClient();

        const payload = await mongoClient
            .db("test")
            .collection<any>("batches")
            .find()
            .project({ _id: 1 });

        var payload_actual: string[] = [];
        await (
            await payload.toArray()
        ).forEach((doc) => payload_actual.push(doc._id));

        if (!payload_actual.length) {
            res.json({
                success: false,
                message: "no batches found to report",
                payload: [],
            });
            return;
        }

        res.json({
            success: true,
            message: `${payload_actual.length} batch(es) found`,
            payload: payload_actual
        });
    } catch (err) {
        if (typeof err === "string") {
            console.error(err);
        } else if (err instanceof Error) {
            log_error(err, res);
        }
    }
});

router.get(
    "/:batch_name",
    async (
        req: Request<
            {
                batch_name: string;
                auth_token: string;
            },
            any,
            any,
            any
        >,
        res
    ) => {
        try {
            if (req.query.auth_token !== process.env.AUTH_TOKEN) {
                res.status(403).json({
                    success: false,
                    message: "AUTH_TOKEN invalid",
                });
                return;
            }

            req.query.batch_name = req.params.batch_name;
            const mongoClient = mongoConfig.getMongoClient();

            const payload = await mongoClient
                .db("test")
                .collection("batches")
                .findOne({ _id: req.query.batch_name });

            if (payload == null) {
                console.log(req.query.batch_name)
                res.status(404).json({
                    success: false,
                    message: "404! Batch not found in cluster",
                    payload: [],
                });
                return;
            }

            res.json({
                success: true,
                message: "OK",
                payload: payload,
            });
        } catch (err) {
            if (typeof err === "string") {
                console.error(err);
            } else if (err instanceof Error) {
                log_error(err, res);
            }
        }
    }
);
