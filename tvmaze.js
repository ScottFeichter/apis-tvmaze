"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_BASE_URL = 'http://api.tvmaze.com';
const TVMAZE_SHOW_ENDPOINT = '/search/shows';


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const searchUrl = `${TVMAZE_BASE_URL}${TVMAZE_SHOW_ENDPOINT}`;
  const resp = await axios.get(searchUrl, {
    'params': {
      'q': term
    }
  });
  return serializeShowData(resp.data);
}

/** serialise Tv Show Data */
function serializeShowData(data) {
  const showResults = [];

  data.map((show) => showResults.push(
    {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image === null ?
      {
        original: "https://www.nbmchealth.com/wp-content/uploads/2018/04/default-placeholder.png"
      }
      : show.show.image
    }
  ))
  return showResults;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image.original}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();

  if(shows.length < 1){
    $("#showsList").append('<p>No Results Found</p>');
    return;
  }

  populateShows(shows);
}

/** listens to search form being submitted then calls controller function */
$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }

//    * http://api.tvmaze.com/shows/[showid]/episodes

