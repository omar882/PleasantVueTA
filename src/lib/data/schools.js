const SCHOOLS = {
    "HS_AMADOR": {
        level: "HS",
        names: [
            "AVHS",
            "AV",
            "Amador Valley",
            "Amador Valley High School",
        ]
    },
    "HS_FOOTHILL": {
        level: "HS",
        names: [
            "Foothill",
            "Foothill High School",
        ],
    },
    "MS_HART": {
        level: "MS",
        names: [
            "Hart",
            "HMS",
            "Hart Middle School",
        ]
    },
    "MS_HARVEST": {
        level: "MS",
        names: [
            "HPMS",
            "HP",
            "Harvest",
            "Harvest Park",
            "Harvest Park Middle School",
        ],
    },
    "MS_PLEASANTON": {
        level: "MS",
        names: [
            "PMS",
            "Pleasanton Middle",
            "Pleasanton Middle School",
        ]
    }
}




const getSchoolIdFromName = (name) => {
    for (const id of Object.keys(SCHOOLS)) {
        for (const possibleName of (SCHOOLS[id]?.names || [])) {
            if (possibleName.toLowerCase() === name.toLowerCase()) {
                return id;
            }
        }
    }
    return;
}

export { SCHOOLS, getSchoolIdFromName };