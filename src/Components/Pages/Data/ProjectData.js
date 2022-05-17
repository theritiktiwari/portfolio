const time = (startingMonth, startingYear) => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    month++;

    let y = year - startingYear;
    let m = month + (12 * y) - startingMonth;
    y = 0;
    m++;
    
    while (m >= 12) {
        m -= 12;
        y++;
    }

    return (y ? y + (y === 1 ? ' yr ' : ' yrs ') : '') + (m ? m + (m === 1 ? ' mo' : ' mos') : '');
}

// time: time(11, 2021),

const data = [
    {
        img: "https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FPulScope.png?alt=media&token=e4150713-892a-44a6-857f-28029ee3c993",
        title: "PulScope",
        description: "Many times, patients do not receive their medications on time, therefore we devised this gateway to assist you keep track of the resources offered by the hospital in real-time.",
        starting: "May 2022",
        ending: " - Present",
        time: time(5, 2022),
        link: "https://github.com/theritiktiwari/pulscope"
    },
    {
        img: "https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FGTA.png?alt=media&token=f7868095-272d-4b3d-b59f-47a08ae8ce6b",
        title: "GTA",
        description: "This is a portal for VITFAM, which is hosting an event about budgeting. [Grand Thrift Auto]. Where a player has provided credentials and a list of car, they must next go through the catalogue that will be provided in the starting of the event. They'll buy the car according to their budget and will survive through all the rounds. They can also sell the car to other participants. Depreciation / Appreciation will be there.",
        starting: "Jan 2022",
        ending: "",
        time: "1 Month",
        link: "https://github.com/theritiktiwari/GTA"
    },
    {
        img: "https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FDeFRAUDER.png?alt=media&token=28219448-f1bb-4373-9ac3-fc2da9439dc9",
        title: "DeFRAUDER",
        description: "This is a portal for VITFAM, which is hosting an event about financial fraud. Where a player has provided a summary of the story and clues, they must next go through the clues that will be placed in various platforms on the internet. They must locate the clue and create a story based on the clue, and then, in order to pass the stage.",
        starting: "Nov 2021",
        ending: "",
        time: "1 Month",
        link: "https://github.com/theritiktiwari/DeFrauder"
    },
    {
        img: "https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FDORMIO.png?alt=media&token=7ac3d605-4949-4d99-85fc-d28417c15a50",
        title: "DORMIO",
        description: "Now a days, Digital Gadgets are so much alluring and attractive that people are ready to compromise with their health for using them all day even during bed time. This habit creates a lot of health issues and results in inability to perform to their maximum in their day time. This is a device that helps to avoid mobile phones during the mattress time.",
        starting: "Oct 2021",
        ending: "- Nov 2021",
        time: "2 Months",
        link: "https://github.com/theritiktiwari/DORMIO"
    },
    {
        img: "https://firebasestorage.googleapis.com/v0/b/dev-ritik.appspot.com/o/projects%2FVITCRMS.png?alt=media&token=e610b4d8-2ed2-461a-bace-8d3e43852501",
        title: "VIT CRMS",
        description: "A website to provide the resources related to college. It facilitates easy access of study material, lab reports and books for different courses, offered at the University, by the students. The platform enables students to access the course material provided by a specific faculty for a particular course.",
        starting: "Mar 2021",
        ending: "- Jun 2021",
        time: "4 Months",
        link: "https://github.com/theritiktiwari/VIT-CRMS"
    }
]

export default data;