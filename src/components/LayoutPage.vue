<template>
  <div class="container-fluid vh-100 d-flex flex-column">
    <div class="m-3 flex-grow-1 border">
      <b-row class="h-100">
        <b-col cols="12" md="5" class="p-3 border bg-light">
          <div class="inner-div">
            <!-- Card for input fields -->
            <div class="card w-75 p-3 shadow">
              <div class="card-body">
                <h5 class="card-title text-center mb-3">Choose Your Next Adventure</h5>
                <div class="authors-grid">
                  <!-- Loop through the first 10 grouped authors -->
                  <div v-for="(booksByAuthor, author) in limitedGroupedBooks" :key="author">
                    <button @click="handleSelectAuthor(author)">
                      {{ author }}
                    </button>
                  </div>
                </div>
                <div v-if="loading">
                  <p>Loading suggestions...</p>
                </div>
                <div v-if="error" class="text-danger">
                  <p>Error fetching suggestions.</p>
                </div>
              </div>
            </div>
          </div>
        </b-col>

        <!-- Column 3 (Displaying the Card) -->
        <b-col cols="12" md="7" class="p-3 border bg-secondary text-white position-relative">
          <div class="inner-div">
            <p>Content for Column 3</p>
            <!-- Conditionally render the card based on form input -->
            <div v-if="selectedAuthor"
              class="card w-75 mx-auto mt-5 position-absolute top-50 start-50 translate-middle z-index-100 custom-card-bg">
              <div class="card-body">
                <h2 class="card-title text-center mb-3">Suggestions for books by "{{ selectedAuthor }}"</h2>
              </div>
              <ul v-if="suggestedBooks.length > 0">
                <li v-for="(book, index) in suggestedBooks" :key="index">{{ book }}</li>
              </ul>
              <p v-else>No suggestions available.</p>
              <button @click="closeCard" class="btn btn-danger w-100 mt-3">Close</button>
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
      selectedAuthor: null,    // Selected author by the user
      suggestedBooks: [],      // Suggested books from OpenAI
      loading: false,          // Loading state
      error: false,            // Error state
    };
  },
  computed: {
    // Group books by author
    groupedBooks() {
      return this.books.reduce((groups, book) => {
        const author = book.author || 'Unknown Author'; // Default if no author
        if (!groups[author]) {
          groups[author] = [];
        }
        groups[author].push(book);
        return groups;
      }, {});
    },
    // Get the first 10 authors
    limitedGroupedBooks() {
      const authors = Object.keys(this.groupedBooks).slice(0, 10); // Limit to 10 authors
      const limitedBooks = {};

      authors.forEach(author => {
        limitedBooks[author] = this.groupedBooks[author];
      });

      return limitedBooks;
    }
  },
  methods: {
    // Fetch books from the API
    async fetchBooks() {
      try {
        const response = await fetch('https://whats-next-tbr-fastapi.onrender.com/books/');
        this.books = await response.json();
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    },

    // Handle selecting an author and fetch AI suggestions
    async handleSelectAuthor(author) {
      this.selectedAuthor = author;
      this.loading = true;  // Show loading spinner
      this.error = false;   // Reset error state
      this.suggestedBooks = []; // Clear previous suggestions

      const suggestions = await this.fetchSuggestions(author);
      this.suggestedBooks = suggestions;
      this.loading = false; // Hide loading spinner
    },

    // Fetch book suggestions based on the selected author
    async fetchSuggestions(author) {
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`, // Add your OpenAI API key here
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Suggest some books written by ${author}.`,
        max_tokens: 150,
        n: 5,
        stop: ['\n'],
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error fetching suggestions:", errorDetails); // Log error details
      throw new Error('Failed to fetch suggestions');
    }

    const data = await response.json();
    return data.choices.map(choice => choice.text.trim()); // Parse the response for suggestions
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    this.error = true; // Set error state if the request fails
    this.loading = false; // Hide loading spinner
    return [];
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

.card {
  max-width: 500px;
  z-index: 100;
  /* Ensure the card appears above other elements */
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

/* Semi-transparent background for the card */
.custom-card-bg {
  background-color: rgba(255, 255, 255, 0.8);
  /* White background with 80% opacity */
  color: #000;
  /* Ensure text remains readable */
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
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  /* Responsive grid */
  gap: 10px;
  margin-top: 20px;
  z-index: 200;
}

button {
  margin: 5px;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

h1,
h2 {
  color: #333;
}

div {
  margin-bottom: 20px;
}
</style>