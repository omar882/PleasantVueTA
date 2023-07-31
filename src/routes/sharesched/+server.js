import { login } from 'studentvue.js'
import * as cookie from 'cookie'
import { parseStringPromise } from "xml2js"
import { env } from '$env/dynamic/private'
import { createHash, randomBytes } from "node:crypto";
import { promisify } from 'node:util';
import clientPromise from '$lib/db.js';

const createHashAsync = promisify(createHash);
const randomBytesAsync = promisify(randomBytes)


const hashMany = (many) => {
    const hash = createHash("sha256");
    for (const one of many) {
        hash.update(one);
    }
    return hash.digest();
};

const hashOne = (one) => hashMany([one]);


export async function GET({ locals }) {
	console.log('get schedshare')

	
	const ctx = {

	};

    const dbCon = await clientPromise;
	const db = dbCon.db();
	const collection = await db.collection("schedules");

	if (!("username" in locals.user) || !("password" in locals.user)) {
		return new Response({
            "error": "username and password fields required",
        }, {
			status: 400,
		});
    }
	ctx.username = Buffer.from(locals.user.username, 'base64').toString('ascii');
	ctx.password = Buffer.from(locals.user.password, 'base64').toString('ascii');

	const svue = await login(env.PRIVATE_SYNERGY_BACKEND, ctx.username, ctx.password, parseStringPromise); // cache this for perf?
    ctx.svue = svue;
    try {
        const sched = await svue.getSchedule(); // can we cache this?
        const parsedSched = await parseStringPromise(sched)
        ctx.sched = parsedSched;
    } catch (e) {
        console.log(e);
		return new Response({
			"error": "username or password fields are invalid",
            "note": "if this is wrong, please contact"
		}, {
			status: 403,
		});
    }

	try {
        const sched = ctx.sched["StudentClassSchedule"];
        const termName = sched?.$?.TermIndexName;
        const classListing = sched?.ClassLists[0]?.ClassListing;
        
        const classes = classListing.map(clazz => {
            const period = clazz?.$?.Period;
            const name = clazz?.$?.CourseTitle;
            const room = clazz?.$?.RoomName;
            const teacherName = clazz?.$?.Teacher;
            const teacherEmail = clazz?.$?.TeacherEmail;
            const teacherId = hashOne(clazz?.$?.TeacherStaffGU.toLowerCase()).toString("hex"); // for consistency in DB?
            const sectionId = hashOne(clazz?.$?.SectionGU.toLowerCase()).toString("hex");
            
            return {
                period, name, room, id: sectionId, teacher: {
                    name: teacherName,
                    email: teacherEmail,
                    id: teacherId,
                },
            };
        })
        ctx.classes = classes;
        ctx.termName = termName;
    

    } catch (e) {
        console.log(e);
		return new Response({
            "error": "could not parse schedule",
            "note": "if this continues, please contact",
        }, {
			status: 503,
		});
    }

    const salt = await randomBytesAsync(32);
    const pepper = Buffer.from(env.PRIVATE_PEPPER)
    const username = ctx.username;
    const digest = hashMany([salt, pepper, username]).toString("hex");
    const saltHex = salt.toString("hex");
    

    await collection.insertOne({
        _id: saltHex,
        digest: digest,
        classes: ctx.classes,
        termName: ctx.termName,

    })
	return new Response(JSON.stringify({
        id: saltHex,
        sched: ctx.classes,
    }), {
		status: 201,
		headers: {
			"Content-Type": "application/json",
		},
	});
	/**
	try {
		let client = await login(
			Buffer.from(locals.user.districtUrl, 'base64').toString('ascii'),
			Buffer.from(locals.user.username, 'base64').toString('ascii'),
			Buffer.from(locals.user.password, 'base64').toString('ascii'),
			parseStringPromise,
		);

		const sched = await client.getSchedule();


	} catch (error) {
		console.log(error)
		return new Response(null, {
			status: 401,
			headers: {
				'Set-cookie': cookie.serialize('auth', '', {
					httpOnly: true,
					sameSite: 'strict',
					path: '/',
					expires: new Date(0)
				})
			}
		})
	}

	console.log('logged in')

	
	const hashAlgo = crypto.createHash("sha256");
	hashAlgo.update(locals.user.username);
	hashAlgo.update(env.PRIVATE_PEPPER);
	const hash = hashAlgo.digest("hex");
    console.log(hash);

    try {
        await client.connect();

        const dbName = "schedules";
        const collectionName = "schedules-dev";

        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        const insertResult = await collection.insertOne({
            id: hash,
            schedule: [
                {
                    period: "A",
                    class: "ClassName",
                    teacher: "TeacherName",
                    room: "RoomNumber",
                },
            ]
        });

        return new Response(
            JSON.stringify({
                id: hash,
            }),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )


    } catch (e) {
        console.log(e)
		return new Response(null, {
			status: 503
		})
    } 
    finally {
        await client.close();
    }
	*/
}
