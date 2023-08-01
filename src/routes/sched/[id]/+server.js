import clientPromise from '$lib/db.js';
import { compile } from "handlebars"
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { env } from '$env/dynamic/private';
const __filename = fileURLToPath(import.meta.url);

const CWD = path.join(path.dirname(__filename));
const template = compile(readFileSync(path.join(CWD, "template.html"), "utf-8"));

const renderImage = async (html) => {
    const resp = await fetch(`${env.SECRET_SCREENSHOT_SERVER}`, {
        method: "POST",
        body: JSON.stringify({
            html: Buffer.from(html, "utf-8").toString("base64"),
        }),
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": `Bearer ${env.SECRET_SCREENSHOT_SERVER_TOKEN}`
        }
    });

    const image = await resp.blob();
    return image;
}

export async function GET({ locals, params }) {
	console.log('get schedshare')

	

    const dbCon = await clientPromise;
	const db = dbCon.db();
	const collection = await db.collection("schedules");

	const id = params["id"];
    const match = await collection.findOne({
        _id: id,
    });

    if (!match) {
        return new Response({
            error: "invalid id",
        }, {
            status: 404,
        });
    }

    const mapTeacher = (teacher) => {
        let ref = teacher;
        if (!ref) {
            ref = {

            } 
        }
        return {
            name: (ref?.name) || "Prof. ?",
            email: ref?.email,
            id: ref?.id,
        };
    }
    console.log(match);
    const html = template({
        theme: "light",
        classes: (match.classes || []).map((c) => {
            return {
                name: (c?.name) || "Course",
                period: (c?.period) || "?",
                room: (c?.room) || "Rm. ?",
                teacher: mapTeacher(c.teacher),
            }
        }),
        term: (match?.termName) || "",
        title: "AVHS",
        logo: "Logo?",
        header: "Here's my schedule!",

    });

    const image = await renderImage(html);

	return new Response(image, {
		status: 200,
        headers: {
            "Content-Type": "image/png"
        }
	});
}
