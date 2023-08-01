<script>
	import { session } from '$lib/stores/session.js'
	import { fly } from 'svelte/transition'
	import { fade } from 'svelte/transition'
	import { parseData } from '$lib/js/parseData.js'

	let shown = false;

	export function show() {
		shown = true
	}

	function cancel() {
		shown = false
	}

    let error;

    let imageId;
    let showLink;
    let copiedOk;

    async function shareSched() {
		
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

    async function getNewLink() {
            const resp = await fetch("/sharesched");
		    const body = await resp.json();
            if (resp.status === 403) {
                throw new Error("Unauthorized. Try logging in and back out");
            }
            if (resp.status !== 201 || resp.status === 503) {
                throw new Error("Couldn't generate the link");
            }
            return body.id;
        }

    async function copyImage() {
        try {
            if (!imageId) {
                imageId = await getNewLink();
            }
            const link = `http://127.0.0.1:5173/sched/${imageId}`
            const resp = await fetch(link);
            const blob = await resp.blob();
            const file = new File([blob], 'schedule.png', {
                type: blob.type,
            });
            const shareData = {
                files: [file],
                title: "Schedule",
                text: "Here's my schedule!",
            };

            if (navigator?.canShare?.(shareData)) {
                try {
					await navigator.share(shareData);
					copiedOk = "Shared!";
				} catch (ignore) {}
            }
            if (!window.ClipboardItem) {
                return await shareLink();
            }
            if (!copiedOk) {
                try {
					await navigator.clipboard.write([new ClipboardItem({
                        [blob.type]: blob,
                    })])
					copiedOk = "Copied to clipboard!";
				} catch (ignored) {
                    console.log(ignored);
                }
            }
            if (!copiedOk) {
                showLink = link;
            }




        } catch (e) {
            error = e.message;
            copiedOk = false;
        }
    }

    async function shareLink() {
        debugger;
        copiedOk = false;
        showLink = false;
        try {
            if (!imageId) {
                imageId = await getNewLink();
            }
            const link = `http://127.0.0.1:5173/sched/${imageId}`
            const shareData = {
                title: "Schedule",
                text: "Here's my schedule!",
                url: link,
            };
            if (navigator?.canShare?.(shareData)) {
                try {
					await navigator.share(shareData);
					copiedOk = "Shared!";
				} catch (ignore) {}
            }
            if (!copiedOk) {
                try {
					await navigator.clipboard.writeText(link);
					copiedOk = "Copied to clipboard!";
				} catch (ignored) {}
            }
            if (!copiedOk) {
                showLink = link;
            }
        } catch (e) {
            error = e.message();
            copiedOk = false;
        }
         
    }
</script>

{#if shown}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="background" on:click|self={cancel} transition:fade={{ duration: 200 }}>
		<div
			class="modal"
			in:fly={{ y: -5, duration: 200 }}
			out:fly|local={{ y: 5, duration: 200 }}
		>
            <h3>Share Schedule</h3>
            <div class="row">
                <button on:click={copyImage}>Copy Image</button>
                <button on:click={shareLink}>Share Link</button>
            </div>
            {#if copiedOk}
                <div class="row">
                    <span>{copiedOk}</span>
                </div>
            {/if}
            {#if showLink}
                <div class="row">
                    <a href={showLink}>Open Link to Schedule</a>
                </div>
            {/if}
            {#if error}
                <div class="error">{error}</div>
            {/if}
            <div class="row">
                <button on:click={cancel}>{copiedOk?"Done":"Cancel"}</button>
            </div>
		</div>
	</div>
{/if}

<style lang="scss">
	h3 {
		margin: 0 0 $spacing-small 0;
	}

	.background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(3px);
		display: flex;
	}

	.modal {
		@include box;
		margin: auto;
		width: 500px;
	}

	input,
	button {
		width: 100%;
	}

	select {
		background: var(--bg-color-1);
		&:hover {
			cursor: pointer;
			background: var(--bg-color-1-5);
		}
	}

	.row {
		display: flex;
		gap: $spacing-small;
		margin-top: $spacing-small;
	}

	.error {
		margin-top: $spacing-small;
	}

	@media (max-width: $breakpoint-phone) {
		.modal {
			margin: auto $spacing;
		}
	}
</style>
