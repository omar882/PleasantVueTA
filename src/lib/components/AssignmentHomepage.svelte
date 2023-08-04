<script>


export let assignment;
let shown = false;

function toggleShown() {
    shown = !shown;
}

</script>


<tr class={assignment.fake || assignment.edited ? 'fake' : ''}>
    <td
        class="assignment-name"
        style={assignment.new ? 'font-weight: bold;' : ''}
    >
        {assignment.$.Measure}
    </td>
    <td class="assignment-score" on:click={toggleShown}>
        <div class:hidden={!shown} id="assignment-score">{assignment.score}</div>
        <i class:hidden={shown} class="bi bi-eye"></i>
    </td>
</tr>
<style type="scss">
	td {
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
        cursor: pointer;
	}
    .hidden {
        display: none;
    }
</style>