import { login } from 'studentvue.js'
import * as cookie from 'cookie'
import { parseStringPromise } from "xml2js"
import { env } from '$env/dynamic/private'
import crypto from "crypto";
import { MongoClient, ServerApiVersion } from "mongodb";

export async function GET({ locals }) {
	console.log('get schedshare')

	let result;

    const client = new MongoClient(env.MONGO_DB_URL, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });

	try {
		let client = await login(
			Buffer.from(locals.user.districtUrl, 'base64').toString('ascii'),
			Buffer.from(locals.user.username, 'base64').toString('ascii'),
			Buffer.from(locals.user.password, 'base64').toString('ascii'),
			parseStringPromise,
		)
		// let student = JSON.parse(await client.getStudentInfo()).StudentInfo
		// let gradebook = JSON.parse(await client.getGradebook()).Gradebook
		result = await Promise.all([
			client.getStudentInfo().then(async (value) =>
				{
					console.log(value);
					return (await parseStringPromise(value)).StudentInfo;
				}
			),
		])

		if (!result[0]) {
			throw new Error('No data returned')
		}
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

	
    // const sha512_384 = CryptoJS.algo.sha512_384.create();
	// const pepper = 
	// sha512_384.update(locals.user.username);
	// sha512_384.update()
	const hashAlgo = crypto.createHash("sha3-512");
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
}
