/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const response = await axios.get("http://api.tvmaze.com/search/shows", {
      params: {
          q: query
      }
  })
  const showInfo = [];
  for (let i = 0; i < response.data.length; i++) {
    
      const {id,name,summary} = response.data[i].show

      let image = response.data[i].show.image ? response.data[i].show.image.original : "https://tinyurl.com/tv-missing";
      showInfo.push({
        id,name,summary,image
      });
  }
  return showInfo;
}


/** Populate shows list:
*     - given list of shows, add shows to DOM
*/

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
      let $item = $(
          `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
       <div class="card" data-show-id="${show.id}">
        <img class="card-img-top" src="${show.image}">
         <div class="card-body">
           <h5 class="card-title">${show.name}</h5>
           <p class="card-text">${show.summary}</p>
           <button type="button" class="btn btn-primary episode-button" data-toggle="modal" data-target="#exampleModalCenter">Episodes</button>
         </div>
       </div>
     </div>
    `);

      $showsList.append($item);
  }
}


/** Handle search form submission:
*    - hide episodes area
*    - get list of matching shows and show in shows list
*/

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  $('.episode-button').on('click', buttonClick)
});


/** Given a show ID, return list of episodes:
*      { id, name, season, number }
*/

async function getEpisodes(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  const episodeInfo = [];

  for (let i = 0; i < response.data.length; i++) {
      const {id,name,season,number} = response.data[i]
      episodeInfo.push({
        id,name,season,number
      });
  }

  return episodeInfo;
}
// add episode data to modal ul
function populateEpisodes(episodes, e) {
  let $episodeList = $('div.modal-body').children()

  $episodeList.empty();

  for (episode of episodes) {
      $episodeList.append(`
        <li>${episode.name} (${episode.season}, ${episode.number})</li>
    `)
  }
  $('.modal-title').text($(e.target).siblings('h5').text());
}
// handle button clicks
async function buttonClick(e) {
  const {showId} = $(this).closest('div.card').data();
  const episodes = await getEpisodes(showId);

  populateEpisodes(episodes, e);

}