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
          @click="firstName = normalize(randomFirstnamePonderated(firstNames,preComputedTotalFirstnames))">Change first name</button>
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="lastName = normalize(randomLastnamePonderated(lastNames,preComputedTotalLastnames))">Change last name</button>
        <button class="m-1 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="generateUsername">Generate username</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { firstNames, lastNames, normalize, precomputeCumulativeSums, randomFirstnamePonderated, randomLastnamePonderated } from '../generator';
  
  const firstName = ref('');
  const lastName = ref('');
  const preComputedTotalFirstnames = ref(0);
  const preComputedTotalLastnames = ref(0);
  
  function generateUsername() {
    preComputedTotalFirstnames.value = precomputeCumulativeSums(firstNames.firstnames);
    preComputedTotalLastnames.value = precomputeCumulativeSums(lastNames.lastnames);
    console.log(`preComputedTotalFirstnames: ${preComputedTotalFirstnames.value}`);
    console.log(`preComputedTotalLastnames: ${preComputedTotalLastnames.value}`);
    firstName.value = normalize(randomFirstnamePonderated(firstNames,preComputedTotalFirstnames.value));
    lastName.value = normalize(randomLastnamePonderated(lastNames,preComputedTotalLastnames.value));
  }
  onMounted(() => {
    generateUsername();
  });
  </script>