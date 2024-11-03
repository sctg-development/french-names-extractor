<template>
    <div class="max-w-xl rounded overflow-hidden shadow-lg">
  
      <div class="px-6 py-4">
        <div class="font-bold text-xl mb-2 capitalize">The French username generator</div>
        <p class="text-gray-700 text-base">
          <span>{{ firstName }}</span>.<span>{{ lastName }}@domain.tld</span>
        </p>
      </div>
      <div class="px-6 pt-4 pb-2">
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="firstName = normalize(randomFirstnamePonderated(firstNames))">Change first name</button>
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="lastName = normalize(randomLastnamePonderated(lastNames))">Change last name</button>
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="generateUsername">Generate username</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { firstNames, lastNames, normalize, randomFirstnamePonderated, randomLastnamePonderated } from '../generator';
  
  const firstName = ref('');
  const lastName = ref('');
  
  function generateUsername() {
    firstName.value = normalize(randomFirstnamePonderated(firstNames));
    lastName.value = normalize(randomLastnamePonderated(lastNames));
  }
  onMounted(() => {
    generateUsername();
  });
  </script>