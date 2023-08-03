<script>
    export let staff;
    let infoVisible = false;

    function toggleInfo(event) {
        infoVisible = !infoVisible;
        event.target.parentElement.style.borderBottomLeftRadius = infoVisible ? "0" : "20px";
        event.target.parentElement.style.borderBottomRightRadius = infoVisible ? "0" : "20px";
    }
</script>

<div>
    <div class="container">
        <span class="name">
            {staff.first_name} {staff.last_name}
        </span>
        {#if staff.email}
            <a href={`mailto:${staff.email}`} class="email">
                <i class="bi bi-envelope"></i>
            </a>
        {/if}
        {#if staff.role === "teacher"}
            <span class="role">{staff.subject}</span>
        {:else}
            <span class="role">{staff.position}</span>
        {/if}
        {#if staff.role === "teacher"}
            {#if infoVisible}
                <i on:click={(event) => toggleInfo(event)} class="bi bi-chevron-up dropdown"></i>
            {:else}
                <i on:click={(event) => toggleInfo(event)} class="bi bi-chevron-down dropdown"></i>
            {/if}
        {/if}
    </div>
    {#if infoVisible}
        <div class="info">
            <div>
                <div>Subject: {staff.subject}</div>
                <div>Email: <a href={`mailto:${staff.email}`} style="text-decoration: none; color: inherit;">{staff.email}</a></div>
            </div>
            <div class="classes">
                <table>
                    <tbody>
                        <tr>
                            <th>Period</th>
                            <th>Classes</th>
                        </tr>
                        {#each staff.classes as cl, index (cl.period)}
                            <tr key={index}>
                                <td>{cl.period}</td>
                                <td>{cl.names.join(", ")}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <div class="clubs">
                <strong>Clubs:<br /></strong>
                {#if staff.clubs.length > 0}
                    {#each staff.clubs as cl}
                        <div>{cl}</div>
                    {/each}
                {:else}
                    <i>None</i>
                {/if}
            </div>                     
        </div>
    {/if}
</div>

<style type="scss">
    div.container {
        box-sizing: initial;
        width: 80%;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        height: 40px;
        border: 1px solid black;
        margin: 30px auto 0 auto;
        padding: 20px;
    }

    div.info {
        box-sizing: initial;
        width: 80%;
        height: auto;
        border: 1px solid black;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
        border-top: 0;
        margin: 0 auto 15px auto;
        padding: 20px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        text-align: center;
        flex-wrap: wrap;
    }

    div.info > div:nth-child(1) {
        width: 100%;
        margin-bottom: 10px;
    }

    div.info > div:nth-child(1) > div {
        display: inline-block;
        width: 50%;
    }

    span.name {
        font-size: 30px;
        margin-right: 5px;
    }

    a.email {
        text-decoration: none;
        color: black;
        margin: 10px;
        opacity: .75;
        position: relative;
        font-size: large;
    }

    span.role {
        font-style: italic;
        margin: 5px;
        position: relative;
        top: -2px;
    }

    .dropdown {
        float: right;
        cursor: pointer;
        font-size: 35px;
    }

    div.classes {
        flex: 1;
        width: 50%;
    }

    div.classes table {
        width: 100%;
    }

    div.classes table *:not(th) {
        border-top: 1px solid black;
        width: fit-content;
        margin: 0 auto;
        padding: 1pt;
    }

    div.clubs {
        flex: 1;
        width: 50%;
    }

    div.clubs * {
        padding: 1pt;
    }

    

    @media only screen and (max-width: $breakpoint-phone) {
        div.container {
            width: 85%;
            height: 40px;
            border: 1px solid black;
            margin: 30px auto 0 auto;
            padding: 10px;
        }
        
        div.info {
            width: 85%;
            height: auto;
            border: 1px solid black;
            border-top: 0;
            margin: 0 auto 15px auto;
            padding: 10px;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            text-align: center;
        }

        /* div.info > div:nth-child(1) {
            width: 100%;
            margin-bottom: 10px;
        } */

        div.info > div:nth-child(1) > div {
            display: block;
            width: 100%;
            margin: auto;
        }
        
        span.name {
            font-size: 25px;
            line-height: 40px;
            margin-right: 5px;
        }
        
        a.email {
            text-decoration: none;
            color: black;
            margin: 5px;
            opacity: .75;
            position: relative;
            top: 2px;
        }
        
        div.classes {
            width: 65%;
            margin-right: 5%;
        }
        
        div.clubs {
            width: 35%;
        }
        
        div.clubs * {
            padding: 1pt;
            margin: 2px 0 5px 0;
        }    

        .role {
        display: none;
    }
    }
</style>
