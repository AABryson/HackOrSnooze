"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
//--will use as event handler in event listener below; will fire when click on 'hack or snooze'; 
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  //--in main.js; will hide other elements on the page
  hidePageComponents();
  //-loops trhough storyList array and generates and appends html markup for each story; stories.js
  // $favoritedStories.hide();
  putStoriesOnPage();


}
//--event delegation
//--navbar first anchor tag; says hack or snooze
//-div[0] a[0]
$body.on("click", "#nav-all", navAllStories);
/** Show story submit form on clicking story "submit" */

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show My Stories on clicking "my stories" */

function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);
/** Show login/signup on click on "login" */
//--event handler when user clicks on 'login/singup' on the nav bar
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  //--hides elements on page
  hidePageComponents();
  //--reveals the two forms
  $loginForm.show();
  $signupForm.show();
  $storiesContainer.hide()
}
//--div[0] a; call above function
$navLogin.on("click", navLoginClick);
/** Hide everything but profile on click on "profile" */

function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  //--where is this
  $(".main-nav-links").show();
  //--hide the login link
  $navLogin.hide();

  $navLogOut.show();
  //--current udsers username to anchor tag on navbar using .text()
  $navUserProfile.text(`${currentUser.username}`).show();
}

// function navAddStoryClick(event) {
//   console.debug('navAddStoryClick', event);
//   // hidePageComponents();
//   $addStoryForm.show()
// }

// $('#addStoryLink').on('click', navAddStoryClick);