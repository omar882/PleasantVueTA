import { login } from 'studentvue.js'
import cookie from 'cookie'
import { parseStringPromise } from "xml2js"
import { env } from '$env/dynamic/private'

export async function POST({ request }) {
	console.log('post login')

	const body = await request.json();
	let result
	console.log(body);

	try {
		let client = await login(env.PRIVATE_SYNERGY_BACKEND, body.username, body.password, {}, parseStringPromise);
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
			// client.getGradebook(0).then((value) => JSON.parse(value).Gradebook),
			// client.getGradebook(1).then((value) => JSON.parse(value).Gradebook),
			// client.getGradebook(2).then((value) => JSON.parse(value).Gradebook),
			// client.getGradebook(3).then((value) => JSON.parse(value).Gradebook)
		]);
		console.log(result);

		if (!result[0]) {
			throw new Error('No data returned')
		}
	} catch (error) {
		console.log(error)
		return new Response(null, {
			status: 401
		})
	}
	const currentPeriod = 0;
	// result[1].ReportingPeriods[0].ReportPeriod -
	// 	1 -
	// 	result[1].ReportingPeriods[0].ReportPeriod.slice()
	// 		.reverse()
	// 		.findIndex((period) => {
	// 			return new Date() > new Date(period.StartDate)
	// 		})

	return new Response(
		JSON.stringify({
			student: result.shift(),
			periods: result,
			currentPeriod
		}),
		{
			headers: {
				'Set-Cookie': cookie.serialize(
					'auth',
					Buffer.from(body.username).toString('base64') +
						':' +
						Buffer.from(body.password).toString('base64'),
					{
						httpOnly: true,
						maxAge: 60 * 60 * 24 * 30,
						sameSite: 'strict',
						path: '/'
					}
				)
			}
		}
	)
}
