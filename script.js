"use strict";

// global variables
var bot_vol = "on";     // chatbot volume 
var weekly_sched = 0;   // display weekly schedule

// variables from the index page
let char = document.getElementById("char");
let bot_sound = document.getElementById("bot_sound");
let mic = document.getElementById("mic");
let chat_container = document.getElementById("chat_container");
let user_input = document.getElementById("user_input");
let chat_area = document.querySelector('.chat-area');

// hard-coded bot replies - good bye
let bye = ['Ok good bye','Bye, take care','Bye, see you soon']

// speech recognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();


// function that converts speech to text when user stops speaking, and then calls the respective functions
recognition.onresult=function(e)
{
    // convert speach to text
    let resultIndex = e.resultIndex;
    let request = e.results[resultIndex][0].transcript;
    // call function to display the user's request as a text message
    chat_container.appendChild(addUserMsg(request));
    // auto-scrolling the chat to show the latest messages
    chat_container.scrollTop = chat_container.scrollHeight;
    // send the user's reques to the function that determines how the chatbot should respond
    botReply(request);
}

// function that changes the mic colour to red once the user has completed a request (i.e. stops speaking)
recognition.onend=function()
{
    let button = '<img src="assets/red_mic.jpg">';
    mic.innerHTML = button;
}

// function that is called when the user clicks the mic to start a request
mic.addEventListener("click", function()
{
    // while recording the request, change the mic colour to green
    let button = '';
    button += '<img src="assets/green_mic.jpg">';
    mic.innerHTML = button;
    // start recording the user's speech (request)
    recognition.start();
});

// function to mute or unmute the chatbot, and update the sound icon accordingly
bot_sound.addEventListener("click", function()
{
    // if volume is currently on, update icon to muted and change to volume off
    // else, if volume is currently off, update icon to unmuted and change to volume on
    let button = '';
    if (bot_vol == "on")
    {
        button += '<img src="assets/muted.jpg">';
        bot_vol = "off";
    }
    else
    {
        button += '<img src="assets/unmuted.jpg">';
        bot_vol = "on";
    }
    bot_sound.innerHTML = button;
});

// function to display the user's request as text message in the chat
function addUserMsg(msg)
{
    let txtbox = '';
    txtbox += '<div class="user-bubble">'+msg+'</div>';
    chat_area.innerHTML += txtbox;
    return chat_area;
}

// function to display the chatbot's reply as text message in the chat
function addBotMsg(msg)
{
    let txtbox = '';
    txtbox += '<div class="bot-bubble">'+msg+'</div>';
    chat_area.innerHTML += txtbox;
    return chat_area;
}

