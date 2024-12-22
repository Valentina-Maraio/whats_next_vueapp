<template>
    <div class="container-fluid vh-100 d-flex flex-column">
      <!-- Outer container with margin -->
      <div class="m-3 flex-grow-1 border">
        <b-row class="h-100">
          <!-- Combined Column (1 & 2) -->
          <b-col cols="12" md="5" class="p-3 border bg-light">
            <div class="inner-div">
              <!-- Card for input fields -->
              <div class="card w-75 p-3 shadow">
                <div class="card-body">
                  <h5 class="card-title text-center mb-3">Choose Your Next Adventure</h5>
                  <form @submit.prevent="searchBook">
                    <!-- Title Input -->
                    <div class="mb-3">
                      <label for="title" class="form-label text-start d-block">Title</label>
                      <input v-model="title" type="text" class="form-control" id="title" placeholder="Enter the title" />
                    </div>
  
                    <!-- Author Input -->
                    <div class="mb-3">
                      <label for="author" class="form-label text-start d-block">Author</label>
                      <input v-model="author" type="text" class="form-control" id="author" placeholder="Enter the author" />
                    </div>
  
                    <!-- Submit Button -->
                    <div class="mb-3">
                      <button type="submit" class="btn btn-primary w-100">Search</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </b-col>
  
          <!-- Column 3 (Displaying the Card) -->
          <b-col cols="12" md="7" class="p-3 border bg-secondary text-white position-relative">
            <div class="inner-div">
              <p>Content for Column 3</p>
              <!-- Conditionally render the card based on form input -->
              <div v-if="searchedBook" class="card w-75 mx-auto mt-5 position-absolute top-50 start-50 translate-middle z-index-100 custom-card-bg">
                <div class="card-body">
                  <h5 class="card-title text-center mb-3">Found Book/Author</h5>
                  <p><strong>Title:</strong> {{ searchedBook.title }}</p>
                  <p><strong>Author:</strong> {{ searchedBook.author }}</p>
                  <!-- Close Button -->
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
    name: "ColumnsWithCard",
    data() {
      return {
        title: "", // Bound to the Title input
        author: "", // Bound to the Author input
        searchedBook: null, // Object to hold the searched book info
      };
    },
    methods: {
      // Function to handle the form submission
      searchBook() {
        // Dummy search logic: replace with your actual search functionality
        if (this.title || this.author) {
          this.searchedBook = {
            title: this.title || "Unknown Title",
            author: this.author || "Unknown Author",
          };
        } else {
          alert("Please enter a title or author.");
        }
      },
      // Function to close the card
      closeCard() {
        this.searchedBook = null; // Close the card by clearing the searchedBook data
      },
    },
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
  z-index: 100; /* Ensure the card appears above other elements */
}

.position-relative {
  position: relative; /* Necessary for the card to be positioned relative to this container */
}

/* Center the card over the second column */
.position-absolute {
  position: absolute;
  top: 50%; /* Vertically center the card */
  left: 50%; /* Horizontally center the card */
  transform: translate(-50%, -50%); /* Adjust the card's position by its own width/height */
}

/* Semi-transparent background for the card */
.custom-card-bg {
  background-color: rgba(255, 255, 255, 0.8); /* White background with 80% opacity */
  color: #000; /* Ensure text remains readable */
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
</style>