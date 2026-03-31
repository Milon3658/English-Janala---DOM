const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
};
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button onClick = "loadLessonsWord(${lesson.level_no})" class="btn btn-outline btn-primary"> 
    <i class="fa-solid fa-book-open">
    </i>Lesson ${lesson.level_no}</button>
    `;
    levelContainer.append(btnDiv);
  }
};
// Load lesson
loadLessons();

// Load dynamic lesson words
const loadLessonsWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayLevelWords(data.data));
};

const displayLevelWords = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length === 0) {
    const wordDiv = document.createElement("div");
    wordDiv.innerHTML = `
     <div
        class="flex flex-col items-center justify-items-center w-full font-bangla"
      >
      <img src="./assets/alert-error.png" alt="">
        <p class="text-gray-500 text-sm md:text-lg">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h1 class="text-2xl font-semibold text-center mt-2">
          নেক্সট Lesson এ যান
        </h1>
      </div>
    `;
    wordContainer.append(wordDiv);
    return;
  }
  for (let word of words) {
    const wordDiv = document.createElement("div");
    wordDiv.innerHTML = `
    <div class="card  md:w-96 bg-base-100 shadow-xl my-5 space-y-4">
    <div class="card-body text-center">
      <h2 class="font-bold text-xl">${word.word ?? ""}</h2>
      <p>Meaning /Pronounciation</p>
      <p>${word.meaning ?? ""}</p>
      <div class="flex flex-row justify-between">
      <button onClick="LoadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] h-8 w-8"><i class="fa-solid fa-circle-info"></i></button>
      <button onClick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] h-8 w-8"><i class="fa-solid fa-volume-high"></i></button>
      </div>
    </div>
  </div>
    `;
    wordContainer.append(wordDiv);
  }
};

const LoadWordDetail = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayWordDetails(data.data));
};

const displayWordDetails = (word) => {
  //   console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = "";
  detailsBox.innerHTML = `
    <div class="flex flex-row">
            <h2 class="text-2xl font-bold">
              ${word.word} (
              <button class="hover:cursor-pointer" onClick="pronounceWord('${word.word}')"><i class="fa-solid fa-microphone-lines"></i></button>
              ${word.pronunciation} )
            </h2>
          </div>
          <h2 class="text-xl font-bold mt-2">Meaning</h2>
          <p class="text-md">${word.meaning}</p>

          <h2 class="text-xl font-bold mt-2">Example</h2>
          <p>${word.sentence}</p>

          <p class="font-bangla mt-4 font-bold">সমার্থক শব্দ গুলো</p>
          <div>
         ${createElement(word.synonyms)}
          </div>
    
    `;
  document.getElementById("my_modal_5").showModal();
};

const createElement = (arr) => {
  const htmlElements = arr.map((item) => `<span class="btn">${item}</span>`);
  console.log(htmlElements);
  return htmlElements;
};

document.getElementById("btn-search").addEventListener("click", () => {
  const inputValue = document.getElementById("input-search");
  const searchValue = inputValue.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWords(filterWords);
    });
});
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
