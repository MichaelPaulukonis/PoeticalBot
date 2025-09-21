# Tumblr API Configuration

This guide walks you through setting up Tumblr API credentials for the PoeticalBot.

## Overview

The bot uses OAuth 1.0a to authenticate with Tumblr's API. You need four pieces of information:

- `CONSUMER_KEY` - Your app's consumer key
- `CONSUMER_SECRET` - Your app's consumer secret  
- `TOKEN` - OAuth access token for your Tumblr account
- `TOKEN_SECRET` - OAuth access token secret

## Step 1: Get Consumer Key & Secret

If you don't already have a Tumblr app registered:

1. Go to [Tumblr OAuth Apps](https://www.tumblr.com/oauth/apps)
2. Click "Register application"
3. Fill out the form:
   - **Application Name**: PoeticalBot (or your preferred name)
   - **Application Website**: Your blog URL or GitHub repo
   - **Application Description**: Poetry generation bot
   - **Default callback URL**: `http://localhost` (not used for this bot)
4. Save the `OAuth Consumer Key` and `OAuth Consumer Secret`

## Step 2: Get Access Tokens

### Method 1: Tumblr API Console (Recommended)

This is the easiest way to get tokens for your own account:

1. Go to [Tumblr API Console](https://api.tumblr.com/console)
2. Click "Explore API" 
3. Sign in with your Tumblr account (the one you want the bot to post to)
4. Click on any API endpoint (e.g., "Get Blog Info")
5. In the request details, look for the OAuth headers:
   - `oauth_token` → This is your `TOKEN`
   - `oauth_token_secret` → This is your `TOKEN_SECRET`
6. Copy these values

### Method 2: Manual OAuth Flow

For more control or if the console method doesn't work:

1. Go to your app at [Tumblr OAuth Apps](https://www.tumblr.com/oauth/apps)
2. Click "Explore API" next to your app
3. This will walk you through the OAuth flow
4. Save the resulting tokens

## Step 3: Configure Environment Variables

Create or update your `.env` file in the project root:

```env
CONSUMER_KEY=your_consumer_key_here
CONSUMER_SECRET=your_consumer_secret_here
TOKEN=your_oauth_token_here
TOKEN_SECRET=your_oauth_token_secret_here
POST_LIVE=false
```

**Important**: Keep `POST_LIVE=false` until you're ready to post live to Tumblr!

## Step 4: Test Your Configuration

### Local Testing

```bash
# Test the Lambda version locally
cd lambda
npm run test:manual
```

### Verify Connection

The test should output something like:
```
✅ Success!
Result: { statusCode: 200, body: 'Poem generated (test mode)' }
```

If you see errors about authentication, double-check your tokens.

## Step 5: Deploy to AWS

Update your Terraform variables with the tokens:

```bash
cd terraform
terraform apply \
  -var="consumer_key=your_consumer_key" \
  -var="consumer_secret=your_consumer_secret" \
  -var="token=your_oauth_token" \
  -var="token_secret=your_oauth_token_secret" \
  -var="post_live=false"
```

Or create a `terraform.tfvars` file:

```hcl
consumer_key    = "your_consumer_key"
consumer_secret = "your_consumer_secret"
token          = "your_oauth_token"
token_secret   = "your_oauth_token_secret"
post_live      = "false"
```

## Going Live

Once everything is tested and working:

1. **Local**: Change `POST_LIVE=true` in your `.env` file
2. **AWS**: Update the Terraform variable: `-var="post_live=true"`

## Troubleshooting

### "Unauthorized" Errors
- Double-check all four credentials are correct
- Ensure the tokens are for the correct Tumblr account
- Verify your app has the right permissions

### "Not Found" Errors  
- Check that your blog name in the code matches your actual Tumblr blog
- The bot is configured for `poeticalbot.tumblr.com` - update if needed

### Token Expiration
- Tumblr OAuth tokens don't expire, but can be revoked
- If tokens stop working, regenerate them using the API Console

## Security Notes

- Never commit your `.env` file to version control
- Keep your tokens secure - they allow posting to your Tumblr account
- Use `POST_LIVE=false` for all testing to avoid accidental posts
- Consider using different Tumblr accounts for testing vs production

## Helper Script

You can also run the included helper script:

```bash
node scripts/get-tumblr-tokens.js
```

This will guide you through the process and open the API Console in your browser.