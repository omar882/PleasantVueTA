<script>
	import calendar from "$lib/data/calendar.json";

    import {nextSaturday, format, isSaturday, previousSunday, isSunday, nextMonday, previousFriday, startOfDay, eachDayOfInterval, isWeekend, isToday, isTomorrow, isYesterday, nextDay, previousDay, isSameDay, addMinutes } from "date-fns";
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
        return format(date, "MMM d");
    }

    $: selectedDateFormatted = prettyDate(selectedDate);
    $: weekStart = isSunday(selectedDate) ? selectedDate : previousSunday(selectedDate);
    $: weekEnd = isSaturday(selectedDate) ? selectedDate : nextSaturday(selectedDate);

    $: if (dateInput) {
        dateInput.valueAsDate = selectedDate;
        // console.log(dateInput.value);
    }

    function makeWeek(selDate) {
        const interval = {
            start: nextMonday(weekStart),
            end: previousFriday(weekEnd),
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
        const user_date = new Date(event.target.value) 
        console.log(new Date(event.target.value), event.target.value)
        selectedDate = startOfDay(addMinutes(new Date(event.target.value), user_date.getTimezoneOffset()));
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
	<title>Schedule</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Schedule</h1>
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
                <div class="day" class:today={isSameDay(selectedDate, day.date)}>
                    <div class="day-heading">
                        {prettyDate(day.date, "EEEE")}
                    </div>
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
        padding: 0px;
        background-color: transparent;
        visibility: hidden;
    }

    .date-output {
        height: min-content;
    }

    .date-button {
        background-color: var(--bg-color-3);
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
        row-gap: 0.5em;
        justify-content: center;
        background-color: transparent;

	}

    .date-selection {
        @include box;
        margin-top: 0.4em;
        grid-row: 1/2;

        align-items: center;
        justify-content: center;
        column-gap: 0.4em;
        padding: 0.5em;
        width: fit-content;
        margin-inline: auto;

        display: flex;
    }

    .week {
        --cols: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-row: 2/3;
        margin-inline: 0.2em;
        
        display: grid;
        column-gap: 0.2em;
        grid-template-columns: var(--cols);
        // align-items: center;
        justify-content: center;
        height: 100%;
    }

    .week .day {
        @include box;
        display: flex;
        flex-direction: column;
    }

    .week .day.today {
        grid-column: span 2;
    }

    .day-scroll {
        overflow-y: scroll;
        display: grid;
        grid-auto-columns: 1fr;
    }

    .day-heading {
        font-size: 1.4em;
        font-weight: 500;
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
