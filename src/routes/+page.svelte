<script>
	import { session } from '$lib/stores/session.js'

	let date = new Date()
	let greeting = date.getHours() < 12 ? 'morning' : date.getHours() < 18 ? 'afternoon' : 'evening'
	let copiedOk = "";
	let shareLink = undefined;
	async function shareSched() {
		const resp = await fetch("/sharesched");
		const body = await resp.json();
		if (resp.status === 201) {
			let success = false;
			if (navigator.canShare && navigator.canShare()) {
				try {
					await navigator.share({
						title: "Schedule",
						text: "Here's my schedule!",
						url: `http://127.0.0.1:5173/sched/${body.id}`
					});
					success = true;
				} catch (ignored) {}
			}
			if (!success) {
				try {
					await navigator.clipboard.writeText(`http://127.0.0.1:5173/sched/${body.id}`)
					copiedOk = "Copied to clipboard!";
					success = true;
				} catch (ignored) {
					copiedOk = false;
					shareLink = `http://127.0.0.1:5173/sched/${body.id}`;
				}
			}
			
		}
	}
</script>

<svelte:head>
	<title>Gradenight</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<h1>Good {greeting}, {$session.student.FormattedName[0].split(' ')[0]}!</h1>
	<div class="grid-heading-container">
		<img alt="profile" src={'data:image/jpeg;base64,' + $session.student.Photo[0]} />
		<h1>{$session.student.FormattedName[0].split(' ')[0]}</h1>
	</div>
	<div class="school value">
		<h2>School</h2>
		<div class="value-label">{$session.student.CurrentSchool}</div>
	</div>
	<div class="average value">
		<h1 style={$session.gradebook.averageStyle}>
			{$session.gradebook.average}
		</h1>
		<div class="value-label">Average grade<br />&nbsp;</div>
	</div>
	<div class="improvement value">
		<h1 style={$session.gradebook.week.averageStyle}>
			{$session.gradebook.week.average}
		</h1>
		<div class="value-label">Average grade<br />this week</div>
	</div>
	<div class="week-assignments value">
		<h1>{$session.gradebook.week.length}</h1>
		<div class="value-label">
			{$session.gradebook.week.length === 1 ? 'Assignment' : 'Assignments'}
			<br />this week
		</div>
	</div>
	<!-- <div class="grades">
		<h2>Schedule</h2>
		<div>
			<button on:click={shareSched}>Share My Schedule</button>
			<div>{ copiedOk }</div>
		</div>
		<table class="grades-table">
			{#each $session.gradebook.Courses[0].Course as course, index}
				<div class="row-link">
					<td class="course-name">{course.$.Title}</td>
					<td class="course-teacher">{course.$.Staff}</td>
					<td class="course-room">{course.$.Room}</td>
					<td class="course-period">{course.$.Period}</td>
				</div>
			{/each}
		</table>
	</div> -->
	<div class="grades">
		<a class="link" href="/grades"><h2>Courses</h2></a>
		<table class="grades-table">
			{#each $session.gradebook.Courses[0].Course as course, index}
				<a class="row-link" href={'/course/' + index}>
					<td class="course-name">{course.$.Title}</td>
					<td class="course-grade" style={course.style}>{course.scoreString}</td>
					<td class="course-score" style={course.style}>{course.score}</td>
				</a>
			{/each}
		</table>
	</div>
	<div class="assignments">
		<div class="assignments-scroll">
			<a class="link" href="/assignments"><h2>Assignments</h2></a>
			<table class="assignments-table">
				{#each $session.gradebook.assignments as assignment}
					{#if assignment.scorePercent >= 0}
						<tr class={assignment.fake || assignment.edited ? 'fake' : ''}>
							<td
								class="assignment-name"
								style={assignment.new ? 'font-weight: bold;' : ''}
							>
								{assignment.$.Measure}
							</td>
							<td class="assignment-score" style={assignment.style}>
								{assignment.score}
							</td>
						</tr>
					{/if}
				{/each}
			</table>
		</div>
	</div>
</div>

<style lang="scss">
	.layout {
		display: grid;
		height: 100%;
		width: 100%;
		gap: $spacing;
		grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
		grid-template-rows: auto auto 1fr;
	}

	h1 {
		@include nowrap;
		grid-column: 1 / 5;
		margin-bottom: 0px;
	}

	.grid-heading-container {
		display: none;
	}

	.value {
		@include box;
		text-align: center;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		font-size: 0.9em;
		padding: 0;
		h1, h2 {
			margin-top: auto;
			margin-bottom: $spacing-small;
		}
		div {
			margin-bottom: auto;
		}
	}

	.grades {
		@include box;
		grid-column: 1 / 5;
	}

	.assignments {
		@include box;
		padding: 0;
		grid-column: 5;
		grid-row: 1 / 4;
		overflow: hidden;
	}

	.assignments-scroll {
		height: 100%;
		overflow-y: auto;
		scrollbar-color: var(--bg-color-2-5) transparent;
		padding: $spacing;
	}

	.grades-table {
		height: calc(100% - 2 * $spacing);
	}

	.row-link {
		display: table-row;
		text-decoration: none;

		td:first-child {
			border-radius: $roundness-small 0 0 $roundness-small;
		}
		td:last-child {
			border-radius: 0 $roundness-small $roundness-small 0;
		}
		&:hover td {
			background: var(--bg-color-1-5);
		}
		&:active td {
			background: var(--bg-color-1);
		}
	}

	td {
		padding: $spacing-small;
		vertical-align: middle;
	}

	.course-period {
		text-align: right;
	}

	.assignments-table {
		table-layout: fixed;
		width: 100%;
	}

	.assignments-table td {
		padding-top: $spacing-small;
		padding-bottom: $spacing-small;
	}

	.assignment-name {
		@include nowrap;
	}

	.assignment-score {
		width: 80px;
		text-align: right;
		padding-left: 0;
	}

	.course-teacher {
		padding: 0;
		font-weight: bold;
	}

	// @media (max-height: 650px) {
	// 	.value {
	// 		display: none;
	// 	}
	// 	.grades {
	// 		grid-row: 2/4;
	// 	}
	// }

	@media (max-width: 950px) {
		.layout {
			grid-template-columns: 1fr 1fr 1fr 1.75fr;
		}
		.week-assignments {
			display: none;
		}
		h1 {
			grid-column: 1 / 4;
		}
		.assignments {
			grid-column: 4;
		}
		.grades {
			grid-column: 1 / 4;
		}
	}

	@media (max-width: 750px) {
		.layout {
			grid-template-columns: 1fr 1fr 1fr;
		}
		.improvement {
			display: flex;
		}
		.assignments {
			display: none;
		}
		h1 {
			grid-column: 1 / 4;
		}
		.grades {
			grid-column: 1 / 4;
		}
	}

	@media (max-width: $breakpoint-phone) {
		.layout {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto auto 1fr;
		}

		.layout > h1 {
			display: none;
		}

		.grid-heading-container {
			display: flex;
			grid-column: 1 / 3;
			margin-bottom: 0;
			align-items: center;
		}

		img {
			width: 50px;
			height: 50px;
			object-fit: cover;
			object-position: 0 0;
			border-radius: 50px;
			margin-right: $spacing-small;
		}

		h1 {
			margin-top: 0;
		}

		.grades {
			grid-column: 1 / 3;
		}

		.grades-table {
			table-layout: fixed;
			td {
				@include nowrap;
			}
			.course-teacher {
				width: min-content;
			}
			.course-period {
				width: 75px;
			}
		}

		.week-assignments,
		.improvement,
		.assignments {
			display: none;
		}

		@media (max-height: 700px) {
			.value {
				display: none;
			}

			.grades {
				grid-row: 2 / 4;
			}
		}
	}
</style>
