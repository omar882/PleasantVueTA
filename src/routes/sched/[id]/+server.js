import clientPromise from '$lib/server/db.js';
import handlebars from "handlebars";
import { env } from '$env/dynamic/private';
import templateFile from "$lib/server/template.js";
const { compile } = handlebars;

const template = compile(templateFile);

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
	//console.log('get schedshare')

	

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
    //console.log(match);
    const html = template({
        theme: "light",
        classes: (match.classes || []).map((c) => {
            if (c?.period) {
                if (c.period == "0") {
                    c.period = "A"
                } else if (c.period == "10") {
                    c.period = "Ac"
                }
            }
            return {
                name: (c?.name) || "Course",
                period: (c?.period) || "?",
                room: (c?.room) || "Rm. ?",
                teacher: mapTeacher(c.teacher),
            }
        }),
        term: (match?.termName) || "",
        title: "2023-2024",
        logo: "PleasantVue",
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
