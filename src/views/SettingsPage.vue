<script setup lang="ts">
import { PASSWORD_KEY } from '@/Lib'
import * as utils from '@/Lib/Utils'
import { onMounted, ref } from 'vue'

const hasPassword = ref(false)
const storedPasswordHash = ref('')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const loadPasswordState = async (): Promise<void> => {
    const savedPassword = await utils.getData<unknown>(PASSWORD_KEY)
    if (typeof savedPassword === 'string' && savedPassword.length > 0) {
        hasPassword.value = true
        storedPasswordHash.value = savedPassword
    }
}

const clearMessages = (): void => {
    errorMessage.value = ''
    successMessage.value = ''
}

const savePassword = async (): Promise<void> => {
    clearMessages()

    if (!newPassword.value.trim()) {
        errorMessage.value = 'Please enter a new password.'
        return
    }

    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'New password and confirmation do not match.'
        return
    }

    if (hasPassword.value) {
        if (!currentPassword.value) {
            errorMessage.value = 'Please enter your current password to continue.'
            return
        }

        const currentPasswordHash = await utils.hashPassword(currentPassword.value)
        if (currentPasswordHash !== storedPasswordHash.value) {
            errorMessage.value = 'Current password is incorrect.'
            return
        }
    }

    isSaving.value = true

    try {
        const newPasswordHash = await utils.hashPassword(newPassword.value)
        await utils.saveConfiguration<string>(PASSWORD_KEY, newPasswordHash)

        hasPassword.value = true
        storedPasswordHash.value = newPasswordHash

        currentPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''

        successMessage.value = 'Password saved successfully.'
    } catch (error) {
        errorMessage.value = 'Failed to save password. Please try again.'
    } finally {
        isSaving.value = false
    }
}

onMounted(loadPasswordState)
</script>

<template>
    <main>
        <div class="content settings-content">
            <div class="page-title">
                <span class="page-title-caption">Settings</span>
                <span>Protect your settings with a password</span>
            </div>

            <section class="warning-box">
                <strong>Important:</strong>
                This password is stored with one-way encryption and cannot be recovered. If you forget it,
                you will need to remove and reinstall the extension.
            </section>

            <form class="form" @submit.prevent="savePassword">
                <div v-if="hasPassword" class="input-field">
                    <label for="current-password">Current password</label>
                    <div class="password-input">
                        <input id="current-password" v-model="currentPassword"
                            :type="showCurrentPassword ? 'text' : 'password'" autocomplete="current-password" />
                        <button type="button" class="toggle-visibility"
                            :aria-label="showCurrentPassword ? 'Hide current password' : 'Show current password'"
                            @click="showCurrentPassword = !showCurrentPassword">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 12C3.73 7.61 7.52 5 12 5C16.48 5 20.27 7.61 22 12C20.27 16.39 16.48 19 12 19C7.52 19 3.73 16.39 2 12Z"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                                <line v-if="showCurrentPassword" x1="4" y1="20" x2="20" y2="4" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="input-field">
                    <label for="new-password">{{ hasPassword ? 'New password' : 'Password' }}</label>
                    <div class="password-input">
                        <input id="new-password" v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                            autocomplete="new-password" />
                        <button type="button" class="toggle-visibility"
                            :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'"
                            @click="showNewPassword = !showNewPassword">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 12C3.73 7.61 7.52 5 12 5C16.48 5 20.27 7.61 22 12C20.27 16.39 16.48 19 12 19C7.52 19 3.73 16.39 2 12Z"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                                <line v-if="showNewPassword" x1="4" y1="20" x2="20" y2="4" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="input-field">
                    <label for="confirm-password">Confirm {{ hasPassword ? 'new ' : '' }}password</label>
                    <div class="password-input">
                        <input id="confirm-password" v-model="confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" />
                        <button type="button" class="toggle-visibility"
                            :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                            @click="showConfirmPassword = !showConfirmPassword">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2 12C3.73 7.61 7.52 5 12 5C16.48 5 20.27 7.61 22 12C20.27 16.39 16.48 19 12 19C7.52 19 3.73 16.39 2 12Z"
                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
                                <line v-if="showConfirmPassword" x1="4" y1="20" x2="20" y2="4" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p v-if="errorMessage" class="text-error feedback">{{ errorMessage }}</p>
                <p v-if="successMessage" class="feedback success">{{ successMessage }}</p>

                <button class="btn dark save-btn" type="submit" :disabled="isSaving">
                    {{ isSaving ? 'Saving...' : hasPassword ? 'Change Password' : 'Set Password' }}
                </button>
            </form>
        </div>
    </main>
</template>

<style scoped>
.settings-content {
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

.warning-box {
    margin-bottom: 20px;
    padding: 12px;
    border-radius: 6px;
    background: #fff6e6;
    border: 1px solid #ffd48a;
    color: #7a4d00;
    font-size: 12px;
    line-height: 1.5;
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

.input-field input {
    width: 100%;
    color: var(--text-color);
    font-family: 'Inter', sans-serif;
    padding: 10px 14px;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    font-size: 14px;
    background-color: var(--bg);
    transition: border-color 0.2s, box-shadow 0.2s;
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
    border: none;
    box-shadow: none;
    padding-right: 8px;
}

.password-input input:focus {
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

.input-field input:focus {
    outline: none;
    border-color: #767DE8;
    box-shadow: 0 0 0 3px rgba(118, 125, 232, 0.1);
}

.feedback {
    margin-top: 16px;
    margin-bottom: 0;
    font-size: 12px;
}

.success {
    color: #2a8a43;
}

.save-btn {
    margin-top: 20px;
}

.save-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

body.dark-mode .warning-box {
    background: #4a3a1f;
    border-color: #84621f;
    color: #ffd48a;
}
</style>
