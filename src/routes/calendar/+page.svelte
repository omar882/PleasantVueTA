<script>
    import MissingData from "$lib/components/MissingData.svelte";

    import {nextSaturday, format, isSaturday, previousSunday, isSunday, nextMonday, previousFriday, startOfDay, eachDayOfInterval, isWeekend, isToday, isTomorrow, isYesterday, nextDay, previousDay, isSameDay, addMinutes, isWithinInterval, add, parse, isFriday, isMonday } from "date-fns";
	import { onMount } from "svelte"
    import { session } from '$lib/stores/session.js'


    let selectedDate = startOfDay(isWeekend(new Date()) ? nextMonday(new Date()) : new Date())
    let dateInput;
    let calendar;

    if (!($session?.calendar)) {
        try {
            calendar = (import("$lib/data/CALENDAR_HS_AMADOR.json")).default;
        } catch {
            calendar = {
                
            }
        }
    } else {
        calendar = $session.calendar
    }

    function formatDate(date) {
        return format(date, "M/dd/yyyy");
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
        return format(date, "EEE, MMM d");
    }

    function getPeriodName(periodName, idx) {
        if (!(session?.gradebook?.Courses?.[0]?.Course)) {
            return periodName; 
        }
        for (const course of $session.gradebook.Courses[0].Course) {
            if (course.index == (periodName[0] - 1)) {
                return course.$.Title;
            }
        }
        return periodName;
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
        console.log(eachDayOfInterval(interval).map((day) => {
            console.log(formatDate(day))
            const info = calendar[formatDate(day)];
            return {
                date: day,
                info,
            };
        }))
        return eachDayOfInterval(interval).map((day) => {
            const info = calendar[formatDate(day)];
            return {
                date: day,
                info,
            };
        });

    }

    function selectNextDay() {
        if (isFriday(selectedDate)) {
            selectedDate = nextMonday(selectedDate);
            return;
        }
        selectedDate = add(selectedDate, { days: 1 })
    }

    function selectPreviousDay() {
        if (isMonday(selectedDate)) {
            selectedDate = previousFriday(selectedDate);
            return;
        }
        selectedDate = add(selectedDate, { days: -1 })
    }

    function selectNextWeek() {
        selectedDate = nextMonday(selectedDate);
    }

    function selectPreviousWeek() {
        selectedDate = previousFriday(selectedDate);
    }

    function onDateChange(event) {
        const user_date = new Date(event.target.value) 
        // console.log(new Date(event.target.value), event.target.value)
        const possibleWeekend = startOfDay(addMinutes(new Date(event.target.value), user_date.getTimezoneOffset()));
        selectedDate = startOfDay(isWeekend(possibleWeekend) ? nextMonday(possibleWeekend) : possibleWeekend)
    }

    $: week = makeWeek(selectedDate);

    onMount(() => {
        window.parse = parse;
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
    {#if Object.keys(calendar).length === 0}
		<MissingData message={"We are missing calendar data for your school!"} />
    {:else}
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
            <div class="arrow" on:click={selectPreviousDay}>
                <i class="bi bi-arrow-left"></i>
            </div>
            {#each week as day}
                <div class="day" on:click={()=>onDateChange({target: { value: day.date }})} class:today={isSameDay(selectedDate, day.date)}>
                    <div class="day-heading">
                        <span>{prettyDate(day.date, "EEEE")}</span>
                        {#if isSameDay(selectedDate, day.date) && (day?.info?.noSchool || !day.info)}
                        <span class="no-school-head">No School!</span>
                        {/if}
                    </div>
                    {#if day.info}
                    <div class="day-scroll">
                        {#if day.info?.noSchool && !isWeekend(day.date) && !isSameDay(selectedDate, day.date)}
                        <div class="no-school">No School!</div>
                        {/if}
                        {#if day.info.events && day.info.events.length > 0 && !isSameDay(selectedDate, day.date)}
                        <div class="event-count">
                            {day.info.events.length} Event{day.info.events.length > 1 ? "s" : ""}
                        </div>
                        {/if}
                        {#if isSameDay(selectedDate, day.date)}
                        <!-- {#if  console.log(day)}{/if} -->
                        {#if day.info?.schedule && Object.keys(day.info.schedule).length > 0}
                        <span class="periods-head">Bells:</span>
                        {#each Object.keys(day.info.schedule) as periodName, idx}
                        <div class="period">
                            <span class="period-name">
                                {@html getPeriodName(periodName, idx)}
                            </span>
                            <span class="period-timings" class:now={isWithinInterval(new Date(), {
                                    start: parse(day.info.schedule[periodName].start, "h:mm a", day.date),
                                    end: parse(day.info.schedule[periodName].end, "h:mm a", day.date),
                            })}>{day.info.schedule[periodName].start} - {day.info.schedule[periodName].end}</span>
                        </div>
                        {/each}
                        {/if}
                        {#if day.info?.events?.length > 0}
                        <span class="events-head">Events:</span>
                        {#each day.info.events as event}
                        <div class="event">
                            <span class="event-name">
                                {event.Title}
                            </span>
                            {#if event.Information}
                            <span class="event-info">
                                {event.Information}
                            </span>
                            {/if}
                        </div> 
                        {/each}
                        {/if}
                        {/if}
                    </div>
                    {/if}
                </div>
            {/each}
            <div class="arrow" on:click={selectNextDay}>
                <i class="bi bi-arrow-right"></i>
            </div>
        </div>
	</div>
    {/if}
</div>

<style lang="scss">
    .grid-heading-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
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
        grid-row: 2/3;
        margin-inline: 0.2em;
        
        display: grid;
        column-gap: 0.2em;
        grid-template-columns: repeat(7, 1fr);
        // align-items: center;
        justify-content: center;
        height: 100%;
    }

    .week .arrow {
        @include box;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .week .day {
        @include box;
        display: flex;
        flex-direction: column;
    }

    .week .day.today {
        grid-column: span 3;
    }

    .week .day:not(.today) {
        cursor: pointer;
    }

    .day-scroll {
        margin-top: 10px;
        // overflow-y: scroll;
        display: grid;
        grid-auto-columns: 1fr;
        gap: 3px;
    }

    .no-school, .event-count {
        text-align: center;
        @include box;
        background-color: var(--bg-color-2-5);
    }
    
    .no-school-head {
        text-align: center;
        font-size: 0.7em;
        font-weight: 300;
    }

    .period {
        padding: 5px;
        background-color: var(--bg-color-2-5);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .event {
        padding: 5px;
        background-color: var(--bg-color-2-5);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .period.now {
        padding-top: 7px;
        padding-bottom: 7px;
        background-color: var(--bg-color-2);
    }



    .day-heading {
        font-size: 1.4em;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }



    @media (max-width: $breakpoint-phone) {
        .content {
            font-size: 1em;
        }

        h1 {
            margin-top: 0;
        }

        .week .arrow {
            display: flex;
        }

        .week .day:not(.today) {
            display: none;
        }

        .week .day.today {
            grid-column: span 5;
        }

        .day-heading {
            display: block;
            text-align: center;
        }

        .day-heading > span {
            display: block;
        }

        .period {
            display: block;
        }

        .period .period-name {
            display: block;
        }

        .event {
            display: block;
        }
    }
</style>
