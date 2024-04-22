// получить данные по АПИ
//вставить слово в контейнер (results-word)
//добавить функционал для воспроизведения звука
//вставить в контейнер в результатами


let state = {
    word: "",
    phonetics: [],
    meanings: []
}

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
const input = document.getElementById("word-input");
const form = document.querySelector('.form')
const containerWord = document.querySelector('.results-word')
const soundButton = document.querySelector('.results-sound')
const resultsWrapper = document.querySelector('.results')
const resultsList = document.querySelector('.results-list')
const errorContainer = document.querySelector('.error')
const loadingIndicator = document.querySelector('.load');

const showError = (error) => {
    errorContainer.style.display = 'block'
    resultsWrapper.style.display = 'none'

    errorContainer.innerText = error.message
}
const renderDefinition = (itemDefinition) => {
    const example = itemDefinition.example
        ? `<div class="results-item__example">
    <p>Example: <span>${itemDefinition.example}</span></p>
  </div>`
        : "";

    return ` 
    <div class="results-item__definition">
        <p>${itemDefinition.definition}</p>
        ${example}
    </div>`
}

const getDefinitions = (definitions) => {
    return definitions.map(renderDefinition).join("")
}

const renderItem = (item) => {
    return ` <div class="results-item">
    <div class="results-item__part">${item.partOfSpeech}</div>

    <div class="results-item__definitions">
       ${getDefinitions(item.definitions)}

    </div>
</div>`;
}
const showResults = () => {
    resultsWrapper.style.display = "block";
    resultsList.innerHTML = "";

    state.meanings.forEach((item) => (resultsList.innerHTML += renderItem(item)))
}
const insertWord = () => {
    containerWord.innerText = state.word
}

const handleSubmit = async (e) => {
    e.preventDefault();
    loadingIndicator.style.display = 'block';
    errorContainer.style.display = 'none'

    if (!state.word.trim()) {
    loadingIndicator.style.display = 'none';
    return;
    }
    try {
        const response = await fetch(`${url}${state.word}`);
        const data = await response.json();


        if (response.ok && data.length) {
            const item = data[0]

            state = {
                ...state,
                phonetics: item.phonetics,
                meanings: item.meanings,

            }
            insertWord()
            showResults();
        } else {
            showError(data)
        }
    } catch (err) {
        console.log(err)
    } finally {
        loadingIndicator.style.display = 'none'; // Всегда скрываем индикатор загрузки в конце
    }
}

const handleKeyup = (e) => {
    const value = e.target.value;
    state.word = value;
}

const handleSound = () => {
    if (state.phonetics.length) {
        const sound = state.phonetics[0]

        if (sound.audio) {
            new Audio(sound.audio).play();
        }
    }
}

//EVENTS
input.addEventListener('keyup', handleKeyup)
form.addEventListener('submit', handleSubmit)
soundButton.addEventListener('click', handleSound)

