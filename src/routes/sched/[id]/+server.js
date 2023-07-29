import clientPromise from '$lib/db.js';
import { compile } from "handlebars"
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import nodeImageToHtml from "node-html-to-image";
const __filename = fileURLToPath(import.meta.url);

const CWD = path.join(path.dirname(__filename));
const template = compile(readFileSync(path.join(CWD, "template.html"), "utf-8"));

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

    const image = await nodeImageToHtml({
        html: html,
    });
    

	return new Response(image, {
		status: 200,
        headers: {
            "Content-Type": "image/png"
        }
	});
}
