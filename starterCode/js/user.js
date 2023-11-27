"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */
//--event handler for submitting the log in form
async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  //--grab the values from the two inputs
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  //--method is in class User;  create new User object instance and assign to currentUser;
  currentUser = await User.login(username, password);
//--variable for first form; does this reset whole form?
  $loginForm.trigger("reset");
//--users.js; sync current user info to local storage
  saveUserCredentialsInLocalStorage();
  //--when user signs up, sets up ui for user with updated navbar, etc.
  updateUIOnUserLogin();
  $loginForm.hide()
  $signupForm.hide()
}
//-attched login function from above as event handler;
$loginForm.on("submit", login);

/** Handle signup form submission. */
async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();
//--these are three inputs in second form; will pass them to singup() method below; see class User for method;
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  //--in class User in user.js
   //--method for class User; axios.post; send object with data property, then nested user property, then nested three properties of username...
  //--passes in 3 input values; retrieves user info;
  currentUser = await User.signup(username, password, name);
//--users.js; sync current user info to local storage
  saveUserCredentialsInLocalStorage();
  //--when user signs up, sets up ui for user with updated navbar, etc.
  updateUIOnUserLogin();
//--resets entire second form;
  $signupForm.trigger("reset");
  //--not sure this is correct; not sure
  $loginForm.hide()
  $signupForm.hide()
}
//--event listener on second form; uses singup function just above as handler;  probably when click on 'create account' button;
$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */
//--use user credentials to log in if there are any; called in main.js in start();
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  //--get token and username from local storage;
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  //--if not token or username...
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  //--I think this is truthy when the variable currentUser has a value;
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");
//--I think this is property that is opposite of .hide();
  $allStoriesList.show();
// --When a user first logins in, update the navbar to reflect that.
//--in nav.js
  updateNavOnLogin();
}
