"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */
//--see next class for creating a new StoryList with Story objects
class Story {
  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }
  /** Parses hostname out of URL and returns it. */

  getHostName() {
    // UNIMPLEMENTED: complete this function!
    const urlObject = new URL (this.url);
    console.log(urlObject);
    let hostName = urlObject.hostname
    console.log(hostName)
    return hostName
    //--their original
    //-- return "hostname.com";
    
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */
//--has getStories() and addStory() methods
class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */
//--result is a new StoryList object that has as an attribute the newStoryObjectInstancesArray???; so StoryList object now has new property: an array of story objects;
  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    //--returns object with data.stories property which has an array of individual story objects?
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });
    console.log(response)

    // turn plain old story objects from API into instances of Story class
    //--use .map to iterate over stories array;response.data.stories is an array;
    //--a story object is the value of each iteration; creates new array with a 'new Story' object for each story in array;
    const arrayOfNewStoryObjects = response.data.stories.map(story => new Story(story));
    //--each Story object has author, createdAt, storyId, title, url, usename
    console.log(arrayOfNewStoryObjects)
 //--should now have array of 'new Story' objects
    // build an instance of our own class using the new array of stories
    return new StoryList(arrayOfNewStoryObjects);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory( /* user, newStory */) {
    // UNIMPLEMENTED: complete this function!
  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */
//--class for user object; has the methods signup(...), login(....) and loginViaStoredCredentials(token, username)
class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */
 //--will pass in favorites array; see use of .map below to create that array; pass in own stories array; see use of .map below;
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    //--create new Story instance for each value in favorites array
    this.favorites = favorites.map(s => new Story(s));
    //--create new story instance for each value in array of user's own stories;
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }
  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */
//--register new user in api; will call this method in function for filling out form and then submit event; signup(evt)
//--creates new User object (see return below)
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });
    console.log(response)
    let { user } = response.data
    //--user object has these properties: createdAt, favorites, name, stories, username
    console.log(user)
//--create a 'new User' object instance based on user object received in API response;
//--see above - class Uswer - for constructor function and properties that need to be passed in
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      //--apparently token isn't in user object but is data property
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });
    console.log(response)

    let { user } = response.data;
    console.log(user)
//--so do we create another new User object based on the data in the response?
//--like above, instantiate new User object 
    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
}
