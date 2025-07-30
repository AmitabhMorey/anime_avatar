# Anime Avatar Generator

## Overview

This is a client-side web application that transforms user-uploaded photos into anime-style avatars using Together AI's image generation and vision models. The application analyzes uploaded images using AI vision models and generates custom anime avatars based on the person's appearance and optional style preferences.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a simple client-side architecture:

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **API Integration**: Direct browser-to-API calls to Together AI's REST API
- **Architecture Pattern**: Single-page application (SPA) with vanilla JavaScript

## Key Components

### Frontend Structure
- **index.html**: Main HTML structure with image upload interface and avatar display areas
- **style.css**: Modern CSS styling featuring drag-and-drop upload areas and image galleries
- **script.js**: JavaScript class-based application logic for image processing and AI generation

### Core JavaScript Class
- **AnimeAvatarGenerator**: Main application class handling:
  - Image upload and validation (drag-and-drop support)
  - Base64 image encoding for API calls
  - AI vision model integration for image analysis
  - AI image generation with anime-specific prompts
  - Download functionality for generated avatars

### UI Components
- **Image Upload Area**: Drag-and-drop interface with file validation (10MB limit)
- **Image Preview**: Shows uploaded image with file information and removal option
- **Style Input**: Optional text area for custom anime style descriptions (500 char limit)
- **Model Selection**: Dropdown with Together AI image generation models (FLUX, Stable Diffusion)
- **Avatar Display**: Generated anime avatar with download and regenerate options
- **Loading States**: Visual feedback during image analysis and generation

## Data Flow

1. User uploads image through drag-and-drop or file picker
2. Application validates image format and size, creates preview
3. User optionally adds custom style description
4. Vision AI model analyzes uploaded image to extract appearance details
5. System generates anime-specific prompt combining image analysis and user style
6. Image generation model creates anime avatar based on the prompt
7. Generated avatar is displayed with download and regenerate options

### API Integration
- **Vision API**: `https://api.together.xyz/v1/chat/completions` (Llama-3.2-11B-Vision-Instruct-Turbo)
- **Image Generation API**: `https://api.together.xyz/v1/images/generations` (FLUX.1 models)
- **Authentication**: API key included in request headers for both endpoints
- **Image Processing**: Base64 encoding for vision analysis, URL-based output for generated images
- **Two-Step Process**: Vision analysis → Anime prompt generation → Image creation

## External Dependencies

### CDN Resources
- **Font Awesome 6.0.0**: Icon library for UI elements
- **Together AI API**: External AI service for model completions

### Supported Models
- **Vision Model**: Llama-3.2-11B-Vision-Instruct-Turbo (for image analysis)
- **Image Generation Models**:
  - FLUX.1-schnell (Fast generation)
  - FLUX.1-pro (High quality generation)
  - Stable Diffusion XL (Alternative option)

## Deployment Strategy

### Current Setup
- **Type**: Static web application
- **Requirements**: Web server capable of serving static files
- **Browser Compatibility**: Modern browsers with ES6+ support

### Security Considerations
- API key is currently hardcoded (development setup)
- Direct browser-to-API calls expose API key to client
- No backend authentication or rate limiting

### Production Recommendations
- Implement backend proxy for API calls
- Move API key to server-side environment variables
- Add rate limiting and request validation
- Consider HTTPS-only deployment

### File Structure
```
├── index.html          # Main application page
├── style.css           # Styling and visual design
└── script.js           # Application logic and API integration
```

The application is designed for simplicity and ease of use, focusing on providing a straightforward interface for testing Together AI's language models without complex setup requirements.
