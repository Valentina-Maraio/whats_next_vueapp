<template>
    <div>
      <h1>Books List</h1>
      <div v-if="error">{{ error }}</div>
      <ul>
        <li v-for="book in books" :key="book.id">
          {{ book.Title }} by {{ book.author }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        books: [],
        error: null,
      };
    },
    async mounted() {
      try {
        const response = await axios.get("https://whats-next-tbr-fastapi.onrender.com/books");
        this.books = response.data;
      } catch (error) {
        this.error = `Error fetching data: ${error.message}`;
      }
    },
  };
  </script>
  