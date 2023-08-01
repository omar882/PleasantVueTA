const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} {{ term }} Schedule</title>
</head>
<body class="{{ theme }}">
    <div id="image">
        <div id="header">
            <div id="logo">
                <span>{{ logo }}</span>
            </div>
            <div id="title">
                <span class="title-text">{{ title }}</span>
            </div>
            <div id="term">
                <span>{{ term }}</span>
            </div>
        </div>
        <div id="listing">
            <div id="listing-header">
                <span>{{ header }}</span>
            </div>
            {{#each classes}}
                <div class="list-item">
                    <span class="list-item-period text">{{ this.period }}</span>
                    <span class="list-item-title">{{ this.name }}</span>
                    <div class="list-item-info">
                        <span class="list-item-teacher">{{ this.teacher.name }}</span>
                        <span class="list-item-room">{{ this.room }}</span>
                    </div>
                </div>
            {{/each}}
        </div>
    </div>

</body>
<style>
    *, html {
        padding: 0px;
        margin: 0px;
        line-height: 1;
    }
    body {
        background-color: #000000;
        font-family: sans-serif;

        width: 720px;
        filter: contrast(1);
    }
    #image {
        width: 100%;
        

        display: grid;
        grid-template-rows: 1fr min-content 1fr;
        grid-template-rows: 1fr;;
    }
    #header {
        background-color: var(--header-bg);
        border-bottom: solid 1px var(--border-list);
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        min-height: 54px;

        display: grid;
        grid-template-columns: 1fr min-content;

        align-items: center;

        padding-inline: 13px;
    }

    #title {
        grid-column: 1/4;
        grid-row: 1/2;
        display: grid;
        justify-content: center;
    }

    #title .title-text {
        color: var(--header);
        text-align: center;
        max-width: 224px;
        font-weight: 400;
        line-height: normal;
    }

    #term {
        color: var(--term);
        grid-row: 1/2;
        grid-column: 3/4;
        font-weight: 600;
    }
    #logo {
        color: var(--logo);
        grid-row: 1/2;
        grid-column: 1/2;
        font-weight: 800;
    }

    #listing {
        background-color: var(--list-bg);
        min-height: 312px;

        display: grid;
        list-style: none;
        grid-template-columns: 1fr;
        grid-auto-rows: min-content;

        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;

        padding-inline-start: 13px;
        padding-block-end: 13px;
    }

    #listing-header {
        padding-block: 13px;
        
        font-size: 20px;
        font-weight: 500;
        color: var(--intro);
    }
</style>
<style>
    .list-item {
        padding-inline-end: 7px;
        padding-block: 4px;
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-columns: min-content 1fr;
        grid-template-rows: min-content min-content;
        gap: 5px 10px;  
        min-height: 50px;
    }

    .list-item > * {
        padding: 0px;
        
    }


    .list-item {
        border-top: solid 1px var(--border-list);
    }

    .list-item-period {
        grid-row: 1/3;
        grid-column: 1/2;
    }

    .list-item-period.text {
        text-align: center;
        padding: 3px;
        border: solid 2px var(--border-circle);
        color: var(--period);
        border-radius: 8px;
    }


    .list-item-title {
        grid-row: 1/2;
        grid-column: 2/3;
        font-weight: 700;
        font-size: 18px;
        color: var(--course);
    }   
    
    .list-item-info {
        grid-row: 2/3;
        grid-column: 2/3;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        font-weight: 400;
        font-size: 14px;
    }

    .list-item-teacher {
        line-height: normal;
        color: var(--teacher);
    }

    .list-item-room {
        justify-self: end;
        color: var(--room);
    }

</style>
<style>
    .light {
        --gray: #9b9b9b;
        --black: #000000;
        --white: #ffffff;
        --purple: hsl(285, 100%, 33%);

        --bg: var(--white);
        --neutral: var(--gray);
        --col: var(--black);
        --accent: var(--purple);
    }
</style>
<style>
    .dark {
        --gray: #4A4D51;
        --black: #18181A;
        --white: #ffffff;
        --purple: hsl(285, 86%, 51%);

        --bg: var(--black);
        --neutral: var(--gray);
        --col: var(--white);
        --accent: var(--purple);
    }
</style>
<style>
    body {
        --border-circle: var(--neutral);
        --logo: var(--col);
        --header: var(--col);
        --header-bg: var(--bg);
        --term: var(--accent);
        --intro: var(--col);
        --list-bg: var(--bg);
        --border-list: var(--neutral);
        --teacher: var(--col);
        --room: var(--col);
        --period: var(--col);
        --course: var(--col);
        
    }
</style>
</html>`;

export default template;