<template>
  <div>
    <h1>Books List</h1>
    <div v-if="error">{{ error }}</div>
    <ul>
      <li v-for="book in books" :key="book.id">
        {{ book.title }} by {{ book.author }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    books() {
      return this.$store.state.books;
    },
    error() {
      return this.$store.state.error;
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchBooks');
  },
};
</script>
