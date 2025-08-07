# Hugging Face API Setup (FREE - 30k calls/month)

## Step 1: Get Your Free API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Click "Sign Up" (or "Sign In" if you have an account)
3. Create a free account with your email
4. Once logged in, go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
5. Click "New token"
6. Give it a name like "Resume Builder"
7. Select "Read" permission (sufficient for our use)
8. Click "Generate a token"
9. Copy the token (starts with `hf_...`)

## Step 2: Add API Key to Your Project

1. Open the `.env` file in your project root
2. Replace `your_huggingface_api_key_here` with your actual token:
   ```
   REACT_APP_HUGGINGFACE_API_KEY=hf_your_actual_token_here
   ```
3. Save the file
4. Restart your development server (`npm start`)

## Step 3: Test the Integration

1. Go to your resume builder
2. Try generating a summary or description
3. Try the grammar check feature
4. You should see "Using Hugging Face for AI generation" in the browser console

## Benefits of Hugging Face

- ✅ **FREE**: 30,000 API calls per month
- ✅ **No Credit Card Required**: Completely free tier
- ✅ **Lifetime Free**: No expiration on free tier
- ✅ **Good Quality**: Decent AI models for text generation
- ✅ **Privacy Friendly**: No data retention policies

## Troubleshooting

If you see errors:
1. Make sure your API key starts with `hf_`
2. Ensure there are no spaces in the `.env` file
3. Restart the development server after adding the key
4. Check browser console for detailed error messages

## Alternative Free Services

If Hugging Face doesn't work, you can also try:
- **Cohere API**: Generous free tier
- **Google Cloud NLP**: Free tier available
- **LocalAI/Ollama**: Run models locally (no API needed)
