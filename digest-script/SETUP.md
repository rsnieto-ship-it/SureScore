# SureScore Intel — Setup Guide

**Time to set up: ~15 minutes**

This guide walks you through getting the SureScore daily digest running on your Mac. By the end, you'll be able to run one command each morning to generate a branded news digest with AI-powered SureScore Takes and email it to your team.

---

## What's in the folder

| File | What it does |
|------|-------------|
| `surescore_digest.py` | The main script — fetches news, generates takes, sends email |
| `.env.example` | Template for your API keys and email settings |
| `requirements.txt` | Python packages the script needs |
| `SETUP.md` | This file |

---

## Step 1: Install Python (if needed)

Open **Terminal** (search for it in Spotlight with Cmd+Space) and check if Python is installed:

```
python3 --version
```

If you see a version number (3.9 or higher), you're good. If not, install it:

```
brew install python3
```

Don't have Homebrew? Install it first:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## Step 2: Install required packages

In Terminal, navigate to the folder containing the script and run:

```
cd /path/to/surescore-digest
pip3 install -r requirements.txt
```

---

## Step 3: Get your Anthropic API key

This is what lets the script use Claude to generate SureScore Takes.

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for an account (or log in)
3. Go to **API Keys** in the left sidebar
4. Click **Create Key**
5. Name it something like "SureScore Digest"
6. Copy the key — it starts with `sk-ant-`

**Cost note:** Each daily digest uses roughly 5 API calls. At current pricing for Claude Sonnet, that's approximately $0.02–0.05 per day. You'll need to add a payment method and add credits to your account ($5 minimum, which will last months).

---

## Step 4: Set up Gmail App Password

Gmail requires an "App Password" for scripts to send email. This is different from your regular password.

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google," make sure **2-Step Verification** is ON
   - If it's not on, turn it on first (Google requires this for App Passwords)
4. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Under "App name," type **SureScore Digest** and click **Create**
6. Google will show you a 16-character password like `abcd efgh ijkl mnop`
7. Copy it — you'll need it in the next step

**Important:** This is the ONLY time Google shows you this password. If you lose it, you'll need to create a new one.

---

## Step 5: Configure your settings

Copy the example environment file:

```
cp .env.example .env
```

Open `.env` in any text editor and fill in your values:

```
export ANTHROPIC_API_KEY="sk-ant-your-actual-key-here"
export GMAIL_ADDRESS="your-email@gmail.com"
export GMAIL_APP_PASSWORD="abcd efgh ijkl mnop"
export DIGEST_RECIPIENTS="you@gmail.com, teammate@gmail.com"
```

**Add all the email addresses** you want to receive the digest, separated by commas.

---

## Step 6: Run it!

In Terminal:

```
cd /path/to/surescore-digest
source .env
python3 surescore_digest.py
```

The script will:
1. Pull recent news from education RSS feeds
2. Filter for relevant college admissions and TSIA stories
3. Generate a SureScore Take for each story using Claude
4. Save an HTML preview file you can open in your browser
5. Ask if you want to send the email

**First time:** Review the preview file before sending. Open the `.html` file it creates in Chrome to see exactly what your team will receive.

---

## Daily Usage

Each morning, just run these two commands:

```
source /path/to/surescore-digest/.env
python3 /path/to/surescore-digest/surescore_digest.py
```

**Pro tip:** Create a shortcut by adding this to your `~/.zshrc` file:

```
alias digest="source ~/surescore-digest/.env && python3 ~/surescore-digest/surescore_digest.py"
```

Then you can just type `digest` in Terminal each morning.

---

## Optional: Automate with a daily schedule

If you want it to run automatically every morning without you doing anything:

1. Open Terminal and type: `crontab -e`
2. Add this line (sends at 7:00 AM every weekday):

```
0 7 * * 1-5 cd /path/to/surescore-digest && source .env && python3 surescore_digest.py --auto
```

**Note:** For fully automated sending, you'll need to edit the script to skip the "Send emails now?" confirmation. Change the `main()` function to call `send_email(stories)` directly instead of prompting.

---

## Customizing

### Add or remove news sources

Open `surescore_digest.py` and edit the `RSS_FEEDS` list. Add any RSS feed URL with a name and category:

```python
{
    "name": "Your Source Name",
    "url": "https://example.com/rss",
    "category": "CATEGORY LABEL"
},
```

### Change the keyword filters

Edit the `KEYWORDS` list in the script. Stories must match at least one keyword to be included. Set `KEYWORDS = []` (empty list) to include everything from your feeds.

### Adjust the number of stories

Change `MAX_STORIES = 5` to however many stories you want per digest.

### Modify the SureScore voice

Edit the `SYSTEM_PROMPT` string in the script. Refer to the Brand Voice Guide document for guidance on refining the prompt over time.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No relevant stories found" | Your keyword filters may be too strict. Try adding more keywords or set `KEYWORDS = []` temporarily. |
| "Authentication failed" for Gmail | Double-check your App Password. Make sure 2-Step Verification is ON. Make sure you're using the App Password, not your regular Gmail password. |
| "Invalid API key" | Check that your ANTHROPIC_API_KEY starts with `sk-ant-` and that you've added credits at console.anthropic.com. |
| Script runs but email looks wrong | Open the saved `.html` preview file in Chrome first. If it looks good in Chrome but bad in Gmail, email me — it's likely a Gmail rendering quirk. |
| "Module not found" errors | Run `pip3 install -r requirements.txt` again. Make sure you're using `python3`, not `python`. |

---

## What's next?

After 3 days of testing, you'll have a clear sense of whether the voice, news selection, and format are right. Then you can:

1. **Refine the voice** — Use the Correction Log method from the Brand Voice Guide
2. **Add the feed to your website** — Hand the prototype and this script to Claude Code
3. **Build the competition features** — Word of the Day, leaderboards, teacher vs student
4. **Go fully automated** — Remove the manual approval step once you trust the output
