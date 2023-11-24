"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  //--class StoryList; method getStories; alls api, makes array of story instances using .map; 'storyList' is declared above; getStories is static; called on class itself, not instance; eventually returns new StoryList(stories); returns to getStories() which is method in StoryList? assigns new StoryList to storyList
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}
/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
//--pass in array of story objects? 
function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  //--if passed in story object, call getHostName method on object
  //--method from class Story; my function - supposed to parse hostname out of url and return it
  const hostName = story.getHostName();
  //--using the story object, use it properties to fill in html
  //--Returns the markup for each story in StoryList array;
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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
}
