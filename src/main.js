import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { createGallery, clearGallery, showLoader, hideLoader } from "./js/render-functions.js";
import { getImagesByQuery } from "./js/pixabay-api.js";





const form = document.querySelector(".form");
const userInput = document.querySelector("input[name='search-text']");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector('.loader');
const loadMore = document.querySelector('.load-more');

if (loader) loader.style.display = 'none';

form.addEventListener("submit", handleSubmit);
loadMore.addEventListener('click', onLoadMore);


let page = 1;
let lightbox = null;

const perPage = 15;
let totalHits = 0;

loader.style.display = 'none';

function updateLoadMoreVisibility() {
    const maxPages = Math.ceil(totalHits / perPage);
    if (page >= maxPages) {
        loadMore.style.display = 'none';
        iziToast.info({
            title: "End of Results",
            message: "You've reached the end of search results.",
            position: "topRight"
        });
    } else {
        loadMore.style.display = 'block';
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    const query = userInput.value.trim();

    if (!query) {
        iziToast.warning({
            title: "Empty Query",
            message: "Please enter a search term!",
            position: "topRight"
        });
        return;
    }

    page = 1;
    clearGallery();
    showLoader();

    try {
        const response = await getImagesByQuery(query, page);
        hideLoader();

        if (!response.data.hits || response.data.hits.length === 0) {
            iziToast.warning({
                title: "No Results",
                message: "No images found for your query. Try something else!",
                position: "topRight"
            });
            loadMore.style.display = 'none';
            return;
        }

        totalHits = response.data.totalHits;
        gallery.innerHTML = createGallery(response.data.hits);
        updateLoadMoreVisibility();

        if (lightbox) {
            lightbox.refresh();
        } else {
            lightbox = new SimpleLightbox('.gallery a', {
                captions: true,
                captionDelay: 250,
                close: true
            });
        }

    } catch (error) {
        hideLoader();
        loadMore.style.display = 'none';
        iziToast.error({
            title: "Error",
            message: "Something went wrong. Please try again!",
            position: "topRight"
        });
        console.error(error);
    }
}

async function onLoadMore() {
    page++;
    loadMore.disabled = true;
    showLoader();

    try {
        const response = await getImagesByQuery(userInput.value.trim(), page);
        hideLoader();
        loadMore.disabled = false;

        if (!response.data.hits || response.data.hits.length === 0) {
            updateLoadMoreVisibility();
            return;
        }

        gallery.insertAdjacentHTML('beforeend', createGallery(response.data.hits));
        updateLoadMoreVisibility();

        const cards = document.querySelectorAll(".gallery-item");
        if (cards.length > 0) {
            const cardsHeight = cards[cards.length - 1].getBoundingClientRect().height;
            window.scrollBy({
                left: 0,
                top: cardsHeight * 2,
                behavior: "smooth",
            });
        }

        if (lightbox) lightbox.refresh();

    } catch (error) {
        hideLoader();
        loadMore.style.display = 'none';
        iziToast.error({
            title: "Error",
            message: "Something went wrong during loading.",
            position: "topRight"
        });
        console.error(error);
    }
}
