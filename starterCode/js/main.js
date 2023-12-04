"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:
//practice making change and committing 
const $body = $("body");
//div[1] a[0]
const $navLogin = $("#nav-login");
//div[1] a[1]
const $navUserProfile = $("#nav-user-profile");
//div[1] a[2]
const $storiesContainer = $(".stories-container")
const $userProfile = $("#user-profile");

const $navLogOut = $("#nav-logout");
//div3
const $storiesLoadingMsg = $("#stories-loading-msg");
//div 3 ol
const $allStoriesList = $("#all-stories-list");
//form
const $loginForm = $("#login-form");
//form2
const $signupForm = $("#signup-form");

const $addStoryForm = $('#addStory-form')

const $favoritesList = $('#favoritedStories')

const $ownStories = $("#my-stories");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */
function hidePageComponents() {
  const components = [
    // $storiesLists,
    // $submitForm,
    // $userProfile
    $allStoriesList,
    $loginForm,
    $signupForm,
    $addStoryForm    
  ];
  components.forEach(c => c.hide());
}
/** Overall function to kick off the app. */
async function start() {
  console.debug("start");
  // "Remember logged-in user" and log in, if credentials in localStorage
   //-in users.js; use user credentials in local storage
  await checkForRememberedUser();
  //-in stories.js; get and show stories when first loads
  await getAndShowStoriesOnStart();
//--currentUswer is in user.js; let currentUswer;
  //--when user signs up, set up the ui; shows stories list; update navbar;
  //--check whether var currentUser is truthy; so checks to see if variable has assigned value?;
  //--if there is a logged in user, set up the ui; show stories list; update navbar, etc.
  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}
// Once the DOM is entirely loaded, begin the app
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
//--function call?
$(start);
