<script setup lang="ts">
import { CreateRoom, SendMessage } from '@/shared/types'
import PartySocket from 'partysocket'
import { parse } from 'valibot'
import { onUnmounted, ref, useId } from 'vue'

const socket = new PartySocket({
  host: window.location.host,
  id: prompt('Enter your name:') || 'taro',
  room: 'my-room',
  party: 'ludo',
})

socket.addEventListener('open', () => {
  console.log('WebSocket connection opened')
})

socket.addEventListener('message', (event) => {
  console.log('Received message:', event.data)
})

onUnmounted(() => {
  console.log('Closing WebSocket connection')
  socket.close()
})

const message = ref('')
const messageId = useId()

const handleSubmit = (e: Event) => {
  socket.send(
    JSON.stringify(
      parse(SendMessage, {
        type: 'SendMessage',
        content: message.value,
      } as SendMessage),
    ),
  )
}
</script>

<template>
  <main>
    <form @submit.prevent="handleSubmit">
      <label :for="messageId">Message:</label>
      <input :id="messageId" v-model="message" />
      <button type="submit">Send Message</button>
    </form>
  </main>
</template>
