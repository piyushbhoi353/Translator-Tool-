const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const swapButton = document.getElementById("swapButton");

const copyButton = document.getElementById("copyButton");

const speakInput = document.getElementById("speakInput");
const speakOutput = document.getElementById("speakOutput");

const charCount = document.getElementById("charCount");
const errorMessage = document.getElementById("errorMessage");
const translationStatus = document.getElementById("translationStatus");


// ===============================
// Character Counter
// ===============================

inputText.addEventListener("input", () => {
    charCount.textContent =
        `${inputText.value.length} / 5000`;
});


// ===============================
// Auto Language Detection
// ===============================

function detectLanguage(text) {

    // Devanagari script
    if (/[\u0900-\u097F]/.test(text)) {

        const lowerText = text.toLowerCase();

        // Common Marathi words
        const marathiWords = [
            "आहे",
            "आणि",
            "माझे",
            "माझं",
            "तुम्ही",
            "काय",
            "नाही",
            "करतो",
            "करते",
            "मला",
            "तुला",
            "आपण",
            "मराठी"
        ];

        for (const word of marathiWords) {
            if (lowerText.includes(word)) {
                return "mr";
            }
        }

        // Otherwise assume Hindi
        return "hi";
    }


    // Gujarati
    if (/[\u0A80-\u0AFF]/.test(text)) {
        return "gu";
    }


    // Bengali
    if (/[\u0980-\u09FF]/.test(text)) {
        return "bn";
    }


    // Tamil
    if (/[\u0B80-\u0BFF]/.test(text)) {
        return "ta";
    }


    // Telugu
    if (/[\u0C00-\u0C7F]/.test(text)) {
        return "te";
    }


    // Kannada
    if (/[\u0C80-\u0CFF]/.test(text)) {
        return "kn";
    }


    // Malayalam
    if (/[\u0D00-\u0D7F]/.test(text)) {
        return "ml";
    }


    // Japanese
    if (/[\u3040-\u30FF]/.test(text)) {
        return "ja";
    }


    // Korean
    if (/[\uAC00-\uD7AF]/.test(text)) {
        return "ko";
    }


    // Chinese
    if (/[\u4E00-\u9FFF]/.test(text)) {
        return "zh";
    }


    // Russian / Cyrillic
    if (/[\u0400-\u04FF]/.test(text)) {
        return "ru";
    }


    // Latin language detection
    const lowerText = text.toLowerCase();


    // French
    const frenchWords = [
        "bonjour",
        "merci",
        "avec",
        "pour",
        "dans",
        "être",
        "vous",
        "je",
        "une",
        "est"
    ];

    if (
        frenchWords.filter(word =>
            lowerText.includes(` ${word} `) ||
            lowerText.startsWith(word + " ") ||
            lowerText.endsWith(" " + word)
        ).length >= 2
    ) {
        return "fr";
    }


    // German
    const germanWords = [
        "hallo",
        "danke",
        "und",
        "ich",
        "nicht",
        "ist",
        "ein",
        "eine",
        "der",
        "die",
        "das"
    ];

    if (
        germanWords.filter(word =>
            lowerText.includes(` ${word} `) ||
            lowerText.startsWith(word + " ") ||
            lowerText.endsWith(" " + word)
        ).length >= 2
    ) {
        return "de";
    }


    // Spanish
    const spanishWords = [
        "hola",
        "gracias",
        "para",
        "como",
        "que",
        "una",
        "es",
        "los",
        "las",
        "por"
    ];

    if (
        spanishWords.filter(word =>
            lowerText.includes(` ${word} `) ||
            lowerText.startsWith(word + " ") ||
            lowerText.endsWith(" " + word)
        ).length >= 2
    ) {
        return "es";
    }


    // Italian
    const italianWords = [
        "ciao",
        "grazie",
        "come",
        "sono",
        "una",
        "che",
        "per",
        "questo"
    ];

    if (
        italianWords.filter(word =>
            lowerText.includes(` ${word} `) ||
            lowerText.startsWith(word + " ") ||
            lowerText.endsWith(" " + word)
        ).length >= 2
    ) {
        return "it";
    }


    // Portuguese
    const portugueseWords = [
        "olá",
        "obrigado",
        "você",
        "para",
        "uma",
        "que",
        "não",
        "como"
    ];

    if (
        portugueseWords.filter(word =>
            lowerText.includes(` ${word} `) ||
            lowerText.startsWith(word + " ") ||
            lowerText.endsWith(" " + word)
        ).length >= 2
    ) {
        return "pt";
    }


    // Default to English for Latin text
    return "en";
}


// ===============================
// Translation Function
// ===============================

