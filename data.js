"use strict";

/***************** USE ARRAYS OF JSON OBJECTS TO STORE DATA *****************/

// declare arrays that will store information
var timetable = [];
var exams = [];
var activities = [];
var emails = [];

// create the json objects
// months reflect the scholastic year (October = 0)
let mod1 = {
    title: "novel interaction technologies",
    day: "Monday",
    time: "six p.m.",
    sched_no: 1.18,
    cw1_due: 3.15,
    cw1_date: "Friday 15th January",
    cw1_res: "n/a",
    cw2_due: 5.26,
    cw2_date: "Friday 26th March",
    cw2_res: "n/a",
    cw3_due: 7.03,
    cw3_date: "Friday 3rd May",
    cw3_res: "n/a"
};
let mod2 = {
    title: "business intelligence",
    day: "Tuesday",
    time: "six p.m.",
    sched_no: 2.18,
    cw1_due: 2.10,
    cw1_date: "Friday 10th December",
    cw1_res: "76",
    cw2_due: 6.02,
    cw2_date: "Friday 2nd April",
    cw2_res: "n/a"
};
let mod3 = {
    title: "artificial intelligence",
    day: "Thursday",
    time: "five thirty p.m.",
    sched_no: 4.173,
    cw1_due: 2.10,
    cw1_date: "Friday 10th December",
    cw1_res: "74",
    cw2_due: 5.05,
    cw2_date: "Friday 5th March",
    cw2_res: "72"
};
let exam1 = {
    mod: "artificial intelligence",
    day: "Wednesday",
    date: "21st April 2021",
    sched_no: 6.21
};
let act1 = {
    title: "football match",
    day: "Tuesday",
    date: "30th March 2021",
    time: "seven p.m.",
    sched_no: 5.30,
};
let act2 = {
    title: "strava challenge",
    sched_no: 0
};
let email1 = {
    sender: "Amazon Web Services",
    title: "Your Trial ends soon"
};
let email2 = {
    sender: "MDX Administration",
    title: "University fees"
};


// populate the arrays with the json objects
timetable.push(mod1);
timetable.push(mod2);
timetable.push(mod3);
exams.push(exam1);
activities.push(act1);
activities.push(act2);
emails.push(email1);
emails.push(email2);