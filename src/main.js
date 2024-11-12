import { serviceImg } from './js/pixabay-api';
import {
  iziToastMes,
  createMarkup,
  loadMore,
  hideLoader,
  showLoader,
  hideLoadMoreBtn,
  showLoadMoreBtn,
  endOfRes,
  greetingMessage,
  emptyLine,
  hideLoaderMore,
  showLoaderMore,
} from './js/render-functions';

document.addEventListener('DOMContentLoaded', greetingMessage);

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const submitButton = form.querySelector('button[type="submit"]');
let page = 1;
let searchValue = '';
let previousSearch = '';

loadMore.addEventListener('click', onLoadMore);
form.addEventListener('submit', async event => {
  event.preventDefault();

  searchValue = event.target.elements.search.value.trim();
  if (searchValue && searchValue !== previousSearch) {
    previousSearch = searchValue;
    page = 1;

    showLoader();
    gallery.innerHTML = '';
    submitButton.disabled = true;
    try {
      const response = await serviceImg(searchValue, page);
      form.reset();
      createMarkup(response);
      if (page < Math.ceil(response.totalHits / 15)) {
        showLoadMoreBtn();
      }
    } catch (error) {
      console.error(error);
      iziToastMes('🚨 Something went wrong while fetching images!');
    } finally {
      hideLoader();
      submitButton.disabled = false;
    }
  } else {
    emptyLine();
  }
});

async function onLoadMore() {
  if (searchValue !== previousSearch) return;
  loadMore.disabled = true;
  showLoaderMore();
  hideLoadMoreBtn();

  page++;

  try {
    const response = await serviceImg(searchValue, page);
    createMarkup(response);
    const totalPages = Math.ceil(response.totalHits / 15);

    if (page >= totalPages) {
      hideLoadMoreBtn();
      endOfRes();
    }

    const item = document.querySelector('.gallery-item');
    const itemHeight = item.getBoundingClientRect().height;

    window.scrollBy({
      left: 0,
      top: itemHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    iziToastMes('🚨 Something went wrong while fetching images!');
  } finally {
    hideLoader();
    hideLoaderMore();
    showLoadMoreBtn();
    loadMore.disabled = false;
  }
}
