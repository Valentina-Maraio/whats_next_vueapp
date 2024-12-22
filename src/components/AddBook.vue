<template>
    <div>
        <h2>Add New Book</h2>
        <form @submit.prevent="addBook">
            <label for="title">Title:</label>
            <input type="text" id="title" v-model="newBook.title" required />
            <br /><br />
            <label for="author">Author:</label>
            <input type="text" id="author" v-model="newBook.author" required />
            <br /><br />
            <button type="submit">Add Book</button>
        </form>
    </div>
</template>


<script>
import axios from 'axios';
import { nextTick } from 'vue';

export default {
    data() {
        return {
            newBook: {
                title: '',
                author: '',
            },
            books: [],
            errors: [],
            intervalId: null,
            searchQuery: '',
        };
    },
    mounted() {
        this.fetchBooks();
        this.intervalId = setInterval(this.fetchBooks, 5000); // Fetch data every 5 seconds
    },
    beforeUnmount() {
        clearInterval(this.intervalId);
    },
    computed: {
        filteredBooks() {
            return this.books.filter(book => {
                const title = book.title.toLowerCase();
                const author = book.author.toLowerCase();
                const query = this.searchQuery.toLowerCase();
                return title.includes(query) || author.includes(query);
            });
        }
    },
    methods: {
        addBook() {
            // Call the API to add the new book
            axios.post('https://whats-next-tbr-fastapi.onrender.com/books', this.newBook)
                .then(() => {
                    // Clear the form fields after successful submission
                    this.newBook.title = '';
                    this.newBook.author = '';
                    // Fetch the updated list immediately
                    this.fetchBooks();
                    nextTick(() => {
                        // Actions to perform after DOM update
                        console.log('DOM updated');
                    });
                })
                .catch(error => {
                    console.error('Error adding book:', error);
                });
        },
        fetchBooks() {
            axios
                .get('https://whats-next-tbr-fastapi.onrender.com/books')
                .then(response => {
                    this.books = response.data;
                })
                .catch(e => {
                    this.errors.push(e);
                });
        }
    }
};
</script>