// function to determine which will be the bot's reply for the user's request and call the function to display the reply
// async function to allow asynchronous communication with API function
async function botReply(req)
{
    const speech = new SpeechSynthesisUtterance();

    if (req.includes('schedule') || req.includes('timetable') || req.includes('time table'))
    {
        // if user request schedule for the whole week
        if (req.includes('week'))
        {
            // loop through the array holding the weekly schedule
            let reply = 'Your schedule for this week includes ';
            for (let i=0; i<timetable.length; i++)
            {
                reply += timetable[i]['title'];
                reply += ' held on ' + timetable[i]['day'];
                reply += ' at ' + timetable[i]['time'];
                if (i<timetable.length-1)
                {
                    reply += ', and ';
                }
            }
            reply += '. You may refer to the image below.';
            speech.text = reply;
            // trigger to display the image of the weekly schedule
            weekly_sched = 1;            
        }
        // if user request schedule for today
        else if (req.includes('today'))
        {
            let reply = 'Your schedule for today includes ';
            // obtain today's week day (0=Sunday)
            let day = getDayDateTime();
            day = day[0];
            // loop through the schedule array, and add any lectures scheduled today (compare weekday)
            // using a counter to check if there are no lectures scheduled today
            let c = 0;
            for (let i=0; i<timetable.length; i++)
            {
                if (Math.floor(timetable[i]['sched_no']) == day)
                {
                    reply += timetable[i]['title'];
                    reply += ' at ' + timetable[i]['time'];
                    c += 1;
                }                
            }
            // if no lectures scheduled for today
            if (c == 0)
            {
                reply += 'no lectures';
            }
            speech.text = reply;
        }
        // if user request schedule for tomorrow
        else if (req.includes('tomorrow'))
        {
            let reply = 'Your schedule for tomorrow includes ';
            // obtain today's week day (0=Sunday)
            let day = getDayDateTime();
            day = day[0];
            // loop through the schedule array, and add any lectures scheduled today (compare weekday)
            // using a counter to check if there are no lectures scheduled today
            let c = 0;
            for (let i=0; i<timetable.length; i++)
            {
                if (Math.floor(timetable[i]['sched_no']) == (day+1))
                {
                    reply += timetable[i]['title'];
                    reply += ' at ' + timetable[i]['time'];
                    c += 1;
                }                
            }
            // if no lectures scheduled for tomorrow
            if (c == 0)
            {
                reply += 'no lectures';
            }
            speech.text = reply;
        }
        // if user request schedule for a particular day of the week
        else if (req.includes('Monday') || req.includes('Tuesday') || req.includes('Wednesday') || req.includes('Thursday') || req.includes('Triday'))
        {
            let reply = 'Your schedule for ';
            let d = 0;
            if (req.includes('Monday'))
            {   d = 1; 
                reply += 'Monday'}
            else if (req.includes('Tuesday'))
            {   d = 2; 
                reply += 'Tuesday'}
            else if (req.includes('Wednesday'))
            {   d = 3; 
                reply += 'Wednesday'}
            else if (req.includes('Thursday'))
            {   d = 4; 
                reply += 'Thursday'}
            else if (req.includes('Friday'))
            {   d = 5; 
                reply += 'Friday'}

            reply += ' includes ';
            // obtain today's week day (0=Sunday)
            let day = getDayDateTime();
            day = day[0];
            // loop through the schedule array, and add any lectures scheduled today (compare weekday)
            // using a counter to check if there are no lectures scheduled today
            let c = 0;
            for (let i=0; i<timetable.length; i++)
            {
                if (Math.floor(timetable[i]['sched_no']) == d)
                {
                    reply += timetable[i]['title'];
                    reply += ' at ' + timetable[i]['time'];
                    c += 1;
                }                
            }
            // if no lectures scheduled for tomorrow
            if (c == 0)
            {
                reply += 'no lectures';
            }
            speech.text = reply;
        }   
        // if user requests schedule and none of the other keywords     
        else
        {
            let reply = 'Sorry, I did not understand. ';
            reply += 'If you are requesting your schedule, you may request schedule for this week, today, tomorrow, or a particular week day. ';
            reply += 'You may also request when is a particular module lecture.'
            speech.text = reply;
        }        
    }
    // if user requests schedule of a specific lecture (module)
    else if (req.includes('lecture') || req.includes('module') || req.includes('3140'))
    {
        // if user requests schedule for NIT module
        if (req.includes('novel') || req.includes('NIT'))
        {
            let reply = 'Your lecture for novel interaction technologies is scheduled for ';
            for (let i=0; i<timetable.length; i++)
            {
                if (timetable[i]['title'] == 'novel interaction technologies')
                {
                    reply += timetable[i]['day'];
                    reply += ' at ' + timetable[i]['time'];
                }                
            }
            speech.text = reply;
        }
        // if user requests schedule for BI module
        else if (req.includes('business') || req.includes('BI') || req.includes('3340'))
        {
            let reply = 'Your lecture for business intelligence is scheduled for ';
            for (let i=0; i<timetable.length; i++)
            {
                if (timetable[i]['title'] == 'business intelligence')
                {
                    reply += timetable[i]['day'];
                    reply += ' at ' + timetable[i]['time'];
                }                
            }
            speech.text = reply;
        }
        // if user requests schedule for AI module
        else if (req.includes('artificial') || req.includes('AI') || req.includes('3170'))
        {
            let reply = 'Your lecture for artificial intelligence is scheduled for ';
            for (let i=0; i<timetable.length; i++)
            {
                if (timetable[i]['title'] == 'artificial intelligence')
                {
                    reply += timetable[i]['day'];
                    reply += ' at ' + timetable[i]['time'];
                }                
            }
            speech.text = reply;
        }
        // if user requests schedule for a lecture/module and none of the other keywords
        else
        {
            let reply = 'Sorry, I did not understand. ';
            reply += 'If you are requesting the time of your lecture, please request lecture for a current module title';
            speech.text = reply;
        } 
    }
    // if user requests exam dates
    else if (req.includes('exam') || req.includes('exams'))
    {        
        // if user requests exam schedule for AI module
        if (req.includes('artificial') || req.includes('AI') || req.includes('3170'))
        {
            let reply = 'For artificial intelligence you have ';
            let r = getExams('artificial intelligence');
            reply += r;
            speech.text = reply;
        }
        // if user requests exam schedule for BI module
        else if (req.includes('business') || req.includes('BI') || req.includes('3340'))
        {
            let reply = 'For business intelligence you have ';
            let r = getExams('business intelligence');
            reply += r;            
            speech.text = reply;
        }
        // if user requests exam schedule for NIT module
        else if (req.includes('novel') || req.includes('NIT') || req.includes('3140'))
        {
            let reply = 'For novel interaction technologies you have ';
            let r = getExams('novel interaction technologies');
            reply += r;            
            speech.text = reply;
        }
        // if user requests exam schedule for all modules
        else
        {
            let date = getDayDateTime();
            date = date[1];
            let reply = 'you have ';
            let counter = 0;
            for (let i=0; i<exams.length; i++)
            {
                let dateCheck = exams[i]['sched_no'];
                if (dateCheck > date)
                {
                    reply += 'an exam for ';
                    reply += exams[i]['mod'];
                    reply += ' on '
                    reply += exams[i]['day'];
                    reply += ' ';
                    reply += exams[i]['date'];
                    counter += 1;
                }               
            }
            // if no exam is coming up
            if (counter == 0)
            {
                reply += 'no exams scheduled for this scholastic year';
            }            
            speech.text = reply;
        }
    }
    // if user requests date of a coursework deadline
    else if (req.includes('deadline') || req.includes('deadlines') || req.includes('coursework'))
    {        
        // if user requests deadlines for AI module
        if (req.includes('artificial') || req.includes('AI') || req.includes('3170'))
        {
            let reply = 'For artificial intelligence you have ';
            let r = getDeadline('artificial intelligence');
            reply += r;
            speech.text = reply;
        }
        // if user requests deadlines for BI module
        else if (req.includes('business') || req.includes('BI') || req.includes('3340'))
        {
            let reply = 'For business intelligence you have ';
            let r = getDeadline('business intelligence');
            reply += r;
            speech.text = reply;
        }
        // if user requests deadlines for NIT module
        else if (req.includes('novel') || req.includes('NIT') || req.includes('3140'))
        {
            let reply = 'For novel interaction technologies you have ';
            let r = getDeadline('novel interaction technologies');
            reply += r;
            speech.text = reply;
        }
        // if user requests deadline but did not specify the module
        else
        {
            let reply = 'I believe that you want to know your deadlines.  If so please request deadline for a specific module';         
            speech.text = reply;
        }
    }
    // if user requests results of a module
    else if (req.includes('result') || req.includes('results'))
    {
        // if user requests results for AI module
        if (req.includes('artificial') || req.includes('AI') || req.includes('3170'))
        {
            let reply = 'For artificial intelligence ';
            let r = getResults('artificial intelligence');
            reply += r;
            speech.text = reply;
        }
        // if user requests results for BI module
        else if (req.includes('business') || req.includes('BI') || req.includes('3340'))
        {
            let reply = 'For business intelligence ';
            let r = getResults('business intelligence');
            reply += r;
            speech.text = reply;
        }
        // if user requests results for AI module
        else if (req.includes('novel') || req.includes('NIT') || req.includes('3140'))
        {
            let reply = 'For novel interaction technologies ';
            let r = getResults('novel interaction technologies');
            reply += r;
            speech.text = reply;
        }
        // if user requests results but did not specify the module
        else
        {
            let reply = 'I believe that you want to know your results.  If so please request results for a specific module';         
            speech.text = reply;
        }
    }
    // if user requests if there are any extra-curricular activities
    else if ((req.includes('extra') && req.includes('activities')) || (req.includes('activities')) || (req.includes('activity')) || (req.includes('event')) || (req.includes('events')))
    {
        // obtain current month and day of the month
        let date = getDayDateTime();
        date = date[1];
        let counter = 0;
        let reply = 'Extra curricular activities ';
        for (let i=0; i<activities.length; i++)
        {
            let dateCheck = activities[i]['sched_no'];
            if (dateCheck > date)
            {
                if (counter == 0)
                {
                    reply += 'include ';
                }
                else
                {
                    reply += ' and ';
                }
                reply += activities[i]['title'];
                reply += ' on ';
                reply += activities[i]['day'];
                reply += ' ';
                reply += activities[i]['date'];
                reply += ' at ';
                reply += activities[i]['time'];
                counter += 1;
            }
            else if (dateCheck == 0)
            {
                if (counter == 0)
                {
                    reply += 'include ';
                }
                else
                {
                    reply += ' and ';
                }
                reply += activities[i]['title'];
                reply += ' throughout the year';
                counter += 1;
            }   
        }
        if (counter == 0)
        {
            reply += ' are not scheduled for this year yet';
        }
        speech.text = reply;
    }
    // if user requests for unread emails
    else if (req.includes('email') || req.includes('emails') || req.includes('unread') || req.includes('inbox'))
    {
        if (emails.length == 0)
        {
            let reply = 'You have no unread emails in your inbox';
            speech.text = reply;
        }
        else
        {
            let reply = 'These are your unread emails. ';
            for (let i=0; i<emails.length; i++)
            {
                reply += 'Email from ';
                reply += emails[i]['sender'];
                reply += ', titled ';
                reply += emails[i]['title'];
                reply += '.  ';
            }
            speech.text = reply;
        }
    }
    // if user requests weather
    else if (req.includes('weather'))
    {
        let data = await getWeather();
        let reply = 'Today weather comprises of ';
        let feels = data.main.feels_like;
        let max = data.main.temp_max;
        let min = data.main.temp_min;
        let desc = data.weather[0].description;
        let wind = data.wind.speed;
        // conversion from Kelvin to Celsius --> celsuis = Kelvin - 273.15
        feels = Math.floor(feels - 273.15);
        max = Math.floor(max - 273.15);
        min = Math.floor(min - 273.15);
        reply += desc;
        reply += ', with wind speed of ';
        reply += wind;
        reply += ', and maximum temperature of ';
        reply += max;
        reply += ' degrees, minimum of ';
        reply += min;
        reply += ' degrees, and it feels like ';
        reply += feels;
        reply += ' degrees. ';
        if (feels < 11)
        {
            reply += ' Keep warm.';
        }
        speech.text = reply;
    }
    // if user requests news 
    else if (req.includes('news'))
    {
        let response = await getNews();
        let reply = 'Top headlines for today. ';
        // inform user of the first 3 news generated by the api
        reply += response.data[0]['title'];
        reply += '. Source: ';
        reply += response.data[0]['source'];
        reply += '.  Second article says. ';
        reply += response.data[1]['title'];
        reply += '. Source: ';
        reply += response.data[1]['source'];
        reply += '.  Third article says. ';
        reply += response.data[2]['title'];
        reply += '. Source: ';
        reply += response.data[2]['source'];
        speech.text = reply;   
    }
    
    // if user says thank you
    else if (req.includes('thank you') || req.includes('thanks'))
    {
        let reply = 'You are welcome';
        speech.text = reply;
    }
    // if user says bye
    else if (req.includes('bye') || req.includes('goodbye'))
    {
        let reply = bye[Math.floor(Math.random() * bye.length)];
        speech.text = reply;
    }
    // if user did not say any of the keywords
    else
    {
        let reply = "Sorry, I did not understand. Can you repeat your request?";
        speech.text = reply;
    }

    // if the bot sound is switched on, output the bot speaking too, otherwise output the text only
    if (bot_vol == "on")
    {
        window.speechSynthesis.speak(speech);
    }

    // adding the new message at the bottom of the chat container
    chat_container.appendChild(addBotMsg(speech.text));
    // auto-scrolling the chat to show the latest messages
    chat_container.scrollTop = chat_container.scrollHeight;

    // if user asked for the weekly schedule, display the image
    if (weekly_sched == 1)
    {
        // display weekly timetable image
        let display = '<div class="bot-bubble img-reply"><img src="assets/schedule.jpg" alt="test image"></div>';
        display += '<div class="bot-bubble">hover on the image to enlarge it</div>';
        // adding the new message at the bottom of the chat container
        chat_container.appendChild(addBotMsg(display));
        // auto-scrolling the chat to show the latest messages
        chat_container.scrollTop = chat_container.scrollHeight;
        // reset the global variable
        weekly_sched = 0;
    }
}

