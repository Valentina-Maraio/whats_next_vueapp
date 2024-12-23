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
            <div v-if="selectedAuthor"
              class="autors-grid custom-card-bg">
              <div class="card-body card-result results">
                <h2 class="card-title text-center mb-3">Suggestions for books by "{{ selectedAuthor }}"</h2>
                <ul v-if="suggestedBooks.length > 0">
                  <li v-for="(book, index) in suggestedBooks" :key="index">{{ book }}</li>
                </ul>
                <p v-else>No suggestions available.</p>
                <button @click="closeCard" class="btn btn-danger w-100 mt-3">Close</button>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>


<script>
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


<style>
/* Ensure the body has no margin and padding */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.sfondo {
  background-image: url('@/assets/whats_next_app.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  position: relative;
}

/* Adjust the inner container's height to account for the margin */
.m-3.flex-grow-1 {
  height: calc(100% - 2rem);
  /* Adjust for 1.5rem margin (1.5rem * 2 = 3rem total) */
}

/* Optional styling for the inner divs */
.inner-div {
  height: 100%;
  /* Fill the column height */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.responsive-image {
  width: 100%;
  /* Make the image fill the container width */
  height: auto;
  /* Maintain the aspect ratio */
  object-fit: cover;
  /* Ensure the image covers the div without stretching */
  display: block;
  /* Remove any spacing below the image */
  border-radius: 8px;
  /* Optional: rounded corners */
}

.responsive-video {
  width: 100%;
  /* Ensure the video fills the container width */
  height: auto;
  /* Maintain the aspect ratio */
  object-fit: cover;
  /* Ensure the video covers the container without stretching */
  display: block;
  /* Remove any spacing below the video */
  border-radius: 8px;
  /* Optional: rounded corners */
}

.card {
  max-width: 500px;
  min-height: 650px;
  /* Define a minimum height for the card */
  z-index: 100;
  /* Ensure the card appears above other elements */
  position: relative;
  margin: 0 auto;
}


.position-relative {
  position: relative;
  /* Necessary for the card to be positioned relative to this container */
}

/* Center the card over the second column */
.position-absolute {
  position: absolute;
  top: 50%;
  /* Vertically center the card */
  left: 50%;
  /* Horizontally center the card */
  transform: translate(-50%, -50%);
  /* Adjust the card's position by its own width/height */
}

/* Style for the Close button */
.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

.authors-grid {
  display: grid;
  grid-template-columns: 1fr;
  /* Single column layout */
  margin-top: 145px;
  z-index: 200;
  justify-items: start;
  margin-left: 80px;
}

button {
  color: black;
  border: none;
  cursor: pointer;
  line-height: 1.5;
  background: none;
}

button:hover {
  background-color: #febd3b;
}

h1,
h2 {
  color: #333;
}

div {
  margin-bottom: 20px;
}

.custom-background {
  background-image: url('@/assets/library_card.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  position: relative;
  border-radius: 8px;
}

/* Adjust the position of the card */
.custom-card-position {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  /* Optional: background transparency */
}

.card-result {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure the card takes up the full height of its container */
  position: relative;
  overflow: hidden;
  background: rgba(103, 101, 101, 0.5); /* Opaque background (black with 50% opacity) */
  backdrop-filter: blur(10px); /* Apply the blur effect to the background */
  color: white; /* Text color */
  border-radius: 16px;
}

.results {
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures the button is pushed to the bottom */
  flex-grow: 1; 
}
</style>