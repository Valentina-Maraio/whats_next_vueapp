import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://whats-next-tbr-fastapi.onrender.com/books",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  getBooks() {
    return apiClient.get('/books/');
  },
  getSuggestions(author) {
    return apiClient.post('/suggestion', { author });  // POST request to /suggestion
  }
};