// obtain today's date - day of the week (0-6; 0=Sunday), month (0-11), day of the month (0-31), hour (0-23), minute (0-59)
function getDayDateTime()
{
    let d = new Date();
    let wkday = d.getDay();
    let month = d.getMonth();
    let month_date = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();

    // adjusting month to reflect scholastic year (starting October)
    if (month > 8)
    {
        month = month - 9;
    }
    else 
    {
        month = month + 3;
    }
    let today_date = month + (month_date / 100);    // number format: month.month_date
    let today_time = hour + (minute / 100);         // number format: hour.minute

    let today = [];
    today.push(wkday);
    today.push(today_date);
    today.push(today_time);    
    
    return today;
}

// function to obtain the dates of the exams
function getExams(moduleTtitle)
{
    // obtain current month and day of the month
    let date = getDayDateTime();
    date = date[1];
    let counter = 0;
    let reply = '';
    for (let i=0; i<exams.length; i++)
    {
        if (exams[i]['mod'] == moduleTtitle)
        {            
            let dateCheck = exams[i]['sched_no'];
            if (dateCheck > date)
            {
                // if more than one exam, create a sentence format
                if (counter >= 1)
                {
                    reply += ', and '
                }
                reply += ' an exam on ';
                reply += exams[i]['day'];
                reply += ' ';
                reply += exams[i]['date'];
                counter += 1;
            }
        }                
    }
    // if no exam is coming up
    if (counter == 0)
    {
        reply += 'no exams scheduled for this scholastic year';
    }
    return reply;
}

