import { SqliteError } from "better-sqlite3";
import config from "./config.js";
import error from "./error.js";

export async function errorHandler(ctx, next) {
    try {
        await next();
    } catch (e) {
        console.log(e);
        if (e instanceof SqliteError) {
            error.sqlite.message = e.message;
            ctx.body = error.sqlite;
        } else if (!(e instanceof Error) && e.hasOwnProperty('code') && e.hasOwnProperty('message')) {
            ctx.body = e;
        } else {
            ctx.body = error.server;
        }
        ctx.status = parseInt(ctx.body.code / 1000000);
    }
}

export async function auth(ctx, next) {
    const token = ctx.header.authorization;
    config.auths.forEach(auth => {
        if (`Bearer ${auth.secretKey}` === token) {
            ctx.state.auth = auth;
        }
    });
    if (!ctx.state.auth) {
        throw error.auth.Unauthorized;
    }
    await next();
}