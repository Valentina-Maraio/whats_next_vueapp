<template>
  <div class="container-fluid vh-100 d-flex flex-column sfondo">
    <div class="m-3 flex-grow-1">
      <b-row class="h-100">
        <b-col cols="12" md="5" class="p-3">
          <div class="inner-div">
            <!-- Card for input fields -->
            <div class="card w-75 p-3 shadow custom-background">
              <div class="card-body">
                <div class="authors-grid">
                  <!-- Loop through the first 10 random authors -->
                  <div v-for="(author, index) in randomAuthors" :key="index">
                    <button @click="handleSelectAuthor(author)">
                      {{ author }}
                    </button>
                  </div>
                </div>
                <div v-if="error" class="text-danger">
                  <p>Error fetching suggestions.</p>
                </div>
              </div>
            </div>
          </div>
        </b-col>

        <!-- Column 3 (Displaying the Card) -->
        <b-col cols="12" md="7" class="p-3 text-white position-relative">
          <div class="inner-div">
            <!-- Conditionally render the card based on form input -->
            <div v-if="selectedAuthor" class="autors-grid custom-card-bg">
              <div class="card-body card-result results">
                <div class="space">
                  <h2 class="card-title text-center mb-3">Suggestions for books by "{{ selectedAuthor }}"</h2>
                  <ul v-if="suggestedBooks.length > 0">
                    <li v-for="(book, index) in suggestedBooks" :key="index">{{ book }}</li>
                  </ul>
                  <p v-else>No suggestions available.</p>
                  <button @click="closeCard" class="close w-100 mt-3">Close</button>
                </div>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>


<script>
import "../style/Layoutstyle.css";

export default {
  data() {
    return {
      books: [],               // List of books fetched from API
      authors: [],             // List of authors
      randomAuthors: [],       // List of 10 random authors
      selectedAuthor: null,    // Selected author by the user
      suggestedBooks: [],      // Suggested books
      loading: false,          // Loading state
      error: false,            // Error state
    };
  },
  methods: {
    // Fetch books from the API
    async fetchBooks() {
      try {
        const response = await fetch('https://whats-next-tbr-fastapi.onrender.com/books/');
        this.books = await response.json();
        this.authors = this.books.map(book => book.author);
        this.randomAuthors = this.authors.filter((author, index, self) => self.indexOf(author) === index).slice(0, 5);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },

    // Handle selecting an author and fetch suggestions
    async handleSelectAuthor(author) {
      this.selectedAuthor = author;
      this.loading = true;  // Show loading spinner
      this.error = false;   // Reset error state
      this.suggestedBooks = []; // Clear previous suggestions

      const suggestions = await this.fetchSuggestions(author);
      this.suggestedBooks = suggestions.suggestions;
      this.loading = false; // Hide loading spinner
    },

    // Fetch book suggestions based on the selected author
    async fetchSuggestions(author) {
      try {
        const response = await fetch('https://whats-next-tbr-fastapi.onrender.com/suggestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ author }),
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          console.error("Error fetching suggestions:", errorDetails); // Log error details
          throw new Error('Failed to fetch suggestions');
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        this.error = true; // Set error state if the request fails
        this.loading = false; // Hide loading spinner
        return { suggestions: [] };
      }
    },

    // Function to close the card
    closeCard() {
      this.selectedAuthor = null; // Close the card by clearing the searchedBook data
    }
  },
  mounted() {
    // Fetch books when the component is mounted
    this.fetchBooks();
  }
};
</script>
