<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const websiteName = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>('')
const fileContents = ref<string>('Website,Password\n')

const generatePassword = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
  const length = 12
  let newPassword = ''
  do {
    newPassword = Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)],
    ).join('')
  } while (!isValidPassword(newPassword))
  password.value = newPassword
}

const isValidPassword = (pass: string) => {
  return /[A-Z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 12
}

const isValidWebsite = (url: string) => {
  const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/
  return pattern.test(url)
}

const saveToFile = async () => {
  errorMessage.value = ''

  if (!websiteName.value.trim() || !password.value.trim()) {
    errorMessage.value = 'Website name and password cannot be empty.'
    return
  }

  if (!isValidWebsite(websiteName.value)) {
    errorMessage.value = 'Please enter a valid website URL.'
    return
  }

  if (!isValidPassword(password.value)) {
    errorMessage.value =
      'Password must be at least 12 characters long, contain at least one uppercase letter, and one numeric digit.'
    return
  }

  try {
    await axios.post('http://localhost:3000/save', {
      website: websiteName.value,
      password: password.value,
    })
    alert('Password saved successfully!')
    fetchFileContents()
  } catch (error) {
    errorMessage.value = 'Error saving password.'
  }
}

const downloadFile = async () => {
  try {
    const response = await axios.get('http://localhost:3000/download', { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'passwords.csv'
    link.click()
  } catch (error) {
    errorMessage.value = 'Error downloading file.'
  }
}

const resetFile = async () => {
  try {
    await axios.post('http://localhost:3000/reset')
    alert('Saved passwords have been reset!')
    fetchFileContents()
  } catch (error) {
    errorMessage.value = 'Error resetting file.'
  }
}

const fetchFileContents = async () => {
  try {
    const response = await axios.get('http://localhost:3000/contents')
    fileContents.value = response.data
  } catch (error) {
    errorMessage.value = 'Error fetching file contents.'
  }
}

onMounted(fetchFileContents)
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
        placeholder="Website URL"
        class="px-2 py-1 border border-gray-300 rounded w-full mb-2"
      />
    </div>
    <div class="mb-4 flex items-center gap-2">
      <input
        v-model="password"
        type="text"
        placeholder="Generated Password"
        class="px-2 py-1 border border-gray-300 rounded w-full font-mono"
      />
      <button class="px-4 py-2 bg-blue-500 text-white rounded" @click="generatePassword">
        Generate
      </button>
    </div>
    <div class="flex gap-2">
      <button class="px-4 py-2 bg-green-500 text-white rounded" @click="saveToFile">
        Save to File
      </button>
      <button class="px-4 py-2 bg-gray-500 text-white rounded" @click="downloadFile">
        Download File
      </button>
      <button class="px-4 py-2 bg-red-500 text-white rounded" @click="resetFile">Reset</button>
    </div>
    <p v-if="errorMessage" class="text-red-500 mt-2 max-w-[300px]">{{ errorMessage }}</p>
  </div>
</template>
