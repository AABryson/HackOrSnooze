"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  //--class StoryList; method getStories; calls api, makes array of story instances using .map; 'storyList' is declared above; getStories is static; called on class itself, not instance; eventually returns new StoryList(stories); returns to getStories() which is method in StoryList? assigns new StoryList to storyList
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  // $addStoryForm.hide()
  // $('#favoritesList').hide()
}
/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
//--pass in array of story objects? 
function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
  //--if passed in story object, call getHostName method on object
  //--method from class Story; my function - supposed to parse hostname out of url and return it
  const hostName = story.getHostName();
  console.log(hostName)
  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);
  
  //--using the story object, use it properties to fill in html
  //--Returns the markup for each story in StoryList array;
  return $(`
    <li id="${story.storyId}">
      <div>
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <div class="story-author">by ${story.author}</div>
      <div class="story-user">posted by ${story.username}</div>
      </div>
    </li>
    `);
}

/** Make delete button HTML for story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */
//--loops trhough storyList array and generates and appends html markup for each story
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
//--div3 ol; empties list first?
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
   //--storyList is array returned from getStories() above;
  for (let story of storyList.stories) {
    //--function from above; generates html markup for each story in storyList array;
    const $story = generateStoryMarkup(story);
    //--append html to div3 ol
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  console.log($allStoriesList)
}

/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}
$ownStories.on("click", ".trash-can", deleteStory);


async function submitNewStory(event) {
  
  console.debug('submitNewStory');
  event.preventDefault()
  

  //--get values for inputs
  let inputTitleVal = $('#title-val').val();
  console.log(inputTitleVal)
  let inputURLVal = $('#url-val').val()
  let inputAuthorVal = $('#author-val').val()
  const username = currentUser.username
  const storyData = { title, url, author, username };
  const story = await storyList.addStory(currentUser, storyData);
  

  // const newStoryObject = {
  //   title : inputTitleVal,
  //   author : inputAuthorVal,
  //   url: inputURLVal,
  //   user: username
  //   }
  // console.log(storyList)
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
   // hide the form and reset it
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}
  // const ownStory = await storyList.addStory(currentUser, newStoryObject);
  // console.log(ownStory)
  //  // hide the form and reset it
  // $addStoryForm.hide()
  // // $addStoryForm.trigger("reset");
  // console.log(storyList)
  // storyList = await StoryList.getStories();
  // putStoriesOnPage();
  // return storyList
$submitForm.on("submit", submitNewStory);
//--event listener for submitting own story
// $('#addStory').on("click", submitNewStory);


function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// * Functionality for favorites list and starr/un-starr a story
//  */

/** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show();
}

/** Handle favorite/un-favorite a story */
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  / see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);

// async function chooseFavoriteStory(event) {
//   console.log(event);
//   console.log(event.target);
//   let $targetEvent = $(event.target);
//   $targetEvent.hide()
//   // if ($targetEvent.text() === 'Favorite') {
//   //   // $targetEvent.text('Unfavorite');
//   //   $targetEvent.hide()
//   // }
//   // } else if($targetEvent.text() === 'Unfavorite') {
//   //   $targetEvent.text('Favorite');
//   // }
//   const $closestLI = $targetEvent.closest("li");
//   console.log($closestLI);
//   const storyID = $closestLI.attr('id');
//   console.log(storyID)
//   console.log(currentUser)
  // const story = storyList.stories.find(s => s.storyID === storyID);
  // console.log(story)
  // await currentUser.addFavorite(story)
  
//   let userName = currentUser.username;
//   console.log(userName)
//   let token = currentUser.loginToken;
//   console.log(token)
//   let response = await axios.post(`https://hack-or-snooze-v3.herokuapp.com/users/${userName}/favorites/${storyID}`, {
//     token: token,
//   });
//     console.log(response)
//     console.log(currentUser.favorites)
// }


  // if ($targetEvent.text() === 'unfavorite') {
  //   $targetEvent.text('Favorite')
  // }
  
  // 
  

// const $button = $('#favorite')


// $storiesContainer.on('click', $button, 
// chooseFavoriteStory)


// async function getFavoriteStories(){
//   let userName = currentUser.username;
//   let token = currentUser.loginToken;
//   console.log(currentUser.favorites)
//   return currentUser.favorites
// }


// async function showFavoriteStories(){
//   console.log(currentUser.favorites)
//   $favoritedStories.empty()
//   // let favoritesArray = getFavoriteStories();
//   for (let story of currentUser.favorites) {
//     let favList = $(`
//     <li id="${story.storyId}" class="liFavorites">
//       <a href="${story.url}" target="a_blank" class="story-link-fav">
//         ${story.title}
//       </a>
//       <small class="story-author-fav">by ${story.author}</small>
//       <small class="story-user-fav">posted by ${story.username}</small>
//       <button type='click' id="removeFav">Remove</button>
//     </li>
//   `);
//     $favoritedStories.append(favList)
//     hidePageComponents()
//     $favoritedStories.show()
//   }
// }

// let $navFavoritesList = $('#navFavoritesList');
// $navFavoritesList.on('click', showFavoriteStories)


// async function removeFavoriteFromAPI(event) {
//   console.log(event.target)
//   const $closestLI = $targetEvent.closest("li");
//   console.log($closestLI);
//   const storyID = $closestLI.attr('id');
//   console.log(storyID)
//   console.log(currentUser)
//   let $deleteResponse = await axios.delete(`https://hack-or-snooze-v3.herokuapp.com/users/${userName}/favorites/${storyID}`, {
//     token: token,
//   });
//   console.log($deleteResponse)
// }

// let $removeFav = $('#removeFav')
// $removeFav.on('click', removeFavoriteFromAPI)