// function to return the reply for a request of coursework deadline
function getDeadline(moduleTitle)
{
    // obtain current month and day of the month
    let date = getDayDateTime();
    date = date[1];
    let counter = 0;
    let reply = '';
    // loop through the timetable array
    for (let i=0; i<timetable.length; i++)
    {
        // find the module that the user requested
        if (timetable[i]['title'] == moduleTitle)
        {
            // check if there is a coursework 1 due for this module
            if ('cw1_due' in timetable[i])
            {
                // check whethere this coursework is due in a future date
                let dateCheck = timetable[i]['cw1_due'];
                if (dateCheck > date)
                {
                    reply += 'coursework 1 due for ';
                    reply += timetable[i]['cw1_date'];
                    counter += 1;
                }
            }
            // check if there is a coursework 2 due for this module
            if ('cw2_due' in timetable[i])
            {
                // check whethere this coursework is due in a future date
                let dateCheck = timetable[i]['cw2_due'];
                if (dateCheck > date)
                {                    
                    // if more than one exam, create a sentence format
                    if (counter >= 1)
                    {
                        reply += ', and '
                    }
                    reply += ' coursework 2 due for ';
                    reply += timetable[i]['cw2_date'];
                    counter += 1;
                }
            }
            // check if there is a coursework 3 due for this module
            if ('cw3_due' in timetable[i])
            {
                // check whethere this coursework is due in a future date
                let dateCheck = timetable[i]['cw3_due'];
                if (dateCheck > date)
                {
                    // if more than one exam, create a sentence format
                    if (counter >= 1)
                    {
                        reply += ', and '
                    }
                    reply += ' coursework 3 due for ';
                    reply += timetable[i]['cw3_date'];
                    counter += 1;
                }
            }
        }                
    }
    // if no exam is coming up
    if (counter == 0)
    {
        reply += 'no courseworks due for this scholastic year';
    }          
    return reply;  
}

