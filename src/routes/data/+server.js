import { login } from '$lib/server/studentvue.js';
import * as cookie from 'cookie';
import { parseStringPromise } from "xml2js";
import { env } from "$env/dynamic/private";

export async function GET({ locals }) {
	console.log('get data')

	let result;

	try {
		let client = await login(
			env.PRIVATE_SYNERGY_BACKEND,
			Buffer.from(locals.user.username, 'base64').toString('ascii'),
			Buffer.from(locals.user.password, 'base64').toString('ascii'),
			{}, parseStringPromise,
		)
		// let student = JSON.parse(await client.getStudentInfo()).StudentInfo
		// let gradebook = JSON.parse(await client.getGradebook()).Gradebook
		result = await Promise.all([
			client.getStudentInfo().then(async (value) =>
				{
					return value.StudentInfo;
				}
			),
			client.getGradebook(0).then(async (value) =>
				{
					return value.Gradebook;
				}
			)
		])
		console.log(result);
		
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

	console.log('logged in');

	

	return new Response(
		JSON.stringify({
			student: result.shift(),
			periods: result,
			currentPeriod: 0,
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	)
}
