import Vue from 'vue';
import Vuex from 'vuex';
import apiClient from '@/services/api';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    books: [],
    error: null,
  },
  mutations: {
    setBooks(state, books) {
      state.books = books;
    },
    setError(state, error) {
      state.error = error;
    },
    addBook(state, newBook) {
      state.books.push(newBook);
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
    async addBook({ commit }, newBook) {
      try {
        const response = await apiClient.post('/', newBook);
        commit('addBook', response.data);
      } catch (error) {
        commit('setError', `Error adding book: ${error.message}`);
      }
    },
  },
});

export default store;
