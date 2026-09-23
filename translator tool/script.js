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


// Character Counter
inputText.addEventListener("input", () => {

    charCount.textContent =
        `${inputText.value.length} / 5000`;

});


// Translation Function
async function translateText() {

    const text = inputText.value.trim();

    const source = sourceLanguage.value;
    const target = targetLanguage.value;

    errorMessage.textContent = "";

    if (!text) {
        errorMessage.textContent =
            "Please enter some text to translate.";

        return;
    }

    if (source !== "auto" && source === target) {

        outputText.textContent =
            "Source and target languages are the same.";

        return;
    }

    translateButton.disabled = true;
    translateButton.textContent = "Translating...";
    translationStatus.textContent = "Please wait...";

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

        outputText.textContent = translatedText;

        translationStatus.textContent = "Translated ✓";

    } catch (error) {

        console.error(error);

        outputText.textContent =
            "Unable to translate. Please try again.";

        errorMessage.textContent =
            "Something went wrong. Check your internet connection.";

        translationStatus.textContent = "";

    } finally {

        translateButton.disabled = false;
        translateButton.textContent = "Translate";

    }
}


// Translate Button
translateButton.addEventListener(
    "click",
    translateText
);


// Ctrl + Enter to Translate
inputText.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key === "Enter") {
        translateText();
    }

});


// Swap Languages
swapButton.addEventListener("click", () => {

    // Auto Detect cannot be used as target
    if (sourceLanguage.value === "auto") {
        alert("Please select a source language before swapping.");
        return;
    }

    const oldSource = sourceLanguage.value;
    const oldTarget = targetLanguage.value;

    sourceLanguage.value = oldTarget;
    targetLanguage.value = oldSource;

    // Swap text
    const oldInput = inputText.value;
    const oldOutput = outputText.textContent;

    inputText.value =
        oldOutput === "Translation will appear here..."
            ? ""
            : oldOutput;

    outputText.textContent =
        oldInput || "Translation will appear here...";

    charCount.textContent =
        `${inputText.value.length} / 5000`;

});


// Copy Translation
copyButton.addEventListener("click", async () => {

    const text = outputText.textContent;

    if (
        !text ||
        text === "Translation will appear here..."
    ) {
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        copyButton.textContent = "✓";

        setTimeout(() => {
            copyButton.textContent = "📋";
        }, 1500);

    } catch (error) {

        alert("Unable to copy text.");

    }

});


// Text-to-Speech Function
function speak(text, language) {

    if (!text.trim()) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = language === "auto"
        ? "en-US"
        : language;

    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);

}


// Speak Input
speakInput.addEventListener("click", () => {

    speak(
        inputText.value,
        sourceLanguage.value
    );

});


// Speak Output
speakOutput.addEventListener("click", () => {

    const text = outputText.textContent;

    if (
        text &&
        text !== "Translation will appear here..."
    ) {

        speak(
            text,
            targetLanguage.value
        );

    }

});