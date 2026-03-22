import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { renderCategories, renderRecipes, renderRecipeModal } from './render.js';
import { fetchRecipeById } from './api.js';

const themeSwitchInput = document.getElementById('checkbox');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark');
  if (themeSwitchInput) themeSwitchInput.checked = true;
}

if (themeSwitchInput) {
  themeSwitchInput.addEventListener('change', (e) => {
    if (e.target.checked) {
      body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      iziToast.success({ title: 'Theme', message: 'Switched to Dark Mode!' });
    } else {
      body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      iziToast.info({ title: 'Theme', message: 'Switched to Light Mode!' });
    }
  });
}

let allFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCategory = '';

// Extract unique categories from favorites
const initFavorites = () => {
  // If we only saved IDs accidentally instead of full objects, let's filter them out for now
  // Assuming full objects were stored
  const validFavs = allFavorites.filter(f => f.category);
  
  const categoriesSet = new Set(validFavs.map(f => f.category));
  const categoriesList = ['All', ...categoriesSet].map(c => ({ name: c }));
  
  renderCategories(categoriesList, 'fav-categories-list');
  renderFilteredFavorites();
};

const renderFilteredFavorites = () => {
  const validFavs = allFavorites.filter(f => f.title);
  
  const filtered = (currentCategory === '' || currentCategory === 'All') 
    ? validFavs 
    : validFavs.filter(f => f.category === currentCategory);
    
  renderRecipes(filtered, 'recipe-gallery');
};

const favCategoriesList = document.getElementById('fav-categories-list');
if (favCategoriesList) {
  favCategoriesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
      document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderFilteredFavorites();
    }
  });
}

// Delegate events
document.getElementById('recipe-gallery').addEventListener('click', async (e) => {
  // Unfavorite
  const favBtn = e.target.closest('.fav-btn');
  if (favBtn) {
    const recipeId = favBtn.dataset.id;
    allFavorites = allFavorites.filter(f => f._id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(allFavorites));
    iziToast.info({ title: 'Removed', message: 'Removed from favorites' });
    initFavorites(); // Re-render everything
    return;
  }

  // Open Recipe Modal
  const detailBtn = e.target.closest('.btn-recipe-detail');
  if (detailBtn) {
    const recipeId = detailBtn.dataset.id;
    try {
      iziToast.info({ title: 'Loading...', position: 'center', timeout: 1000 });
      const recipeDetails = await fetchRecipeById(recipeId);
      renderRecipeModal(recipeDetails, 'recipe-modal-content');
      document.getElementById('recipe-modal-backdrop').classList.add('open');
      body.style.overflow = 'hidden';
    } catch (err) {
      iziToast.error({ title: 'Error', message: 'Failed to load recipe details' });
    }
  }
});

// Modal Actions
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
      const existingIndex = allFavorites.findIndex(f => f._id === recipeId);
      
      if (existingIndex > -1) {
        allFavorites.splice(existingIndex, 1);
        modalFavBtn.textContent = 'Add to favorite';
        iziToast.info({ title: 'Removed', message: 'Removed from favorites' });
        initFavorites();
      } else {
        // Find in current data? In favorites page, if it wasn't in favorites, it wouldn't be displayed, 
        // but maybe fetch returned it
      }
      localStorage.setItem('favorites', JSON.stringify(allFavorites));
    }
  });
}

initFavorites();
