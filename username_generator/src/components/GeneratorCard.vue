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
          @click="firstName = normalize(randomFirstnamePonderated(FirstNames,preComputedTotalFirstnames))">Change first name</button>
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="lastName = normalize(randomLastnamePonderated(LastNames,preComputedTotalLastnames))">Change last name</button>
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="generateUsername">Generate username</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { FirstNames, LastNames, normalize, precomputeCumulativeSums, randomFirstnamePonderated, randomLastnamePonderated } from '../generator';
  
  const firstName = ref('');
  const lastName = ref('');
  const preComputedTotalFirstnames = ref(0);
  const preComputedTotalLastnames = ref(0);
  
  function generateUsername() {
    preComputedTotalFirstnames.value = precomputeCumulativeSums(FirstNames.firstnames);
    preComputedTotalLastnames.value = precomputeCumulativeSums(LastNames.lastnames);
    console.log(`preComputedTotalFirstnames: ${preComputedTotalFirstnames.value}`);
    console.log(`preComputedTotalLastnames: ${preComputedTotalLastnames.value}`);
    firstName.value = normalize(randomFirstnamePonderated(FirstNames,preComputedTotalFirstnames.value));
    lastName.value = normalize(randomLastnamePonderated(LastNames,preComputedTotalLastnames.value));
  }
  onMounted(() => {
    generateUsername();
  });
  </script>