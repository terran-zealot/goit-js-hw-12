import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { createGallery, clearGallery, showLoader, hideLoader } from "./js/render-functions.js";
import { getImagesByQuery } from "./js/pixabay-api.js";





const form = document.querySelector(".form");
const userInput = document.querySelector("input[name='search-text']");
const gallery = document.querySelector(".gallery");
document.querySelector('.loader').style.display = 'none';
const loadMore = document.querySelector('.load-more');
form.addEventListener("submit", handleSubmit);



let lightbox = null;
function handleSubmit(event) {
    event.preventDefault();
    const query = userInput.value.trim();
    if (!query) return;

    clearGallery();
    showLoader();

    getImagesByQuery(query)
        .then(response => {
            hideLoader();

            // console.log(response.data.hits);
            if (!response.data.hits || response.data.hits.length === 0) {
                iziToast.warning({
                    title: "No Results",
                    message: "No images found for your query. Try something else!",
                    position: "topRight"
                });
                return;
            }

            gallery.innerHTML = createGallery(response.data.hits);
            loadMore.classList.replace('load-more-hidden', 'load-more');

            if (lightbox) {
                 lightbox.refresh();
            } else {
                 lightbox = new SimpleLightbox('.gallery a', { captions: true, captionDelay: 250, close: true });
            }
        })
        .catch(error => {
            hideLoader();
            console.error(error);
            iziToast.error({
                title: "Error",
                message: "Sorry, something went wrong. Please try again!",
                position: "topRight"
            });
        });
}