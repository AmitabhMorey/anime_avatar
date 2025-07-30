class AnimeAvatarGenerator {
    constructor() {
        this.apiKey = 'b7a36de193a3ce83f9f0f5148f842a362d372b2e128aa5596f94308130802a6e';
        this.visionApiUrl = 'https://api.together.xyz/v1/chat/completions';
        this.imageApiUrl = 'https://api.together.xyz/v1/images/generations';
        this.uploadedImage = null;
        this.uploadedImageBase64 = null;
        this.initializeElements();
        this.attachEventListeners();
        this.requestStartTime = null;
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.imageUpload = document.getElementById('image-upload');
        this.uploadArea = document.getElementById('upload-area');
        this.imagePreview = document.getElementById('image-preview');
        this.stylePrompt = document.getElementById('style-prompt');
        this.modelSelect = document.getElementById('model-select');
        this.generateBtn = document.getElementById('generate-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.charCount = document.getElementById('char-count');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.emptyState = document.getElementById('empty-state');
        this.avatarResult = document.getElementById('avatar-result');
        this.generatedAvatar = document.getElementById('generated-avatar');
        this.downloadBtn = document.getElementById('download-btn');
        this.regenerateBtn = document.getElementById('regenerate-btn');
        this.errorMessage = document.getElementById('error-message');
        this.generationMeta = document.getElementById('generation-meta');
        this.usedModel = document.getElementById('used-model');
        this.generationTime = document.getElementById('generation-time');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.imageUpload.click());
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Text input events
        this.stylePrompt.addEventListener('input', () => this.updateCharCount());

        // Button events
        this.generateBtn.addEventListener('click', () => this.generateAvatar());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadBtn.addEventListener('click', () => this.downloadAvatar());
        this.regenerateBtn.addEventListener('click', () => this.generateAvatar());
    }

    /**
     * Handle drag over event
     */
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    /**
     * Handle drag leave event
     */
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    /**
     * Handle drop event
     */
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImageFile(files[0]);
        }
    }

    /**
     * Handle image upload
     */
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processImageFile(file);
        }
    }

    /**
     * Process uploaded image file
     */
    processImageFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image file is too large. Please select an image smaller than 10MB.');
            return;
        }

        this.uploadedImage = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImageBase64 = e.target.result;
            this.showImagePreview(e.target.result, file);
            this.generateBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    /**
     * Show image preview
     */
    showImagePreview(imageSrc, file) {
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileName = file.name;
        
        this.imagePreview.innerHTML = `
            <img src="${imageSrc}" alt="Preview" class="preview-image">
            <div class="preview-info">
                <p><strong>${fileName}</strong></p>
                <p>Size: ${fileSize} MB</p>
                <button class="remove-image" onclick="this.parentElement.parentElement.parentElement.clearImage()">
                    <i class="fas fa-times"></i> Remove
                </button>
            </div>
        `;
        
        // Hide upload area
        this.uploadArea.style.display = 'none';
    }

    /**
     * Clear uploaded image
     */
    clearImage() {
        this.uploadedImage = null;
        this.uploadedImageBase64 = null;
        this.imagePreview.innerHTML = '';
        this.uploadArea.style.display = 'block';
        this.generateBtn.disabled = true;
        this.imageUpload.value = '';
    }

    /**
     * Update character count for style prompt
     */
    updateCharCount() {
        const count = this.stylePrompt.value.length;
        this.charCount.textContent = count;
        
        if (count > 450) {
            this.charCount.style.color = '#e53e3e';
        } else if (count > 350) {
            this.charCount.style.color = '#dd6b20';
        } else {
            this.charCount.style.color = '#666';
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
        this.emptyState.classList.add('hidden');
        this.avatarResult.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.generationMeta.classList.add('hidden');
        this.generateBtn.disabled = true;
        this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
        this.generateBtn.disabled = false;
        this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Avatar';
    }

    /**
     * Show error message
     */
    showError(message, details = null) {
        this.hideLoading();
        this.emptyState.classList.add('hidden');
        this.avatarResult.classList.add('hidden');
        this.errorMessage.classList.remove('hidden');
        this.generationMeta.classList.add('hidden');

        let errorHtml = `<strong>Error:</strong> ${message}`;
        if (details) {
            errorHtml += `<br><small>${details}</small>`;
        }

        this.errorMessage.querySelector('.error-text').innerHTML = errorHtml;
    }

    /**
     * Show generated avatar
     */
    showAvatar(imageUrl, model, generationTimeMs) {
        this.hideLoading();
        this.emptyState.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.avatarResult.classList.remove('hidden');
        this.generationMeta.classList.remove('hidden');

        // Display generated avatar
        this.generatedAvatar.src = imageUrl;
        this.generatedAvatar.onload = () => {
            // Enable download once image is loaded
            this.downloadBtn.disabled = false;
        };

        // Display metadata
        this.usedModel.textContent = model;
        this.generationTime.textContent = `${generationTimeMs}ms`;
    }

    /**
     * Analyze uploaded image using vision model
     */
    async analyzeImage() {
        const requestBody = {
            model: "meta-llama/Llama-3.2-11B-Vision-Instruct-Turbo",
            messages: [{
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Analyze this image and describe the person's appearance focusing on facial features, hair, clothing, and overall style. Keep the description detailed but concise for use in anime art generation."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: this.uploadedImageBase64
                        }
                    }
                ]
            }],
            max_tokens: 200,
            temperature: 0.7
        };

        const response = await fetch(this.visionApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Vision API failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Generate anime avatar
     */
    async generateAvatar() {
        if (!this.uploadedImage) {
            this.showError('Please upload an image first.');
            return;
        }

        this.showLoading();
        this.requestStartTime = Date.now();

        try {
            // Step 1: Analyze the uploaded image
            const imageDescription = await this.analyzeImage();

            // Step 2: Create anime prompt
            const userStyle = this.stylePrompt.value.trim();
            const animePrompt = this.createAnimePrompt(imageDescription, userStyle);

            // Step 3: Generate anime avatar
            const model = this.modelSelect.value;
            const requestBody = {
                model: model,
                prompt: animePrompt,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            };

            const response = await fetch(this.imageApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            const generationTime = Date.now() - this.requestStartTime;

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = `Generation failed: ${response.status} ${response.statusText}`;
                let errorDetails = null;

                if (response.status === 401) {
                    errorMessage = 'Authentication failed';
                    errorDetails = 'Please check your API key';
                } else if (response.status === 429) {
                    errorMessage = 'Rate limit exceeded';
                    errorDetails = 'Please wait before generating another avatar';
                } else if (response.status === 400) {
                    errorMessage = 'Invalid request';
                    errorDetails = errorData.error?.message || 'Please try with a different image or style';
                } else if (response.status >= 500) {
                    errorMessage = 'Server error';
                    errorDetails = 'The Together AI service is temporarily unavailable';
                }

                if (errorData.error && errorData.error.message) {
                    errorDetails = errorData.error.message;
                }

                this.showError(errorMessage, errorDetails);
                return;
            }

            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                this.showError('No image generated', 'The API returned an empty response');
                return;
            }

            const imageUrl = data.data[0].url;
            this.showAvatar(imageUrl, model, generationTime);

        } catch (error) {
            console.error('Avatar Generation Error:', error);
            
            let errorMessage = 'Failed to generate avatar';
            let errorDetails = error.message;

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                errorMessage = 'Network connection failed';
                errorDetails = 'Please check your internet connection and try again';
            } else if (error.name === 'AbortError') {
                errorMessage = 'Request timeout';
                errorDetails = 'The generation took too long to complete';
            }

            this.showError(errorMessage, errorDetails);
        }
    }

    /**
     * Create anime-style prompt from image description and user input
     */
    createAnimePrompt(imageDescription, userStyle) {
        let prompt = `anime style portrait, highly detailed, beautiful anime art, ${imageDescription}`;
        
        if (userStyle) {
            prompt += `, ${userStyle}`;
        }
        
        prompt += ', anime face, expressive eyes, clean line art, vibrant colors, studio quality, detailed shading, professional anime illustration';
        
        return prompt;
    }

    /**
     * Download generated avatar
     */
    async downloadAvatar() {
        if (!this.generatedAvatar.src) return;

        try {
            const response = await fetch(this.generatedAvatar.src);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `anime-avatar-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            this.showError('Failed to download avatar', 'Please try right-clicking the image and saving it manually');
        }
    }

    /**
     * Clear all inputs and outputs
     */
    clearAll() {
        // Clear uploaded image
        this.clearImage();
        
        // Clear style input
        this.stylePrompt.value = '';
        this.updateCharCount();
        
        // Reset model selection
        this.modelSelect.selectedIndex = 0;
        
        // Show empty state
        this.emptyState.classList.remove('hidden');
        this.avatarResult.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
        this.generationMeta.classList.add('hidden');
        this.loadingIndicator.classList.add('hidden');
        
        // Reset buttons
        this.generateBtn.disabled = true;
        this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Avatar';
        this.downloadBtn.disabled = false;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const generator = new AnimeAvatarGenerator();
    
    // Make clearImage method available globally for the remove button
    window.clearImage = () => generator.clearImage();
});

// Handle online/offline status
window.addEventListener('online', () => {
    console.log('Connection restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
    document.querySelector('.error-message .error-text').innerHTML = 
        '<strong>Connection Lost:</strong> Please check your internet connection.';
    document.querySelector('.error-message').classList.remove('hidden');
});