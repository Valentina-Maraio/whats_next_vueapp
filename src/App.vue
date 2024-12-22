<template>
  <div id="app">
    <AddBook />
    <ApiData />
  </div>
</template>

<script>
import ApiData from "./components/ApiData";
import AddBook from "./components/AddBook";
import SearchCard from "./components/SearchCard.vue";

export default {
  name: "App",
  components: {
    ApiData,
    AddBook,
  },
};
</script>
