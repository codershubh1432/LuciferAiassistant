
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

let isSpeaking = false;
let isListening = false;
let isRecognitionActive = false;

function speak(text) {
    return new Promise((resolve) => {
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        isSpeaking = true;
        console.log("🔊 Speaking:", text);

        try { 
            recognition.stop(); 
            console.log("🛑 Galaxy stopped listening while speaking"); 
        } catch (e) { 
        
        }

        utterance.onend = () => {
            isSpeaking = false;
            console.log("✅ Finished speaking");
            try { 
                if (!isRecognitionActive && isListening) {
                    recognition.start(); 
                    console.log("🎤 Galaxy started listening after speaking");
                }
            } catch (e) { 
                console.error("Error restarting recognition after speaking:", e);
            }
            resolve();
        };

        window.speechSynthesis.speak(utterance);
    });
}

function wishMe() {
    let hours = new Date().getHours();
    if (hours < 12) speak("Good Morning Sir");
    else if (hours < 16) speak("Good Afternoon Sir");
    else speak("Good Evening Sir");
}

window.addEventListener("load", () => {
});

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

function startListening() {
    if (isListening) {
        console.log("🛑 Already listening");
        return;
    }
    isListening = true;

    recognition.onstart = () => {
        isRecognitionActive = true;
        console.log("🎤 Listening started...");
    };

    recognition.onresult = async (event) => {
        let transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        content.innerText = transcript;

        if (isSpeaking) return;

        transcript = transcript.replace(/^(hey |ok |please |hi |hello )/, "");

        if (transcript.includes("Galaxy")) {
            let commandText = transcript.replace("Galaxy", "").trim();
            let commands = commandText.split(/\s*(?:and|then|,)\s*/);
            commands = commands.filter(cmd => cmd.trim() !== "");

            for (let cmd of commands) {
                await takeCommand(cmd.trim());
            }
        }
    };

    recognition.onend = () => {
        isRecognitionActive = false;
        console.log("⚠️ Listening ended");
        if (!isSpeaking && isListening) {
            console.log("🔄 Restarting listening...");
            try { 
                if (!isRecognitionActive) recognition.start(); 
            } catch (e) {
                console.error("Error restarting recognition:", e);
            }
        }
    };

    try { 
        if (!isRecognitionActive) recognition.start(); 
    } catch (e) {
        console.error("Error starting recognition:", e);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startGalaxy");
    startButton.addEventListener("click", () => {
        speak("Hello sir, Galaxy is now listening.")
            .then(() => startListening());
    });
});

function wordsToNum(word) {
    const numberWords = {
        "one":1, "two":2, "three":3, "four":4, "five":5, "six":6,
        "seven":7, "eight":8, "nine":9, "ten":10, "eleven":11, "twelve":12,
        "thirteen":13, "fourteen":14, "fifteen":15, "sixteen":16,
        "seventeen":17, "eighteen":18, "nineteen":19, "twenty":20
    };
    word = word.trim();
    return numberWords[word] || null;
}

