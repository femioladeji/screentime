<script setup lang="ts">
import { MANAGE_TIME_UNLOCK_KEY, PASSWORD_KEY } from '@/Lib'
import * as utils from '@/Lib/Utils'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const storedPasswordHash = ref('')

const loadStoredPassword = async (): Promise<void> => {
    const savedPassword = await utils.getData<unknown>(PASSWORD_KEY)
    if (typeof savedPassword !== 'string' || !savedPassword.length) {
        router.replace('/app')
        return
    }

    storedPasswordHash.value = savedPassword
}

const unlockManageTime = async (): Promise<void> => {
    errorMessage.value = ''

    if (!password.value.trim()) {
        errorMessage.value = 'Please enter your password.'
        return
    }

    isSubmitting.value = true

    try {
        const enteredPasswordHash = await utils.hashPassword(password.value)
        if (enteredPasswordHash !== storedPasswordHash.value) {
            errorMessage.value = 'Incorrect password.'
            return
        }

        sessionStorage.setItem(MANAGE_TIME_UNLOCK_KEY, storedPasswordHash.value)

        const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/app'
        await router.replace(redirectTarget)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(loadStoredPassword)
</script>

<template>
    <main>
        <div class="content unlock-content">
            <div class="page-title">
                <span class="page-title-caption">Manage Time Locked</span>
                <span>Enter your password to continue</span>
            </div>

            <form class="form" @submit.prevent="unlockManageTime">
                <div class="input-field">
                    <label for="unlock-password">Password</label>
                    <div class="password-input">
                        <input id="unlock-password" v-model="password" :type="showPassword ? 'text' : 'password'"
                            autocomplete="current-password" />
                        <button type="button" class="toggle-visibility"
                            :aria-label="showPassword ? 'Hide password' : 'Show password'"
                            @click="showPassword = !showPassword">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 12C3.73 7.61 7.52 5 12 5C16.48 5 20.27 7.61 22 12C20.27 16.39 16.48 19 12 19C7.52 19 3.73 16.39 2 12Z"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                                <line v-if="showPassword" x1="4" y1="20" x2="20" y2="4" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p v-if="errorMessage" class="text-error feedback">{{ errorMessage }}</p>

                <button class="btn dark unlock-btn" type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Checking...' : 'Unlock Manage Time' }}
                </button>
            </form>
        </div>
    </main>
</template>

<style scoped>
.unlock-content {
    padding: 32px 40px;
}

.page-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 20px;
}

.page-title-caption {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color);
}

.page-title span:last-child {
    font-size: 13px;
    color: #828282;
}

form {
    max-width: 420px;
}

.input-field {
    margin-top: 16px;
}

.input-field label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-color);
}

.password-input {
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    background-color: var(--bg);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.password-input:focus-within {
    border-color: #767DE8;
    box-shadow: 0 0 0 3px rgba(118, 125, 232, 0.1);
}

.password-input input {
    width: 100%;
    color: var(--text-color);
    font-family: 'Inter', sans-serif;
    padding: 10px 14px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    background-color: var(--bg);
    box-shadow: none;
}

.password-input input:focus {
    outline: none;
    border: none;
    box-shadow: none;
}

.toggle-visibility {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: #767DE8;
    width: 36px;
    min-width: 36px;
    height: 36px;
    cursor: pointer;
    margin-right: 4px;
}

.toggle-visibility:hover {
    color: #5f66d6;
}

.feedback {
    margin-top: 16px;
    margin-bottom: 0;
    font-size: 12px;
}

.unlock-btn {
    margin-top: 20px;
}

.unlock-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}
</style>