async function translateText() {

    const text = inputText.value.trim();

    let source = sourceLanguage.value;
    const target = targetLanguage.value;

    errorMessage.textContent = "";
    translationStatus.textContent = "";


    // Empty input
    if (!text) {

        errorMessage.textContent =
            "Please enter some text to translate.";

        return;
    }


    // Auto Detect
    if (source === "auto") {

        source = detectLanguage(text);

        console.log("Detected language:", source);

        translationStatus.textContent =
            `Detected: ${getLanguageName(source)}`;
    }


    // Same language
    if (source === target) {

        outputText.textContent =
            "Source and target languages are the same.";

        translationStatus.textContent =
            "No translation needed.";

        return;
    }


    translateButton.disabled = true;
    translateButton.textContent = "Translating...";


    if (!translationStatus.textContent.includes("Detected")) {
        translationStatus.textContent = "Please wait...";
    }


    outputText.textContent = "";


    try {

        // MyMemory API
        const url =
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;


        const response = await fetch(url);


        if (!response.ok) {
            throw new Error("Network error");
        }


        const data = await response.json();


        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error("Translation failed");
        }


        const translatedText =
            data.responseData.translatedText;


        outputText.textContent =
            translatedText;


        translationStatus.textContent =
            "Translated ✓";


    } catch (error) {

        console.error(error);


        outputText.textContent =
            "Unable to translate. Please try again.";


        errorMessage.textContent =
            "Translation failed. Please check your internet connection and try again.";


        translationStatus.textContent = "";

    } finally {

        translateButton.disabled = false;

        translateButton.textContent =
            "Translate";
    }
}


// ===============================
// Language Name
// ===============================

function getLanguageName(code) {

    const languages = {

        en: "English",
        hi: "Hindi",
        mr: "Marathi",
        gu: "Gujarati",
        bn: "Bengali",
        ta: "Tamil",
        te: "Telugu",
        kn: "Kannada",
        ml: "Malayalam",
        fr: "French",
        de: "German",
        es: "Spanish",
        it: "Italian",
        pt: "Portuguese",
        ru: "Russian",
        ja: "Japanese",
        ko: "Korean",
        zh: "Chinese"

    };

    return languages[code] || code;
}


// ===============================
// Translate Button
// ===============================

translateButton.addEventListener(
    "click",
    translateText
);


// ===============================
// Ctrl + Enter
// ===============================

inputText.addEventListener("keydown", (event) => {

    if (
        event.ctrlKey &&
        event.key === "Enter"
    ) {

        translateText();
    }

});


// ===============================
// Swap Languages
// ===============================

swapButton.addEventListener("click", () => {

    // Auto Detect cannot become target
    if (sourceLanguage.value === "auto") {

        alert(
            "Please select a source language before swapping."
        );

        return;
    }


    const oldSource =
        sourceLanguage.value;

    const oldTarget =
        targetLanguage.value;


    sourceLanguage.value =
        oldTarget;

    targetLanguage.value =
        oldSource;


    // Swap text
    const oldInput =
        inputText.value;

    const oldOutput =
        outputText.textContent;


    inputText.value =
        oldOutput ===
        "Translation will appear here..."
            ? ""
            : oldOutput;


    outputText.textContent =
        oldInput ||
        "Translation will appear here...";


    charCount.textContent =
        `${inputText.value.length} / 5000`;

});


// ===============================
// Copy Translation
// ===============================

copyButton.addEventListener(
    "click",
    async () => {

        const text =
            outputText.textContent;


        if (
            !text ||
            text ===
            "Translation will appear here..."
        ) {

            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );


            copyButton.textContent = "✓";


            setTimeout(() => {

                copyButton.textContent = "📋";

            }, 1500);


        } catch (error) {

            alert(
                "Unable to copy text."
            );

        }

    }
);


// ===============================
// Text-to-Speech
// ===============================

function speak(text, language) {

    if (!text.trim()) {
        return;
    }


    window.speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(text);


    const speechLanguages = {

        en: "en-US",
        hi: "hi-IN",
        mr: "mr-IN",
        gu: "gu-IN",
        bn: "bn-IN",
        ta: "ta-IN",
        te: "te-IN",
        kn: "kn-IN",
        ml: "ml-IN",
        fr: "fr-FR",
        de: "de-DE",
        es: "es-ES",
        it: "it-IT",
        pt: "pt-PT",
        ru: "ru-RU",
        ja: "ja-JP",
        ko: "ko-KR",
        zh: "zh-CN"

    };


    speech.lang =
        speechLanguages[language] ||
        "en-US";


    speech.rate = 0.9;
    speech.pitch = 1;


    window.speechSynthesis.speak(
        speech
    );
}


// ===============================
// Speak Input
// ===============================

speakInput.addEventListener(
    "click",
    () => {

        let language =
            sourceLanguage.value;


        // Detect language if Auto Detect
        if (language === "auto") {

            language =
                detectLanguage(
                    inputText.value
                );
        }


        speak(
            inputText.value,
            language
        );

    }
);


// ===============================
// Speak Output
// ===============================

speakOutput.addEventListener(
    "click",
    () => {

        const text =
            outputText.textContent;


        if (
            text &&
            text !==
            "Translation will appear here..."
        ) {

            speak(
                text,
                targetLanguage.value
            );

        }

    }
);