async function takeCommand(message) {
    message = message.trim();
    if (!message) return;

    if (message.includes("hello") || message.includes("hey")) {
        await speak("Hello sir, what can I help you with?");
        return;
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString();
        await speak("The time is " + time);
        return;
    } else if (message.includes("date")) {
        let date = new Date().toDateString();
        await speak("Today is " + date);
        return;
    } else if (message.includes("open youtube")) {
        await speak("Opening YouTube");
        window.open("https://www.youtube.com/");
        return;
    } else if (message.includes("stop listening") || message.includes("goodbye")) {
        await speak("Okay sir, I will stop listening now.");
        recognition.stop();
        isListening = false; 
        return;
    } else if (message.includes("introduce yourself")) {
        await speak("Myself Galaxy, a virtual A I assistant built to improve English communication skills, created by a programer");
        return;
    } else if (message.includes("who is devil")) {
        await speak("In short, Lucifer is Morning Star, Venus in its original meaning. Later Christians identified him as the fallen angel, the devil, and the ruler of Hell.");
        return;
    } else if (message.toLowerCase().includes("what is")) {
        try {
            let expression = message.toLowerCase().split("what is")[1].trim();
            let match = expression.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
            if (match) {
                let num1 = parseFloat(match[1]);
                let operator = match[2];
                let num2 = parseFloat(match[3]);
                let result;

                switch(operator) {
                    case '+':
                        result = num1 + num2;
                        await speak(`${num1} plus ${num2} is ${result}`);
                        break;
                    case '-':
                        result = num1 - num2;
                        await speak(`${num1} minus ${num2} is ${result}`);
                        break;
                    case '*':
                        result = num1 * num2;
                        await speak(`${num1} multiplied by ${num2} is ${result}`);
                        break;
                    case '/':
                        if (num2 === 0) await speak("Sorry sir, division by zero is not allowed.");
                        else {
                            result = num1 / num2;
                            await speak(`${num1} divided by ${num2} is ${result}`);
                        }
                        break;
                    default:
                        await speak("Sorry sir, please check the input you provided.");
                }
            } else {
                await speak("Sorry sir, I could not understand the numbers or operation.");
            }
        } catch (err) {
            await speak("Sorry sir, tell the exaxt words.");
        }
        return;
    }
   else if (message.includes("table of two")) {
    await speak("2 times 1 is 2, 2 times 2 is 4, 2 times 3 is 6, 2 times 4 is 8, 2 times 5 is 10, 2 times 6 is 12, 2 times 7 is 14, 2 times 8 is 16, 2 times 9 is 18, 2 times 10 is 20.");
    return;
}
else if (message.includes("table of three")) {
    await speak("3 times 1 is 3, 3 times 2 is 6, 3 times 3 is 9, 3 times 4 is 12, 3 times 5 is 15, 3 times 6 is 18, 3 times 7 is 21, 3 times 8 is 24, 3 times 9 is 27, 3 times 10 is 30.");
    return;
}
else if (message.includes("table of four")) {
    await speak("4 times 1 is 4, 4 times 2 is 8, 4 times 3 is 12, 4 times 4 is 16, 4 times 5 is 20, 4 times 6 is 24, 4 times 7 is 28, 4 times 8 is 32, 4 times 9 is 36, 4 times 10 is 40.");
    return;
}else if (message.includes("table of five")) {
    await speak("5 times 1 is 5, 5 times 2 is 10, 5 times 3 is 15, 5 times 4 is 20, 5 times 5 is 25, 5 times 6 is 30, 5 times 7 is 35, 5 times 8 is 40, 5 times 9 is 45, 5 times 10 is 50.");
    return;
}
else if (message.includes("table of six")) {
    await speak("6 times 1 is 6, 6 times 2 is 12, 6 times 3 is 18, 6 times 4 is 24, 6 times 5 is 30, 6 times 6 is 36, 6 times 7 is 42, 6 times 8 is 48, 6 times 9 is 54, 6 times 10 is 60.");
    return;
}
else if (message.includes("table of seven")) {
    await speak("7 times 1 is 7, 7 times 2 is 14, 7 times 3 is 21, 7 times 4 is 28, 7 times 5 is 35, 7 times 6 is 42, 7 times 7 is 49, 7 times 8 is 56, 7 times 9 is 63, 7 times 10 is 70.");
    return;
}
else if (message.includes("table of eight")) {
    await speak("8 times 1 is 8, 8 times 2 is 16, 8 times 3 is 24, 8 times 4 is 32, 8 times 5 is 40, 8 times 6 is 48, 8 times 7 is 56, 8 times 8 is 64, 8 times 9 is 72, 8 times 10 is 80.");
    return;
}
else if (message.includes("table of nine")) {
    await speak("9 times 1 is 9, 9 times 2 is 18, 9 times 3 is 27, 9 times 4 is 36, 9 times 5 is 45, 9 times 6 is 54, 9 times 7 is 63, 9 times 8 is 72, 9 times 9 is 81, 9 times 10 is 90.");
    return;
}
else if (message.includes("table of ten")) {
    await speak("10 times 1 is 10, 10 times 2 is 20, 10 times 3 is 30, 10 times 4 is 40, 10 times 5 is 50, 10 times 6 is 60, 10 times 7 is 70, 10 times 8 is 80, 10 times 9 is 90, 10 times 10 is 100.");
    return;
}
else if (message.includes("table of eleven")) {
    await speak("11 times 1 is 11, 11 times 2 is 22, 11 times 3 is 33, 11 times 4 is 44, 11 times 5 is 55, 11 times 6 is 66, 11 times 7 is 77, 11 times 8 is 88, 11 times 9 is 99, 11 times 10 is 110.");
    return;
}

else if (message.includes("table of twelve")) {
    await speak("12 times 1 is 12, 12 times 2 is 24, 12 times 3 is 36, 12 times 4 is 48, 12 times 5 is 60, 12 times 6 is 72, 12 times 7 is 84, 12 times 8 is 96, 12 times 9 is 108, 12 times 10 is 120.");
    return;
}

else if (message.includes("table of thirteen")) {
    await speak("13 times 1 is 13, 13 times 2 is 26, 13 times 3 is 39, 13 times 4 is 52, 13 times 5 is 65, 13 times 6 is 78, 13 times 7 is 91, 13 times 8 is 104, 13 times 9 is 117, 13 times 10 is 130.");
    return;
}

else if (message.includes("table of fourteen")) {
    await speak("14 times 1 is 14, 14 times 2 is 28, 14 times 3 is 42, 14 times 4 is 56, 14 times 5 is 70, 14 times 6 is 84, 14 times 7 is 98, 14 times 8 is 112, 14 times 9 is 126, 14 times 10 is 140.");
    return;
}

else if (message.includes("table of fifteen")) {
    await speak("15 times 1 is 15, 15 times 2 is 30, 15 times 3 is 45, 15 times 4 is 60, 15 times 5 is 75, 15 times 6 is 90, 15 times 7 is 105, 15 times 8 is 120, 15 times 9 is 135, 15 times 10 is 150.");
    return;
}

else if (message.includes("table of sixteen")) {
    await speak("16 times 1 is 16, 16 times 2 is 32, 16 times 3 is 48, 16 times 4 is 64, 16 times 5 is 80, 16 times 6 is 96, 16 times 7 is 112, 16 times 8 is 128, 16 times 9 is 144, 16 times 10 is 160.");
    return;
}

else if (message.includes("table of seventeen")) {
    await speak("17 times 1 is 17, 17 times 2 is 34, 17 times 3 is 51, 17 times 4 is 68, 17 times 5 is 85, 17 times 6 is 102, 17 times 7 is 119, 17 times 8 is 136, 17 times 9 is 153, 17 times 10 is 170.");
    return;
}

else if (message.includes("table of eighteen")) {
    await speak("18 times 1 is 18, 18 times 2 is 36, 18 times 3 is 54, 18 times 4 is 72, 18 times 5 is 90, 18 times 6 is 108, 18 times 7 is 126, 18 times 8 is 144, 18 times 9 is 162, 18 times 10 is 180.");
    return;
}else if (message.includes("table of nineteen")) {
    await speak("19 times 1 is 19, 19 times 2 is 38, 19 times 3 is 57, 19 times 4 is 76, 19 times 5 is 95, 19 times 6 is 114, 19 times 7 is 133, 19 times 8 is 152, 19 times 9 is 171, 19 times 10 is 190.");
    return;
}else if (message.includes("table of twenty")) {
    await speak("20 times 1 is 20, 20 times 2 is 40, 20 times 3 is 60, 20 times 4 is 80, 20 times 5 is 100, 20 times 6 is 120, 20 times 7 is 140, 20 times 8 is 160, 20 times 9 is 180, 20 times 10 is 200.");
    return;
}else if (
    message.includes("animal names") ||
    message.includes("animal name") ||
    message.includes("four legs animal")
) {
    await speak("Here are some four leg animals. Cat, spelling C A T.           Dog, spelling D O G.            Lion, spelling L I O N.            Tiger, spelling T I G E R.            Horse, spelling H O R S E.            Cow, spelling C O W.            Goat, spelling G O A T.            Sheep, spelling S H E E P.            Elephant, spelling E L E P H A N T.            Zebra, spelling Z E B R A.");
    return;
}else if (message.includes("who is almighty")) {
        await speak("Lord Shiva – the destroyer and transformer. But destroyer here doesn’t mean evil. It means remover of ignorance, ego, and illusion, making way for new creation.");
        return;
    }else if (message.includes("who can you do")) {
        await speak("I can do calculations of any number and tell you exact time and date and tell you the tables like tabe of 2 to 20  i can also tell you animals name open apps for you like youtube and other");
        return;
}
    