// function to return the reply for a request of module results
function getResults(moduleTitle)
{
    let counter = 0;
    let reply = '';
    // loop through the timetable array
    for (let i=0; i<timetable.length; i++)
    {
        // find the module that the user requested
        if (timetable[i]['title'] == moduleTitle)
        {
            // check if there is a coursework 1 in this module
            if ('cw1_res' in timetable[i])
            {
                // check whether the coursework result has been published
                if (timetable[i]['cw1_res'] != "n/a")
                {
                    reply += 'you obtained ';
                    reply += timetable[i]['cw1_res'];
                    reply += ' for coursework 1. ';
                    // checking whether student got a distinction
                    let n = parseInt(timetable[i]['cw1_res']);
                    if (n >= 70)
                    {
                        reply += ' Distinction, well done. ';
                    }
                    counter += 1;
                }
            }
            // check if there is a coursework 2 in this module
            if ('cw2_res' in timetable[i])
            {
                // check whether the coursework result has been published
                if (timetable[i]['cw2_res'] != "n/a")
                {
                    reply += ' you obtained ';
                    reply += timetable[i]['cw2_res'];
                    reply += ' for coursework 2. ';
                    // checking whether student got a distinction
                    let n = parseInt(timetable[i]['cw1_res']);
                    if (n >= 70)
                    {
                        reply += ' Distinction, well done. ';
                    }
                    counter += 1;
                }
            }
            // check if there is a coursework 3 in this module
            if ('cw3_res' in timetable[i])
            {
                // check whether the coursework result has been published
                if (timetable[i]['cw3_res'] != "n/a")
                {
                    reply += ' you obtained ';
                    reply += timetable[i]['cw3_res'];
                    reply += ' for coursework 3. ';
                    // checking whether student got a distinction
                    let n = parseInt(timetable[i]['cw1_res']);
                    if (n >= 70)
                    {
                        reply += ' Distinction, well done. ';
                    }
                    counter += 1;
                }
            }
        }                
    }
    // if no exam is coming up
    if (counter == 0)
    {
        reply += 'you have no results issued yet';
    }          
    return reply;  
}

// function to return the weather forecast for today in Valletta (id=2562305)
async function getWeather()
{
    // weather API key
    const wKey = 'c8876db9435bccb5cceb49140a490cf7'; 
    // await -> wait for the response before returning the data
    let response = await fetch('https://api.openweathermap.org/data/2.5/weather?id=2562305&appid=' + wKey);
    let data = await response.json();
    return data;
}

// function to return the news about Malta
async function getNews() 
{
    // mediastack API key - 'a04c4b4b226a72ec5aaaae08a388a581' - included in the url string
    let url = `http://api.mediastack.com/v1/news?access_key=a04c4b4b226a72ec5aaaae08a388a581&countries=mt`;
    const axios_response = await axios.get(url);
    return axios_response.data;
}
