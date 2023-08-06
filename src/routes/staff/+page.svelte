<script>
	import staffList from "$lib/data/staff.json";
    import Staff from './Staff.svelte';
	import { session } from "$lib/stores/session";
	import MissingData from "$lib/components/MissingData.svelte";

    var staffListFiltered = [...staffList];

    function handleSearch() {
        staffListFiltered = staffList.filter(handleSearchElement);
        // console.log(staffListFiltered);
    }

	function handleSearchElement(element) {
		let searchList = search
			.toLowerCase()
			.split(' ')
			.filter((i) => i)
		var full_name = element.first_name + ' ' + element.last_name

		var period
		if (searchList.indexOf('period') > -1) {
			if (['a', 'b'].includes(searchList[searchList.indexOf('period') + 1]))
				period = searchList[searchList.indexOf('period') + 1].toUpperCase()
			else if (['a', 'b'].includes(searchList[searchList.indexOf('period') - 1]))
				period = searchList[searchList.indexOf('period') - 1].toUpperCase()
			else if (
				searchList[searchList.indexOf('period') + 1] &&
				/\d/.test(searchList[searchList.indexOf('period') + 1])
			) {
				period = searchList[searchList.indexOf('period') + 1].replace(/\D/g, '')
				searchList.splice(searchList.indexOf('period') + 1, 1)
			} else if (
				searchList[searchList.indexOf('period') - 1] &&
				/\d/.test(searchList[searchList.indexOf('period') - 1]) &&
				['st', 'nd', 'rd', 'th'].some((end) =>
					searchList[searchList.indexOf('period') - 1].includes(end)
				)
			) {
				period = searchList[searchList.indexOf('period') - 1].replace(/\D/g, '')
				searchList.splice(searchList.indexOf('period') - 1, 1)
			}
			if (period) searchList.splice(searchList.indexOf('period'), 1)
		} else if (searchList.indexOf('per') > -1) {
			if (['a', 'b'].includes(searchList[searchList.indexOf('per') + 1]))
				period = searchList[searchList.indexOf('per') + 1].toUpperCase()
			else if (['a', 'b'].includes(searchList[searchList.indexOf('per') - 1]))
				period = searchList[searchList.indexOf('per') - 1].toUpperCase()
			else if (
				searchList[searchList.indexOf('per') + 1] &&
				/\d/.test(searchList[searchList.indexOf('per') + 1])
			) {
				period = searchList[searchList.indexOf('per') + 1].replace(/\D/g, '')
				searchList.splice(searchList.indexOf('per') + 1, 1)
			} else if (
				searchList[searchList.indexOf('per') - 1] &&
				/\d/.test(searchList[searchList.indexOf('per') - 1]) &&
				['st', 'nd', 'rd', 'th'].some((end) =>
					searchList[searchList.indexOf('per') - 1].includes(end)
				)
			) {
				period = searchList[searchList.indexOf('per') - 1].replace(/\D/g, '')
				searchList.splice(searchList.indexOf('per') - 1, 1)
			}
			if (period) searchList.splice(searchList.indexOf('per'), 1)
		} else if (
			['st', 'nd', 'rd', 'th'].some((end) =>
				searchList.some((s) => s.includes(end) && /\d/.test(s))
			)
		) {
			period = searchList
				.find((s) => ['st', 'nd', 'rd', 'th'].some((end) => s.includes(end)))
				.replace(/\D/g, '')
			searchList.splice(
				searchList.indexOf(
					searchList.find((s) => ['st', 'nd', 'rd', 'th'].some((end) => s.includes(end)))
				),
				1
			)
		}

		if (
			(period && element.classes && !element.classes.some((cl) => cl.period === period)) ||
			(period && !element.classes)
		)
			return false

		for (let i of [...searchList]) {
			if (full_name && full_name.toLowerCase().includes(i))
				searchList.splice(searchList.indexOf(i), 1)
			else if (element.subject && element.subject.toLowerCase().includes(i))
				searchList.splice(searchList.indexOf(i), 1)
			else if (element.category && element.category.toLowerCase().includes(i))
				searchList.splice(searchList.indexOf(i), 1)
			if (element.classes) {
				for (let j of element.classes) {
					if (
						searchList.length &&
						searchList.every((k) => j.names.some((cl) => cl.toLowerCase().includes(k)))
					) {
						if (period && j.period === period) return true
						else if (!period) return true
					}
				}
			}
			if (element.clubs && !period) {
				for (let j of element.clubs) {
					if (searchList.length && searchList.every((k) => j.toLowerCase().includes(k)))
						return true
				}
			}
		}
		if (searchList.length) return false
		else return true
	}

    let search = "";
</script>

<svelte:head>
	<title>Staff - PleasantVue</title>
</svelte:head>

<div class="layout" data-sveltekit-prefetch>
	<div class="grid-heading-container">
		<h1>Staff</h1>
	</div>
	{#if $session.student?.CurrentSchool?.[0] && !($session.student.CurrentSchool[0].includes("Amador")) }
		<MissingData message={"We are missing staff data for your school!"} />
	{:else}
    <div id="search-container">
        <div id="search-icon">
            <i class="bi bi-search"></i>
        </div>
        <input
            id="search"
            bind:value={search}
            on:input={handleSearch}
            placeholder={window.innerWidth > window.innerHeight ? "Search by name, club, class, subject, etc." : "Search"}
        />
      </div>
      <div class="staff-list">
        {#each staffListFiltered as staff}
            <Staff
                bind:staff={staff}
            />
        {/each}
      </div>
	{/if}
</div>

<style lang="scss">
	.grid-heading-container {
		display: flex;
        justify-content: space-between;
		align-items: center;
	}

    div#search-container {
        text-align: center;
        border-bottom: 2px solid black;
        margin: auto;
        width: 95%;
        display: flex;
    }

    input#search {
        border: 0;
        display: inline-block;
        width: 95%;
        height: 30pt;
        font-size: 20pt;
    }

    input:focus{
        outline: none;
    }

    div#search-icon {
        display: inline;
        position: relative;
        top: 4pt;
        left: -4pt;
        font-size: x-large;
    }

	.staff-list {
		overflow-y: scroll;
		// max-height: 400px;
		max-height: calc(100vh - 50px);
	}
</style>
