import axios from 'axios';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api';

const api = axios.create({
  baseURL: BASE_URL
});

export const fetchEvents = async () => {
  const { data } = await api.get('/events');
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

export const fetchRecipes = async (params = {}) => {
  // params can include: category, area, ingredient, time, title, page, limit
  const { data } = await api.get('/recipes', { params });
  return data;
};

export const fetchRecipeById = async (id) => {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
};

export const fetchIngredients = async () => {
  const { data } = await api.get('/ingredients');
  return data;
};

export const fetchAreas = async () => {
  const { data } = await api.get('/areas');
  return data;
};

export const submitOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const submitRating = async (recipeId, ratingData) => {
  const { data } = await api.patch(`/recipes/${recipeId}/rating`, ratingData);
  return data;
};
