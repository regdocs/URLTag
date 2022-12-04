import { Query } from "express-serve-static-core";
import { Request, Response, Router } from "express";
import { mongoConfig } from "./config/mongodb";
import { log_error } from "./logger";

interface TypedQueryRequest<T extends Query> extends Request {
    query: T;
}

export const router: Router = require("express").Router();

router.get(
    "/:batch_name",
    async (
        req: TypedQueryRequest<{ batch_name: string; k: string }>,
        res: Response<any>
    ) => {
        try {
            req.query.batch_name = Buffer.from(req.params.batch_name, "hex").toString("utf-8");
            const mongoClient = mongoConfig.getMongoClient();

            await mongoClient
                .db("test")
                .collection<any>("batches")
                .updateOne(
                    { _id: req.query.batch_name },
                    {
                        $inc: { [req.query.k]: 1 },
                    }
                );

            const imgTag = `
                iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9
                kT1Iw0AcxV9TxVIqDs0g4pChOlkQFXHUKhShQqgVWnUwufQLmrQkKS6OgmvBwY/FqoOLs64OroIg
                +AHi6uKk6CIl/i8ptIjx4Lgf7+497t4BQrPCdKtnHNAN20wnE1I2tyr1vSIIEWFEEVKYVZuT5RR8
                x9c9Any9i/Ms/3N/jn4tbzEgIBHPspppE28QT2/aNc77xCIrKRrxOfGYSRckfuS66vEb56LLAs8U
                zUx6nlgklopdrHYxK5k68RRxTNMNyheyHmuctzjrlTpr35O/MJI3Vpa5TnMYSSxiCTIkqKijjAps
                xGk1SLGQpv2Ej3/I9cvkUslVBiPHAqrQobh+8D/43a1VmJzwkiIJoPfFcT5GgL5doNVwnO9jx2md
                AMFn4Mro+KtNYOaT9EZHix0BA9vAxXVHU/eAyx1g8KmmmIorBWkKhQLwfkbflAOit0B4zeutvY/T
                ByBDXaVugINDYLRI2es+7w519/bvmXZ/PwfecnxC2yniAAAACXBIWXMAAC4jAAAuIwF4pT92AAAA
                B3RJTUUH5wMUChMrn4oGhgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAM
                SURBVAjXY/j//z8ABf4C/tzMWecAAAAASUVORK5CYII=
            `;

            const img = Buffer.from(imgTag, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length,
            });
            res.end(img);
        } catch (err) {
            if (typeof err === "string") {
                console.error(err);
            } else if (err instanceof Error) {
                log_error(err, res);
            }
        }
    }
);
