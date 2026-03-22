import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { fetchCategories, fetchRecipes, fetchAreas, fetchIngredients, fetchEvents } from './js/api.js';
import { renderCategories, renderRecipes, renderOptions, renderPagination, renderPopularRecipes, renderEvents } from './js/render.js';
import debounce from 'lodash.debounce';

// Theme Switcher Logic
const themeCheckbox = document.getElementById('checkbox');
if (themeCheckbox) {
  themeCheckbox.checked = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark', themeCheckbox.checked);

  themeCheckbox.addEventListener('change', () => {
    document.body.classList.toggle('dark', themeCheckbox.checked);
    localStorage.setItem('theme', themeCheckbox.checked ? 'dark' : 'light');
  });
}

// Mobile Menu Logic
const hmbrgBtn = document.getElementById('hamburger-btn');
const mobMenu = document.getElementById('mobile-menu');
const mobClose = document.getElementById('mobile-close-btn');

if (hmbrgBtn && mobMenu) {
  hmbrgBtn.addEventListener('click', () => mobMenu.classList.add('open'));
  mobClose.addEventListener('click', () => mobMenu.classList.remove('open'));
  mobMenu.addEventListener('click', e => {
    if(e.target === mobMenu) mobMenu.classList.remove('open');
  });
}

// App State
let state = {
  category: '',
  title: '',
  time: '',
  area: '',
  ingredient: '',
  page: 1,
  limit: 9,
  totalPages: 1,
  recipes: [] // Store current page recipes
};

// ... existing code ...
async function loadRecipes() {
  try {
    const params = {
      limit: state.limit,
      page: state.page,
      category: state.category,
      title: state.title,
      time: state.time,
      area: state.area,
      ingredient: state.ingredient
    };

    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key];
    });

    const data = await fetchRecipes(params);
    state.totalPages = data.totalPages;
    state.recipes = data.results; // store current recipes
    
    renderRecipes(state.recipes, 'recipe-gallery');
    renderPagination(state.totalPages, state.page, 'pagination');
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch recipes.' });
    console.error(error);
  }
}

// ... existing code ...
// Favorites Feature Delegate Event
document.getElementById('recipe-gallery').addEventListener('click', async (e) => {
  // Favorite Toggle
  const favBtn = e.target.closest('.fav-btn');
  if (favBtn) {
    const recipeId = favBtn.dataset.id;
    const icon = favBtn.querySelector('.icon-heart');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const existingIndex = favorites.findIndex(f => f._id === recipeId);
    if (existingIndex > -1) {
      favorites.splice(existingIndex, 1);
      icon.classList.remove('active');
      iziToast.info({ title: 'Removed', message: 'Removed from favorites' });
    } else {
      const recipeObj = state.recipes.find(r => r._id === recipeId);
      if (recipeObj) {
        favorites.push(recipeObj);
        icon.classList.add('active');
        iziToast.success({ title: 'Added', message: 'Added to favorites' });
      }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return;
  }

  // Open Recipe Modal
  const detailBtn = e.target.closest('.btn-recipe-detail');
  if (detailBtn) {
    const recipeId = detailBtn.dataset.id;
    try {
      // Show loader (iziToast or simple text)
      iziToast.info({ title: 'Loading...', position: 'center', timeout: 1000 });
      const recipeDetails = await import('./js/api.js').then(m => m.fetchRecipeById(recipeId));
      import('./js/render.js').then(m => {
        m.renderRecipeModal(recipeDetails, 'recipe-modal-content');
        document.getElementById('recipe-modal-backdrop').classList.add('open');
        body.style.overflow = 'hidden';
      });
    } catch (err) {
      iziToast.error({ title: 'Error', message: 'Failed to load recipe details' });
    }
  }
});

// Modal Actions Delegate Event
const modalBackdrop = document.getElementById('recipe-modal-backdrop');
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    // Close modal
    if (e.target.id === 'recipe-modal-backdrop' || e.target.closest('#modal-close-btn')) {
      modalBackdrop.classList.remove('open');
      body.style.overflow = '';
    }
    
    // Add to Favorite from Modal
    const modalFavBtn = e.target.closest('#modal-fav-btn');
    if (modalFavBtn) {
      const recipeId = modalFavBtn.dataset.id;
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      const existingIndex = favorites.findIndex(f => f._id === recipeId);
      
      if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        modalFavBtn.textContent = 'Add to favorite';
        iziToast.info({ title: 'Removed', message: 'Removed from favorites' });
        // Update gallery icon if visible
        const galleryBtn = document.querySelector(`.fav-btn[data-id="${recipeId}"] .icon-heart`);
        if(galleryBtn) galleryBtn.classList.remove('active');
      } else {
        // Need to push the recipe obj, but we only have ID here directly, 
        // we could fetch it or just get from state if it was in the gallery list
        const recipeObj = state.recipes.find(r => r._id === recipeId);
        if (recipeObj) {
          favorites.push(recipeObj);
        } else {
          favorites.push({ _id: recipeId }); // Fallback
        }
        modalFavBtn.textContent = 'Remove from favorite';
        iziToast.success({ title: 'Added', message: 'Added to favorites' });
        // Update gallery icon if visible
        const galleryBtn = document.querySelector(`.fav-btn[data-id="${recipeId}"] .icon-heart`);
        if(galleryBtn) galleryBtn.classList.add('active');
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  });
}

