<script>
	import { session } from '$lib/stores/session.js'
	import PeriodSelect from '$lib/components/PeriodSelect.svelte'

	let missingAssignments = ($session?.gradebook?.assignments || []).filter(assignment => {
		if (assignment.$.Score == "Not Due") return false;
		return assignment?.score?.toString().startsWith("0")
		}).length
</script>

<svelte:head>
	<title>Courses - PleasantVue</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Courses</h1>
	</div>
	<div class="content">
		<table>
			<div class="grade-stats-row">
				<span>Missing assignments</span>
				<span>{missingAssignments}</span>
			</div>
			<div class="grade-stats-row">
				<span>Average grade</span>
				<span>{$session?.gradebook?.average || "??"}</span>
			</div>
			<div class="grade-stats-row">
				<span>Average grade this week</span>
				<span>{$session?.gradebook?.week?.average || "??"}</span>
			</div>
		</table>
	</div>
	<div class="content">
		<table>
			{#each ($session?.gradebook?.Courses?.[0]?.Course || []) as course, index}
				<a class="row-link" href={'/course/' + index}>
					<td class="course-name">{course.$.Period === "10" ? "ACCESS" : course.$.Period} — {course.$.Title}</td>
					<td class="course-staff">{course.$.Staff} </td>
					<td class="course-room">{course.$.Room} </td>
					<td class="course-grade" style={course.style}>{course.scoreString || "—"}</td>
					<td class="course-score" style={course.style}>{course.score} </td>
				</a>
			{/each}
		</table>
	</div>
</div>

<style lang="scss">
	.layout {
		height: calc(100vh - 40px);
		flex-shrink: 3;
	}

	.content {
		@include box;
		flex-grow: 1;
		font-size: 1.2em;
		padding-top: 0;
		padding-bottom: 0;
		margin-bottom: 10px;
	}

	table {
		height: 100%;
		width: 100%;
		border-spacing: 0 $spacing;
	}

	.grade-stats-row {
		display: flex;
		justify-content: space-between;
		padding: $spacing-small;
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

	.course-score {
		text-align: right;
	}

	.course-grade {
		font-weight: bold;
	}

	@media (max-width: $breakpoint-phone) {
		.content {
			font-size: 1em;
		}

		h1 {
			margin-top: 0;
		}

		.course-staff {
			display: none;
		}
	}
</style>
