import Vue from 'vue';
import Vuex from 'vuex';
import apiClient from '@/services/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    books: [],
    error: null,
    searchedBook: null, // Store the single searched book
  },
  mutations: {
    setBooks(state, books) {
      state.books = books;
    },
    setError(state, error) {
      state.error = error;
    },
    setSearchedBook(state, book) {
      state.searchedBook = book;
    },
  },
  actions: {
    async fetchBooks({ commit }) {
      try {
        const response = await apiClient.get('/');
        commit('setBooks', response.data);
      } catch (error) {
        commit('setError', `Error fetching data: ${error.message}`);
      }
    },

    // Search books based on title or author
    async searchBooks({ commit }, params) {
      try {
        const response = await apiClient.get('/', { params });
        if (response.data.length > 0) {
          commit('setSearchedBook', response.data[0]); // Set the first matching book
        } else {
          commit('setSearchedBook', null); // No book found
        }
      } catch (error) {
        commit('setError', `Error searching books: ${error.message}`);
        commit('setSearchedBook', null); // Reset searched book on error
      }
    },
  },
});

export default store;