// Intercept Popular Recipes Clicks and Pagination Clicks
document.body.addEventListener('click', async (e) => {
  const pageBtn = e.target.closest('.page-btn');
  if (pageBtn && !pageBtn.classList.contains('active')) {
    const pageNum = parseInt(pageBtn.dataset.page);
    if (pageNum && pageNum !== state.page) {
      state.page = pageNum;
      loadRecipes();
    }
  }
});

async function init() {
  try {
    // 0. Fetch slider events and render Swiper
    const events = await fetchEvents();
    renderEvents(events, 'hero-swiper-wrapper');

    // 1. Fetch Categories and Render Sidebar
    const cats = await fetchCategories();
    renderCategories(cats, 'categories-list');
    
    // 2. Fetch Popular Recipes and render
    const popRecipes = await fetchRecipes({ limit: 4 });
    renderPopularRecipes(popRecipes.results || [], 'popular-recipes-list');
    
    // 3. Setup Dropdown filters
    const areas = await fetchAreas();
    renderOptions(areas, 'area-select', 'name', 'name');
    
    const ingredients = await fetchIngredients();
    renderOptions(ingredients, 'ingredient-select', '_id', 'name');
    
    // 4. Time Select
    const timeSelect = document.getElementById('time-select');
    if(timeSelect) {
      for(let i=5; i<=120; i+=5) {
        timeSelect.insertAdjacentHTML('beforeend', `<option value="${i}">${i} min</option>`);
      }
    }
    
    // 5. Initial Recipes Load
    await loadRecipes();
    
    // 6. Bind Sidebar Category click events
    const catList = document.getElementById('categories-list');
    if(catList) {
      catList.addEventListener('click', (e) => {
        const btn = e.target.closest('.category-btn');
        if(btn) {
          document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('all-categories-btn')?.classList.remove('active');
          state.category = btn.dataset.category || btn.textContent.trim();
          state.page = 1;
          loadRecipes();
        }
      });
    }

    // Bind All Categories button
    document.getElementById('all-categories-btn')?.addEventListener('click', (e) => {
      e.target.classList.add('active');
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      state.category = '';
      state.page = 1;
      loadRecipes();
    });

    // 7. Filters events (Search, Time, Area, Ingredient)
    const handleFilterChange = debounce((key, val) => {
      state[key] = val;
      state.page = 1;
      loadRecipes();
    }, 400);

    document.getElementById('search-input')?.addEventListener('input', (e) => handleFilterChange('title', e.target.value.trim()));
    document.getElementById('time-select')?.addEventListener('change', (e) => handleFilterChange('time', e.target.value));
    document.getElementById('area-select')?.addEventListener('change', (e) => handleFilterChange('area', e.target.value));
    document.getElementById('ingredient-select')?.addEventListener('change', (e) => handleFilterChange('ingredient', e.target.value));

    // Reset Filters
    document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
      state.title = '';
      state.time = '';
      state.area = '';
      state.ingredient = '';
      state.category = '';
      state.page = 1;

      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.value = '';
      
      const selects = ['time-select', 'area-select', 'ingredient-select'];
      selects.forEach(id => {
        const sel = document.getElementById(id);
        if(sel) sel.value = '';
      });

      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('all-categories-btn')?.classList.add('active');

      loadRecipes();
    });

  } catch (err) {
    console.error("Initialization Failed:", err);
  }
}

