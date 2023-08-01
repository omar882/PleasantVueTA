<script>
	import calendar from "$lib/data/calendar.json";

    import {nextSaturday, format, isSaturday, previousSunday, isSunday, nextMonday, previousFriday, startOfDay, eachDayOfInterval, isWeekend, isToday, isTomorrow, isYesterday } from "date-fns";
	import { onMount } from "svelte"

    let selectedDate = startOfDay(new Date());
    let dateInput;

    function formatDate(date) {
        return format(date, "MM/dd/yyyy");
    }

    function prettyDate(date) {
        if (isToday(date)) {
            return "Today";
        }
        if (isTomorrow(date)) {
            return "Tomorrow";
        }
        if (isYesterday(date)) {
            return "Yesterday";
        }
        return formatDate(date);
    }

    $: selectedDateFormatted = prettyDate(selectedDate);
    $: weekStart = isSunday(selectedDate) ? selectedDate : previousSunday(selectedDate);
    $: weekEnd = isSaturday(selectedDate) ? selectedDate : nextSaturday(selectedDate);

    $: if (dateInput) {
        dateInput.value = selectedDate;
    }

    function makeWeek(selDate) {
        const interval = {
            start: weekStart,
            end: weekEnd
        };
        return eachDayOfInterval(interval).map((day) => {
            const info = calendar[formatDate(day)];
            return {
                date: day,
                info,
            };
        });

    }

    function selectNextWeek() {
        selectedDate = nextMonday(selectedDate);
    }

    function selectPreviousWeek() {
        selectedDate = previousFriday(selectedDate);
    }

    function onDateChange(event) {
        selectedDate = startOfDay(new Date(event.target.value));
    }

    $: week = makeWeek(selectedDate);

    onMount(() => {
        dateInput.value = selectedDate.toISOString();
    });

    function openInput() {
        // console.log(dateInput);
        dateInput.showPicker();
    }
    
</script>

<svelte:head>
	<title>Calendar</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Calendar</h1>
	</div>
	<div class="content">
		<div class="date-selection">
            <button on:click={selectPreviousWeek}>Last Week</button>
            <button class="date-button" on:click={openInput}>
                <output class="date-output">{selectedDateFormatted}</output>
                <input min={"2023-07-25"} max={"2024-06-02"} class="date-input" type="date" name="dateInput" id="dateInput" bind:this={dateInput} on:change={onDateChange}>
            </button>
            <button on:click={selectNextWeek}>Next Week</button>
        </div>
        <div class="week">
            {#each week as day}
                <div class="day">
                    {format(day.date, "EEEE")}
                    {#if !(day.info) && !isWeekend(day.date)}
                        <span class="no-data">No Data!</span>                        
                    {/if}
                    {#if day.info}
                    {#if day?.info?.noSchool && !isWeekend(day.date)}
                        No School!
                    {/if}
                    {#if day.info.events && day.info.events.length > 0}
                        {day.info.events.length} events!
                    {/if}
                    {/if}
                </div>
            {/each}
        </div>
	</div>
</div>

<style lang="scss">
    .date-input {
        padding: $spacing;
        background-color: transparent;
        visibility: hidden;
    }

    .date-output {
        height: min-content;
    }

    .date-button {
        padding: 10px;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        justify-content: center;
        align-items: center;
    }
    .date-button > * {
        grid-row: 1/2;
        grid-column: 1/2;
    }


    .date-input .shown {
        visibility: visible;
    }

	.layout {
		display: flex;
		height: 100%;
		flex-direction: column;
	}

	.content {
		@include box;
		flex-grow: 1;
		font-size: 1.2em;
		padding-top: 0;
		padding-bottom: 0;
        padding-left: 5px;
        padding-right: 5px;

        display: grid;
        grid-template-rows: max-content 1fr;
        grid-template-columns: 1fr;
        align-items: center;
        justify-content: center;

	}

    .date-selection {
        // padding-block: 0.3em;
        grid-row: 1/2;

        align-items: center;
        justify-content: center;
        column-gap: 0.4em;

        display: flex;
    }

    .week {
        --cols: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-row: 2/3;
        
        display: grid;
        grid-template-columns: var(--cols);
        align-items: center;
        justify-content: center;
    }



		@media (max-width: $breakpoint-phone) {
		.content {
			font-size: 1em;
		}

		h1 {
			margin-top: 0;
		}


	}
</style>
