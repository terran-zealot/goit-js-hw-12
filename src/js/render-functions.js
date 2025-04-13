
import 'simplelightbox/dist/simple-lightbox.min.css';




export function createGallery(images) {
    return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <li class="gallery-item">
            <a href="${largeImageURL}" class="gallery-link">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            </a>
            <div class="info">
                <p class="info-item"><b>Likes</b> ${likes}</p>
                <p class="info-item"><b>Views</b> ${views}</p>
                <p class="info-item"><b>Comments</b> ${comments}</p>
                <p class="info-item"><b>Downloads</b> ${downloads}</p>
            </div>
        </li>
    `).join('');
}


export function clearGallery() {
    const galleryElement = document.querySelector('.gallery');
    if (galleryElement) {
        galleryElement.innerHTML = "";
    }
}



export function showLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        console.log("loader on");
        loader.classList.add('visible');
    }
}



export function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) {
        console.log("loader off");
        loader.classList.remove('visible');
    }
}
