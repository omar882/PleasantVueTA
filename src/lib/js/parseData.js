import { getColor, fourToPercent, percentToLetter } from './utils.js'
import calendar from "$lib/data/calendar.json";
import { format } from "date-fns";

export function parseData(session, oldAssignments) {
	window.session = session;
	for (let period of session.periods) {	
		let grades = []
		let assignments = []
		// console.log(period);
		const Course_S = [...period.Courses[0].Course]

		Course_S.forEach((course, idx) => {
			// console.log(course)
			course.$.Title = course.$.Title.replace(/ \([\s\S]*?\)/g, '')
			course.index = idx
			course.chartData = []

			course.fourPoint = false
			if (course.Marks[0].Mark && course.Marks[0].Mark[0].$.CalculatedScoreString !== 'N/A') {
				if (
					course.Marks[0].Mark[0].Assignments[0].Assignment[0] &&
					Array.isArray(course.Marks[0].Mark[0].Assignments[0].Assignment[0]) &&
					course.Marks[0].Mark[0].Assignments.Assignment[0].ScoreType === 'Rubric 0-4'
				) {
					course.fourPoint = true
				}
			}

			if (course.Marks[0].Mark[0] && course.Marks[0].Mark[0].Assignments[0].Assignment[0]) {
				// if (!Array.isArray(course.Marks[0].Mark[0].Assignments[0].Assignment)) {
				// 	course.Marks[0].Mark[0].Assignments.Assignment = [
				// 		course.Marks[0].Mark[0].Assignments.Assignment[0]
				// 	]
				// } // new xml2js = always array

				course.scoreTypes = {}
				if (course.Marks[0].Mark[0].GradeCalculationSummary[0].AssignmentGradeCalc) {
					for (let type of course.Marks[0].Mark[0].GradeCalculationSummary[0]
						.AssignmentGradeCalc) {
						if (parseInt(type.$.Weight) !== 100.0) {
							course.scoreTypes[type.$.Type] = {
								score: 0,
								total: 0,
								weight: parseInt(type.$.Weight)
							}
						}
					}
				} else {
					course.scoreTypes.All = {
						score: 0,
						total: 0,
						weight: 100
					}
				}
				[...course.Marks[0].Mark[0].Assignments[0].Assignment].reverse().forEach((assignment, aidx) => {
					// console.log(assignment)
					assignment.$.Measure = assignment.$.Measure.replace('&amp;', '&')
					assignment.course = course.Title
					assignment.courseIndex = idx
					assignment.style = null
					assignment.scorePercent = -1
					if (assignment.$.Points?.includes?.('Points Possible')) {
						assignment.percent = '?'
						assignment.score = 'Not Graded'
					} else {
						assignment.percent = '-'
						assignment.score = assignment.$.Points
					}
					if (oldAssignments) {
						if (assignment.new !== true) {
							assignment.new = !oldAssignments.has(assignment.$.GradebookID)
						}
						oldAssignments.add(assignment.$.GradebookID)
					}

					if (assignment.$.Points?.includes?.(' / ') || assignment.edited) {
						if (assignment.$.Points?.includes?.(' / ')) {
							let split = assignment.$.Points.split(' / ')
							assignment.$.PointsOriginal = parseFloat(split[0])
							assignment.totalOriginal = parseFloat(split[1])
							if (!assignment.edited) {
								assignment.$.Points = assignment.$.PointsOriginal
								assignment.total = assignment.totalOriginal
							}
						}
						assignment.score = assignment.$.Points + ' / ' + assignment.total

						if (
							(assignment.$.Points === 0 && assignment.total === 0) ||
							assignment.$.Notes.toLowerCase().includes('not for grading')
						) {
							assignment.scorePercent = -1
							assignment.percent = '-'
						} else {
							assignment.scorePercent = (assignment.$.Points / assignment.total) * 100
							assignment.percent = assignment.scorePercent
								? assignment.scorePercent.toFixed(1) + '%'
								: '0.0%'

							if (course.Marks[0].Mark[0].GradeCalculationSummary[0].AssignmentGradeCalc) {
								if (course.scoreTypes[assignment.Type]) {
									course.scoreTypes[assignment.Type].score += assignment.$.Points
									course.scoreTypes[assignment.Type].total += assignment.total
								}
							} else {
								course.scoreTypes.All.score += assignment.$.Points
								course.scoreTypes.All.total += assignment.total
							}

							let date = new Date(assignment.$.DueDate)
							let scoreSum = 0
							let totalSum = 0

							for (let type of Object.values(course.scoreTypes)) {
								if (type.total > 0) {
									scoreSum += (type.score / type.total) * type.weight
									totalSum += type.weight
								}
							}

							let color = getColor((scoreSum / totalSum) * 100)
							let grade = (scoreSum / totalSum) * (course.fourPoint ? 4 : 100)

							if (
								course.chartData.length > 0 &&
								course.chartData[course.chartData.length - 1].x ===
									Math.floor(date / 8.64e7)
							) {
								course.chartData[course.chartData.length - 1].y = grade
								course.chartData[course.chartData.length - 1].color = color
							} else {
								course.chartData.push({
									x: Math.floor(date / 8.64e7),
									y: grade,
									color: color
								})
							}
						}
						assignment.style = `color: ${getColor(assignment.scorePercent)};`
					}
					assignments.push(assignment)
				})
				// for (let assignment of new Array(course.Marks[0].Mark[0].Assignments[0].Assignment.reverse())) {
				// 	console.log(assignment)
				// 	assignment.$.Measure = assignment.$.Measure.replace('&amp;', '&')
				// 	assignment.course = course.Title
				// 	assignment.courseIndex = index
				// 	assignment.style = null
				// 	assignment.scorePercent = -1
				// 	if (assignment.$.Points?.includes?.('Points Possible')) {
				// 		assignment.percent = '?'
				// 		assignment.score = 'Not Graded'
				// 	} else {
				// 		assignment.percent = '-'
				// 		assignment.score = assignment.$.Points
				// 	}
				// 	if (oldAssignments) {
				// 		if (assignment.new !== true) {
				// 			assignment.new = !oldAssignments.has(assignment.GradebookID)
				// 		}
				// 		oldAssignments.add(assignment.GradebookID)
				// 	}

				// 	if (assignment.$.Points?.includes?.(' / ') || assignment.edited) {
				// 		if (assignment.$.Points?.includes?.(' / ')) {
				// 			let split = assignment.$.Points.split(' / ')
				// 			assignment.$.PointsOriginal = parseFloat(split[0])
				// 			assignment.totalOriginal = parseFloat(split[1])
				// 			if (!assignment.edited) {
				// 				assignment.$.Points = assignment.$.PointsOriginal
				// 				assignment.total = assignment.totalOriginal
				// 			}
				// 		}
				// 		assignment.score = assignment.$.Points + ' / ' + assignment.total

				// 		if (
				// 			(assignment.$.Points === 0 && assignment.total === 0) ||
				// 			assignment.$.Notes.toLowerCase().includes('not for grading')
				// 		) {
				// 			assignment.scorePercent = -1
				// 			assignment.percent = '-'
				// 		} else {
				// 			assignment.scorePercent = (assignment.$.Points / assignment.total) * 100
				// 			assignment.percent = assignment.scorePercent
				// 				? assignment.scorePercent.toFixed(1) + '%'
				// 				: '0.0%'

				// 			if (course.Marks[0].Mark[0].GradeCalculationSummary.AssignmentGradeCalc) {
				// 				if (course.scoreTypes[assignment.Type]) {
				// 					course.scoreTypes[assignment.Type].score += assignment.$.Points
				// 					course.scoreTypes[assignment.Type].total += assignment.total
				// 				}
				// 			} else {
				// 				course.scoreTypes.All.score += assignment.$.Points
				// 				course.scoreTypes.All.total += assignment.total
				// 			}

				// 			let date = new Date(assignment.DueDate)
				// 			let scoreSum = 0
				// 			let totalSum = 0

				// 			for (let type of Object.values(course.scoreTypes)) {
				// 				if (type.total > 0) {
				// 					scoreSum += (type.score / type.total) * type.weight
				// 					totalSum += type.weight
				// 				}
				// 			}

				// 			let color = getColor((scoreSum / totalSum) * 100)
				// 			let grade = (scoreSum / totalSum) * (course.fourPoint ? 4 : 100)

				// 			if (
				// 				course.chartData.length > 0 &&
				// 				course.chartData[course.chartData.length - 1].x ===
				// 					Math.floor(date / 8.64e7)
				// 			) {
				// 				course.chartData[course.chartData.length - 1].y = grade
				// 				course.chartData[course.chartData.length - 1].color = color
				// 			} else {
				// 				course.chartData.push({
				// 					x: Math.floor(date / 8.64e7),
				// 					y: grade,
				// 					color: color
				// 				})
				// 			}
				// 		}
				// 		assignment.style = `color: ${getColor(assignment.scorePercent)};`
				// 	}
				// 	assignments.push(assignment)
				// }

				let totalWeight = 0
				for (let type of Object.values(course.scoreTypes)) {
					if (type.total === 0) {
						type.weight = 0
					}
					totalWeight += type.weight
				}
				for (let type of Object.values(course.scoreTypes)) {
					type.weight = ((type.weight / totalWeight) * 100).toFixed(1)
					let percent = type.total ? type.score / type.total : 0
					type.scorePercent = (percent * type.weight).toFixed(1)
					type.color = type.style = `color: ${percent ? getColor(percent * 100) : 0};`
				}
			}

			course.scorePercent = -1
			course.score = '-'
			course.scoreString = course.Marks[0].Mark[0] ? course.Marks[0].Mark[0].CalculatedScoreString : 'N/A'
			if (course.chartData.length > 0) {
				course.scorePercent = course.chartData[course.chartData.length - 1].y
				course.score = course.scorePercent.toFixed(1)
				if (course.fourPoint) {
					course.scorePercent = fourToPercent(course.scorePercent)
				} else {
					course.score += '%'
				}
				grades.push(course.scorePercent)
				course.scoreString = percentToLetter(course.scorePercent)
			}
			course.color = getColor(course.scorePercent)
			course.style = `color: ${course.color};`
		});

		let averageRaw = -1
		if (grades.length > 0) averageRaw = grades.reduce((a, b) => a + b) / grades.length

		period.averageStyle = `color: ${getColor(averageRaw)};`
		period.average = averageRaw >= 0 ? averageRaw.toFixed(1) + '%' : '-'

		period.days = getDaysLeft(new Date(period.ReportingPeriod[0].$.EndDate))
		assignments.sort((a, b) => new Date(b.DueDate) - new Date(a.DueDate))
		period.assignments = assignments
		period.week = getWeek(period.assignments)
	}
}

function getDaysLeft(date) {
	let currentDate = format(new Date(), "MM/dd/yyyy");
	let endDate = format(date, "MM/dd/yyyy");
	let start = Object.keys(calendar).indexOf(currentDate);
	let end = Object.keys(calendar).indexOf(endDate);
	let noSchool = 0;
	for (let i = start; i < end; i++) {
		if (calendar[Object.keys(calendar)[i]].noSchool) {
			noSchool++;
		}
	}
	return end - start - noSchool;
}

function getWeek(assignments) {
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const lastSunday = new Date(today.setDate(today.getDate() - today.getDay()))
	let week = assignments.filter((a) => {
		return new Date(a.$.DueDate) > lastSunday && a.scorePercent >= 0
	})
	let average = -1
	if (week.length > 0)
		average = (week.reduce((a, b) => a + b.scorePercent, 0) / week.length).toFixed(1)
	return {
		average: average >= 0 ? average + '%' : '-',
		averageStyle: `color: ${getColor(average)};`,
		length: week.length
	}
}