init();

// Extra Features: Modals & Scroll Up

// Scroll Up Logic
const scrollUpBtn = document.getElementById('scroll-up-btn');
if (scrollUpBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollUpBtn.classList.add('visible');
    } else {
      scrollUpBtn.classList.remove('visible');
    }
  });
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Order Modal Logic
const orderModal = document.getElementById('order-modal-backdrop');
const orderForm = document.getElementById('order-form');

document.querySelectorAll('#order-now-btn, #order-now-hero-btn').forEach(btn => {
  if(btn) {
    btn.addEventListener('click', () => {
      if (orderModal) {
        orderModal.classList.add('open');
        body.style.overflow = 'hidden';
      }
    });
  }
});

if (orderModal) {
  orderModal.addEventListener('click', (e) => {
    if (e.target.id === 'order-modal-backdrop' || e.target.closest('#order-close-btn')) {
      orderModal.classList.remove('open');
      body.style.overflow = '';
      if(orderForm) orderForm.reset();
    }
  });
}

if (orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const email = document.getElementById('order-email').value;
    const comment = document.getElementById('order-comment').value;

    try {
      iziToast.info({ title: 'Sending...', id: 'order-send' });
      await import('./js/api.js').then(m => m.submitOrder({ name, phone, email, comment }));
      iziToast.destroy({ id: 'order-send' });
      iziToast.success({ title: 'Success', message: 'Order submitted successfully!' });
      orderModal.classList.remove('open');
      body.style.overflow = '';
      orderForm.reset();
    } catch (err) {
      iziToast.error({ title: 'Error', message: 'Failed to submit order' });
      console.error(err);
    }
  });
}

// Rating Modal Logic
const ratingModal = document.getElementById('rating-modal-backdrop');
const ratingForm = document.getElementById('rating-form');
const starsInput = document.getElementById('rating-stars-input');
let currentRating = 0;

if (starsInput) {
  starsInput.addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN') {
      currentRating = parseInt(e.target.dataset.value);
      document.getElementById('rating-value').value = currentRating;
      const scoreDisplay = document.getElementById('rating-score-display');
      if (scoreDisplay) scoreDisplay.textContent = currentRating.toFixed(1);
      
      Array.from(starsInput.children).forEach((star, index) => {
        if (index < currentRating) star.classList.add('active');
        else star.classList.remove('active');
      });
    }
  });
}

if (ratingModal) {
  ratingModal.addEventListener('click', (e) => {
    if (e.target.id === 'rating-modal-backdrop' || e.target.closest('#rating-close-btn')) {
      ratingModal.classList.remove('open');
      if(ratingForm) ratingForm.reset();
      currentRating = 0;
      if(starsInput) Array.from(starsInput.children).forEach(s => s.classList.remove('active'));
    }
  });
}

if (ratingForm) {
  ratingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('rating-email').value;
    const recipeId = document.getElementById('rating-recipe-id').value;
    
    if (currentRating === 0) {
      iziToast.warning({ title: 'Warning', message: 'Please select a star rating' });
      return;
    }

    try {
      iziToast.info({ title: 'Sending...', id: 'rating-send' });
      await import('./js/api.js').then(m => m.submitRating(recipeId, { email, rate: currentRating }));
      iziToast.destroy({ id: 'rating-send' });
      iziToast.success({ title: 'Success', message: 'Rating submitted!' });
      ratingModal.classList.remove('open');
      ratingForm.reset();
      currentRating = 0;
      Array.from(starsInput.children).forEach(s => s.classList.remove('active'));
    } catch (err) {
      iziToast.error({ title: 'Notice', message: err.response?.data?.message || 'Failed to submit rating' });
    }
  });
}

// Intercept Rating button inside Recipe Modal
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (e) => {
    const ratingBtn = e.target.closest('#modal-rating-btn');
    if (ratingBtn) {
      const recipeId = ratingBtn.dataset.id;
      const ratingRecipeIdInput = document.getElementById('rating-recipe-id');
      if (ratingRecipeIdInput && ratingModal) {
        ratingRecipeIdInput.value = recipeId;
        ratingModal.classList.add('open');
      }
    }
  });
}
