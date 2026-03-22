import iziToast from "izitoast";
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export const renderEvents = (events, containerId) => {
  const wrapper = document.getElementById(containerId);
  if (!wrapper) return;
  if (!events || events.length === 0) return;

  const markup = events.map(event => `
    <div class="swiper-slide">
      <div class="hero-slide-row">
        <!-- Chef Card -->
        <div class="slide-card chef-card" style="background-image: url('${event.cook.imgWebpUrl || event.cook.imgUrl}');">
        </div>
        
        <!-- Dish Preview Card (with green glow) -->
        <div class="slide-card preview-card">
          <img class="dish-png" src="${event.topic.previewWebpUrl || event.topic.previewUrl}" alt="${event.topic.name}" />
          <div class="dish-card-text">
            <h4>${event.topic.name.toUpperCase()}</h4>
            <p>${event.topic.area}</p>
          </div>
        </div>
        
        <!-- Dish Full Zoom Card -->
        <div class="slide-card full-image-card" style="background-image: url('${event.topic.imgWebpUrl || event.topic.imgUrl}');">
        </div>
      </div>
    </div>
  `).join('');

  wrapper.innerHTML = markup;

  new Swiper('.hero-swiper', {
    modules: [Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,
    speed: 800,
    loop: false,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.slider-pagination',
      clickable: true,
      bulletClass: 'slider-dot',
      bulletActiveClass: 'active'
    }
  });
};

// Render Categories
export const renderCategories = (categories, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const markup = categories.map(cat => `
    <li class="category-item">
      <button class="category-btn" data-category="${cat.name}">${cat.name}</button>
    </li>
  `).join('');
  
  container.innerHTML = markup;
};

// Render Popular Recipes (Mini layout for sidebar)
export const renderPopularRecipes = (recipes, containerId) => {
  const container = document.getElementById(containerId);
  const section = document.getElementById('popular-recipes-section');
  if (!container || !section) return;
  if (!recipes || recipes.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';

  const markup = recipes.map(recipe => `
    <div class="popular-recipe-mini btn-recipe-detail" style="cursor: pointer" data-id="${recipe._id}">
      <img src="${recipe.preview}" alt="${recipe.title}" />
      <div class="popular-recipe-mini-text">
        <h4>${recipe.title}</h4>
        <p>${recipe.description}</p>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = markup;
};
// Render Recipe Cards
export const renderRecipes = (recipes, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (recipes.length === 0) {
    container.innerHTML = `<p class="no-results">No recipes found. Try adjusting your filters.</p>`;
    return;
  }

  // Check favorites from local storage
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  const markup = recipes.map(recipe => {
    const isFav = favorites.some(fav => fav._id === recipe._id);
    const heartFill = isFav ? 'var(--primary-color)' : 'none';
    const heartStroke = isFav ? 'var(--primary-color)' : 'currentColor';
    
    // Generate star ratings dynamically
    const rating = Math.round(recipe.rating || 0);
    let starsHtml = '';
    for(let i=1; i<=5; i++) {
        starsHtml += i <= rating ? '★' : '☆';
    }

    return `
      <div class="recipe-card" style="background-image: url('${recipe.preview}')">
        <button class="fav-btn" data-id="${recipe._id}">
          <svg class="icon-heart" width="22" height="22" viewBox="0 0 24 24" fill="${heartFill}" stroke="${heartStroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <div class="recipe-card-content">
          <h3 class="recipe-title">${recipe.title.toUpperCase()}</h3>
          <p class="recipe-desc">${recipe.description}</p>
          <div class="recipe-meta">
            <div class="rating">
              <span class="rating-score">${(recipe.rating || 0).toFixed(1)}</span>
              <span class="stars">${starsHtml}</span>
            </div>
            <button class="btn btn-primary btn-recipe-detail" data-id="${recipe._id}">See recipe</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = markup;
};

// Render Option Elements for Selects
export const renderOptions = (data, containerId, valueField, textField) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const markup = data.map(item => `
    <option value="${item[valueField]}">${item[textField]}</option>
  `).join('');
  
  container.insertAdjacentHTML('beforeend', markup);
};

// Render Pagination
export const renderPagination = (totalPages, currentPage, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let markup = `
    <button class="page-btn nav-arr" data-page="1">&lt;&lt;</button>
    <button class="page-btn nav-arr" data-page="${Math.max(1, currentPage - 1)}">&lt;</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      markup += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      markup += `<span class="page-dots">...</span>`;
    }
  }

  markup += `
    <button class="page-btn nav-arr" data-page="${Math.min(totalPages, currentPage + 1)}">&gt;</button>
    <button class="page-btn nav-arr" data-page="${totalPages}">&gt;&gt;</button>
  `;

  container.innerHTML = markup;
};

// Render Recipe Modal
export const renderRecipeModal = (recipe, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tagsMarkup = recipe.tags && recipe.tags.length > 0 
    ? `<div class="recipe-tags">${recipe.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}</div>`
    : '';

  const ingredientsMarkup = (recipe.ingredients || []).map(ing => `
    <li class="ingredient-item">
      <span>${ing.name || 'Ingredient'}</span>
      <span class="ingredient-measure">${ing.measure}</span>
    </li>
  `).join('');

  // Extract youtube ID for iframe
  let videoId = '';
  if (recipe.youtube) {
    const match = recipe.youtube.match(/[?&]v=([^&]+)/);
    if (match) videoId = match[1];
  }

  const videoMarkup = videoId 
    ? `<div class="video-container" style="position: relative;">
         <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="${recipe.title}" class="modal-img" style="margin-bottom: 0;">
         <div class="play-overlay">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
         </div>
       </div>`
    : `<img src="${recipe.preview}" alt="${recipe.title}" class="modal-img">`;

  // Check if favored
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const isFav = favorites.some(f => f._id === recipe._id);

  // Generate star ratings dynamically
  const rating = Math.round(recipe.rating || 0);
  let starsHtml = '';
  for(let i=1; i<=5; i++) {
      starsHtml += i <= rating ? '★' : '☆';
  }

  container.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${recipe.title.toUpperCase()}</h2>
      <button class="modal-close-btn" id="modal-close-btn">✕</button>
    </div>
    
    ${videoMarkup}
    
    <div class="modal-meta-row">
      ${tagsMarkup}
      <div class="modal-stats">
        <span class="rating-value">${(recipe.rating || 0).toFixed(1)}</span>
        <span class="stars">${starsHtml}</span>
        <span class="time">${recipe.time} min</span>
      </div>
    </div>
    
    <ul class="ingredients-list">
      ${ingredientsMarkup}
    </ul>
    
    <p class="instructions">${recipe.instructions}</p>
    
    <div class="modal-actions">
      <button class="btn btn-primary" id="modal-fav-btn" data-id="${recipe._id}">${isFav ? 'Remove from favorite' : 'Add to favorite'}</button>
      <button class="btn btn-outline" id="modal-rating-btn" data-id="${recipe._id}">Give a rating</button>
    </div>
  `;
};
