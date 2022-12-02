import { Query } from "express-serve-static-core";
import { Request, Response, Router } from "express";
import { mongoConfig } from "./config/mongodb";
import { log_error } from "./logger";
import crypto from "crypto";

interface TypedQueryRequest<T extends Query> extends Request {
    query: T;
}

interface BatchDictionary<T> {
    [key: string]: T;
}

export const router: Router = require("express").Router();

router.get(
    "/",
    async (
        req: TypedQueryRequest<{
            batch_name: string;
            nos: string;
            auth_token: string;
        }>,
        res: Response<any>
    ) => {
        try {
            if (req.query.auth_token !== process.env.AUTH_TOKEN) {
                res.status(403).json({
                    success: false,
                    message: "AUTH_TOKEN invalid",
                });
                return;
            }

            var batchDoc: BatchDictionary<any> = {};

            if (req.query.nos === undefined) req.query.nos = String(1);

            if (req.query.batch_name === undefined || req.query.batch_name === '')
                req.query.batch_name = `B${Date.now()}`;

            for (let i = 1; i <= parseInt(req.query.nos); i++)
                batchDoc[crypto.randomBytes(8).toString("hex")] = 0;

            batchDoc["_id"] = req.query.batch_name;

            const mongoClient = mongoConfig.getMongoClient();
            await mongoClient
                .db("test")
                .collection("batches")
                .insertOne(batchDoc);

            res.json({
                success: true,
                message: `${req.query.nos} tag(s) created...`,
                payload: {
                    batch_doc: batchDoc,

                    tags: ((arg = batchDoc): string[] => {
                        let links: string[] = [];

                        for (const [key, value] of Object.entries(arg)) {
                            if (key !== "_id") {
                                links.push(
                                    `${
                                        (process.env.URL_PREFIX ||
                                            "http://localhost:4000") +
                                        "/urltag/emit/"
                                    }${Buffer.from(arg._id).toString(
                                        "hex"
                                    )}?k=${key}`.trim()
                                );
                            }
                        }
                        return links;
                    })(),
                },
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
