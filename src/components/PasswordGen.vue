<script setup lang="ts">
import { ref } from 'vue'

const websiteName = ref<String>('')
const password = ref<String>('')
const errorMessage = ref<String>('')

const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  const length = 12
  password.value = Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join('')
}

const saveToFile = () => {
  errorMessage.value = ''

  if (!websiteName.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Website name and password cannot be empty.'
    return
  }

  if (password.value.length !== 12) {
    errorMessage.value = 'Password must be exactly 12 characters long.'
    return
  }

  const fileName = websiteName.value + '.txt'
  const content = `Website: ${websiteName.value}\nPassword: ${password.value}`
  const blob = new Blob([content], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
}
</script>

<template>
  <div
    class="bg-white text-black min-w-[500px] min-h-[500px] flex flex-col gap-6 justify-center items-center"
  >
    <h1 class="text-2xl font-bold mb-4">Password Generator</h1>
    <div class="mb-4 flex flex-col items-center justify-center gap-4">
      <input
        v-model="websiteName"
        type="text"
        placeholder="Website Name"
        class="px-2 py-1 border border-gray-300 rounded w-full mb-2"
      />
      <button class="px-4 py-2 bg-blue-500 text-white rounded" @click="generatePassword">
        Generate Password
      </button>
    </div>
    <div v-if="password" class="mb-4">
      <input
        v-model="password"
        type="text"
        class="px-2 py-1 border border-gray-300 rounded w-full font-mono"
      />
    </div>
    <div>
      <button class="px-4 py-2 bg-green-500 text-white rounded" @click="saveToFile">
        Save to File
      </button>
    </div>
    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
  </div>
</template>
