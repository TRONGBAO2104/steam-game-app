const inputSearch = document.querySelector("#search");
let globalPage, globalQuery, globalGenresName, globalTagName;

// GET GENRES LIST
const getGenresGames = async () => {
  try {
    const response = await fetch(
      "https://cs-steam-game-api.herokuapp.com/genres"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(">>> error of getGenresGames: ", error);
  }
};

const renderGenresGames = async () => {
  try {
    const data = await getGenresGames();

    const categoryGame = document.querySelector(".category_area");
    const ulCategoryGame = categoryGame.children[1];
    ulCategoryGame.innerHTML = "";

    data.data.forEach((genresGame) => {
      const liElement = document.createElement("li");
      liElement.classList.add("genres_li");
      liElement.innerHTML = `<a href="#">${genresGame.name}</a>`;
      ulCategoryGame.appendChild(liElement);
    });

    // const genresList = document.querySelectorAll(".genres_list .genres_li");
    // console.log(genresList);
    const genresAElement = document.querySelectorAll(
      ".genres_list .genres_li a"
    );
    genresAElement.forEach((aElement) => {
      aElement.addEventListener("click", (e) => {
        const element = e.target;
        globalGenresName = element.textContent;
        // console.log(element.textContent);
        displayAllGames(
          globalPage,
          globalQuery,
          globalGenresName,
          globalTagName
        );
      });
    });
  } catch (error) {
    console.log(">>> error of renderGenresGames: ", error);
  }
};
renderGenresGames();

// GET TAGS LIST
const getTagsGames = async () => {
  try {
    const response = await fetch(
      "https://cs-steam-game-api.herokuapp.com/steamspy-tags"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(">>> error of getTagsGames: ", error);
  }
};

const renderTagsGames = async () => {
  try {
    const data = await getTagsGames();

    const categoryGame = document.querySelector(".category_area");
    const ulCategoryGame = categoryGame.children[3];
    ulCategoryGame.innerHTML = "";

    data.data.forEach((tagsGame) => {
      const liElement = document.createElement("li");
      liElement.classList.add("tag_li");
      liElement.innerHTML = `<a href="#">${tagsGame.name}</a>`;
      ulCategoryGame.appendChild(liElement);
    });
    const tagAElement = document.querySelectorAll(".tag_list .tag_li a");
    tagAElement.forEach((aElement) => {
      aElement.addEventListener("click", (e) => {
        const element = e.target;
        globalTagName = element.textContent;
        // console.log(element.textContent);
        displayAllGames(
          globalPage,
          globalQuery,
          globalGenresName,
          globalTagName
        );
      });
    });
  } catch (error) {
    console.log(">>> errorRenderTagsGames: ", error);
  }
};
renderTagsGames();

const getAllGames = async (page, query, genresName, tagName) => {
  try {
    let url = "https://cs-steam-game-api.herokuapp.com/games?";

    if (page) url += `page=${page}&`;
    if (query) url += `q=${query}&`;
    if (genresName) url += `genres=${genresName}&`;
    if (tagName) url += `steamspy_tags=${tagName}`;

    const response = await fetch(url);
    if (response.ok) {
      const dataAfterFetchUrl = response.json();
      return dataAfterFetchUrl;
    }
  } catch (error) {
    console.log("error of getAllGame", error);
  }
};

const displayAllGames = async (page, query, genresName, tagName) => {
  try {
    // let page = "1";
    // let query = inputSearch.value;
    // let genresName = "action";
    // let tagName = "indie";

    const data = await getAllGames(page, query, genresName, tagName);

    const gameArea = document.querySelector(".game_area");
    gameArea.innerHTML = "";

    data.data.forEach((game) => {
      const divElement = document.createElement("div");
      divElement.classList.add("game");
      divElement.innerHTML = `<div class="img_game">
            <img onerror="this.src='${game.background}'" src="${game.header_image}" alt="${game.name}" class="img" data-appid="${game.appid}" onClick="renderAppId(this)">
        </div>
        <div class="describe">
            <p class="game_name">${game.name}</p>
            <p class="game_price">$${game.price}</p>
        </div>`;
      gameArea.appendChild(divElement);
    });
  } catch (error) {
    console.log(">>> error of displayAllGames", error);
  }
};
displayAllGames();

const getAppId = async (appId) => {
  try {
    // const dataAppId = document.querySelectorAll("[data-appid]");
    // let appId = dataAppId.dataset.appid
    // console.log(appId);

    const urlAppId = `https://cs-steam-game-api.herokuapp.com/single-game/${appId}`;
    const response = await fetch(urlAppId);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(">>> error: ", error);
  }
};
// getAppId().then((result) => console.log("result getAppId:", result));

const renderAppId = async (id) => {
  try {
    const idType = id.getAttribute("data-appid");
    console.log(">>> idType", idType);
    let appId = idType;
    console.log(">>> appId", appId);

    const dataAfterGetAppId = await getAppId(appId);
    // console.log(">>> dataAfterGetAppId: ", dataAfterGetAppId);

    const gameArea = document.querySelector(".game_area");
    gameArea.innerHTML = "";

    const game = dataAfterGetAppId.data;
    // dataAfterGetAppId.data.forEach((game) => {
    // console.log(game);
    const newDiv = document.createElement("div");
    newDiv.classList.add("show_detail_game");
    newDiv.innerHTML = `<h1>${game.name}</h1>
            <h3>${game.price}$</h3>
            <div class="info_detail">
                <img src="${game.header_image}" alt="">
                <div class="describe_detail">
                    <p>${game.description}</p>
                    <p>
                        RECENT REVIEWS: Very Positive<br>
                        RELEASE DATE: ${game.release_date}<br>
                        DEVELOPER: ${game.developer[0]} ${game.developer[1]} ${game.developer[2]}<br>
                        PUBLISHER: Ubisoft
                    </p>
                </div>
            </div>
            <div class="tag_game">
                <p>Popular user-defined tags for this product:</p>
                <ul>
                    <li><a href="#">${game.steamspy_tags[0]}</a></li>
                    <li><a href="#">${game.steamspy_tags[1]}</a></li>
                    <li><a href="#">${game.steamspy_tags[2]}</a></li>
                    <li><a href="#">${game.steamspy_tags[3]}</a></li>
                    <li><a href="#">${game.steamspy_tags[4]}</a></li>
                    <li><a href="#">${game.steamspy_tags[5]}</a></li>
                    <li><a href="#">${game.steamspy_tags[6]}</a></li>
                    <li><a href="#">${game.steamspy_tags[7]}</a></li>
                </ul>
            </div>`;
    gameArea.appendChild(newDiv);
    // })
  } catch (error) {
    console.log(">>> error: ", error);
  }
};
// renderAppId();
// .then((result) => console.log("result renderAppId", result));

document.addEventListener("click", (e) => {
  const element = e.target;
  console.log(element);
});

const buttonPages = document.querySelectorAll("button");
buttonPages.forEach((button) => {
  button.addEventListener("click", (e) => {
    const element = e.target;
    globalPage = element.textContent;
    // console.log(element.textContent);
    displayAllGames(globalPage, globalQuery, globalGenresName, globalTagName);
  });
});

inputSearch.addEventListener("input", (e) => {
  const element = e.target.value;
  globalQuery = element;
  // console.log(element);
  displayAllGames(globalPage, globalQuery, globalGenresName, globalTagName);
});
