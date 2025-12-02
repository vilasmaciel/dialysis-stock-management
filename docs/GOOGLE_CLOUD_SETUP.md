# Google Cloud Console Setup for Gmail API

This guide walks you through setting up Google Cloud Console to enable Gmail API for sending order emails from the DialyStock application.

## Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Project deployed or running locally

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" dropdown in the top navigation
3. Click "New Project"
4. Enter project details:
   - **Project name**: `DialyStock` (or your preferred name)
   - **Organization**: (Optional) Select if applicable
5. Click "Create"
6. Wait for project creation (usually takes a few seconds)
7. Select the newly created project from the dropdown

## Step 2: Enable Gmail API

1. In the left sidebar, navigate to **APIs & Services** → **Library**
2. In the search box, type `Gmail API`
3. Click on **Gmail API** in the results
4. Click the **Enable** button
5. Wait for the API to be enabled (usually instant)

You should see a confirmation message and the API dashboard.

## Step 3: Configure OAuth Consent Screen

The OAuth consent screen is what users see when they grant permissions to your app.

1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Choose user type:
   - Select **External** (unless you have Google Workspace)
   - This allows any Google account to use your app
3. Click **Create**

### App Information

Fill in the required fields:

- **App name**: `DialyStock` (or your app name)
- **User support email**: Select your email from the dropdown
- **App logo**: (Optional) Upload your app logo (recommended: 120x120px)
- **Application home page**: (Optional) Your app's homepage URL
- **Application privacy policy link**: (Optional) Your privacy policy URL
- **Application terms of service**: (Optional) Your terms of service URL
- **Authorized domains**:
  - Add your production domain if deployed (e.g., `yourdomain.com`)
  - Leave blank for local development
- **Developer contact information**: Enter your email address

Click **Save and Continue**

### Scopes

Define what permissions your app needs:

1. Click **Add or Remove Scopes**
2. In the filter box, type `gmail.send`
3. Select the checkbox for:
   ```
   https://www.googleapis.com/auth/gmail.send
   ```
   - Description: "Send email on your behalf"
4. Click **Update**
5. Verify only this scope is selected
6. Click **Save and Continue**

### Test Users (Development Phase)

While your app is in "Testing" mode, only specified test users can access it:

1. Click **Add Users**
2. Enter email addresses of users who will test the app:
   ```
   your-email@gmail.com
   another-tester@gmail.com
   ```
3. Click **Add**
4. Click **Save and Continue**

### Summary

Review your configuration and click **Back to Dashboard**

## Step 4: Create OAuth 2.0 Client ID

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** at the top
3. Select **OAuth client ID**
4. Choose application type:
   - Select **Web application**
5. Configure the client:

### Name

```
DialyStock Web Client
```

### Authorized JavaScript origins

Add the URLs where your app will run (one per line):

```
http://localhost:5173
http://localhost:3000
https://yourdomain.com
```

**Important**:
- Include both `http://localhost` with your dev port
- Include your production domain (with `https://`)
- Do NOT include trailing slashes
- Match the exact protocol and port

### Authorized redirect URIs

Add the same URLs as above (one per line):

```
http://localhost:5173
http://localhost:3000
https://yourdomain.com
```

6. Click **Create**

### Save Your Credentials

A dialog will appear with your credentials:

- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client Secret**: `xxxxx` (you won't need this for frontend-only apps)

**IMPORTANT**:
- Copy the **Client ID** immediately
- You can always retrieve it later from the Credentials page
- Click **OK** to close the dialog

## Step 5: Configure Environment Variables

### For Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
   ```

3. **IMPORTANT**: Never commit `.env` to version control

### For Production Deployment

Add the environment variable to your hosting provider:

**Cloudflare Pages / Vercel / Netlify**:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add:
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Client ID

## Step 6: Test the Integration

### Start Development Server

```bash
npm run dev
```

### Test OAuth Flow

1. Navigate to `http://localhost:5173`
2. Go to **Configuración** (Settings)
3. Fill in your profile information:
   - Nombre completo
   - Teléfono
   - Dirección
4. Click **Guardar configuración**
5. Go to **Pedidos** → **Nuevo Pedido**
6. Select materials and click **Continuar**
7. Click **Enviar Email**

### Expected Behavior

You should see:

1. **Gmail Permission Dialog** with:
   - Clear explanation of permissions
   - "Conectar Gmail" button
2. Click **Conectar Gmail**
3. **Google OAuth Screen** appears:
   - Shows app name and developer info
   - Lists permissions requested
   - "Continue" or "Allow" button
4. After granting permissions:
   - Redirected back to your app
   - **Order Preview Dialog** appears
   - You can edit the message
   - Click **Enviar Email**
5. Email should be sent successfully!

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"

**Cause**: Redirect URIs don't match

**Solution**:
1. Go to **Credentials** → Edit your OAuth client
2. Verify **Authorized JavaScript origins** exactly matches your dev server URL
3. Check for:
   - Correct protocol (`http` vs `https`)
   - Correct port (`:5173`, `:3000`, etc.)
   - No trailing slashes
   - No extra paths

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI in the request doesn't match Google Cloud config

**Solution**:
- Add the exact URI (including port) to **Authorized redirect URIs**
- Clear browser cache
- Try incognito mode

### Error: "Insufficient Permission" or "Unauthorized"

**Cause**: Gmail API scope not granted or incorrect

**Solution**:
1. Go to **OAuth consent screen**
2. Verify `gmail.send` scope is added
3. Revoke app permissions: https://myaccount.google.com/permissions
4. Try connecting again

### Error: "This app isn't verified"

**Cause**: Your app is still in "Testing" mode

**Solutions**:
- **For testing**: Add your email as a test user in OAuth consent screen
- **For production**: Submit your app for verification (required for public use)

### Daily Quota Exceeded

**Cause**: Gmail API has sending limits

**Default limits**:
- **Testing mode**: Lower limits (varies)
- **Production mode**: 100-500 emails/day for free tier

**App limit**:
- We've implemented a 5 emails/day limit for safety

**Solutions**:
- Wait 24 hours for quota reset
- Request quota increase in Google Cloud Console
- Use "Descargar Excel" as fallback

### Tokens Expired

**Cause**: Access tokens expire after 1 hour

**Solution**:
- The app should automatically refresh tokens
- If not working, reconnect Gmail permissions
- Check browser console for errors

## Security Best Practices

### DO:
- ✅ Keep your `.env` file out of version control
- ✅ Only request the minimum scope needed (`gmail.send`)
- ✅ Use `https://` in production
- ✅ Regularly review authorized apps in your Google account
- ✅ Monitor API usage in Google Cloud Console
- ✅ Set up usage alerts to detect unusual activity

### DON'T:
- ❌ Share your Client Secret publicly
- ❌ Commit credentials to Git
- ❌ Request unnecessary scopes
- ❌ Skip the OAuth consent screen
- ❌ Use the same credentials for different apps

## Production Checklist

Before deploying to production:

- [ ] OAuth consent screen configured with accurate information
- [ ] App logo uploaded
- [ ] Privacy policy and terms of service links added (if required)
- [ ] Production domain added to **Authorized domains**
- [ ] Production URLs added to **Authorized JavaScript origins**
- [ ] Production URLs added to **Authorized redirect URIs**
- [ ] Environment variable `VITE_GOOGLE_CLIENT_ID` set in hosting provider
- [ ] Tested with multiple user accounts
- [ ] Verified email sending works
- [ ] Verified error handling and fallback work
- [ ] Consider submitting app for Google verification (if public)
- [ ] Set up monitoring and usage alerts

## Monitoring and Quotas

### Check API Usage

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Dashboard**
3. Click on **Gmail API**
4. View usage metrics:
   - Requests per day
   - Quota usage
   - Errors

### Request Quota Increase

If you need more than the default quota:

1. Navigate to **APIs & Services** → **Quotas**
2. Search for "Gmail API"
3. Select the quota you want to increase
4. Click **Edit Quotas**
5. Fill out the request form with justification
6. Submit for review (usually takes 2-3 business days)

## Verification Process (Optional)

To make your app publicly available without the "unverified app" warning:

1. Navigate to **OAuth consent screen**
2. Click **Publish App**
3. Click **Prepare for Verification**
4. Submit your app following Google's instructions
5. Process takes 1-6 weeks
6. Required documents:
   - Official homepage
   - Privacy policy
   - Demo video
   - Justification for scopes

## Additional Resources

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 for Client-side Web Apps](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
- [Gmail API Send Message Reference](https://developers.google.com/gmail/api/reference/rest/v1/users.messages/send)
- [OAuth Consent Screen Help](https://support.google.com/cloud/answer/10311615)

## Support

If you encounter issues not covered in this guide:

1. Check the [Gmail API troubleshooting guide](https://developers.google.com/gmail/api/troubleshooting)
2. Review the browser console for detailed error messages
3. Check Google Cloud Console audit logs
4. Contact your system administrator

---

**Last Updated**: January 2025
