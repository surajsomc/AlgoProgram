# Remote Claude Code Access

Guide to using Claude Code on your local WSL2 machine from anywhere (phone, tablet, etc.)

> **Environment:** WSL2 on Windows (DESKTOP-1VTFA39)

## Option 1: SSH + Tailscale (Recommended)

The simplest way to get full Claude Code access remotely.

### Step 1: Install and start SSH server in WSL2

WSL2 doesn't come with an SSH server by default. Install it:

```bash
# Install OpenSSH server
sudo apt update && sudo apt install openssh-server -y

# WSL2 doesn't use systemd by default, so start SSH manually
sudo service ssh start

# Verify it's running
sudo service ssh status
```

#### Auto-start SSH on WSL2 boot

WSL2 doesn't auto-start services. Add this to your shell profile so SSH starts when you open WSL:

```bash
# Add to ~/.bashrc or ~/.profile
echo '[ -z "$(pgrep sshd)" ] && sudo service ssh start > /dev/null 2>&1' >> ~/.bashrc
```

To avoid the `sudo` password prompt every time, allow passwordless `service ssh start`:

```bash
# Run this once
sudo sh -c 'echo "%sudo ALL=(ALL) NOPASSWD: /usr/sbin/service ssh *" >> /etc/sudoers.d/ssh-nopasswd'
```

### Step 2: Install Tailscale in WSL2

Tailscale gives your WSL2 instance a stable IP (like `100.x.y.z`) that's reachable from anywhere — no port forwarding needed.

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start the Tailscale daemon (needed in WSL2 since there's no systemd)
sudo tailscaled --tun=userspace-networking &

# Authenticate
sudo tailscale up

# It will print a URL — open it in your browser to log in

# Get your Tailscale IP (this is what you'll connect to)
tailscale ip
```

> Save the IP from `tailscale ip` (e.g., `100.64.x.x`) — this is your connection address.

#### Auto-start Tailscale on WSL2 boot

Add to `~/.bashrc`:

```bash
echo '[ -z "$(pgrep tailscaled)" ] && sudo tailscaled --tun=userspace-networking > /dev/null 2>&1 &' >> ~/.bashrc
```

### Step 3: Install Tailscale on your phone

- Download **Tailscale** from App Store / Play Store
- Sign in with the **same account** you used in WSL2

### Step 4: Connect from your phone

1. Open a mobile SSH app (**Termius**, **JuiceSSH**, etc.)
2. Create a new connection:
   - **Host:** Your Tailscale IP (e.g., `100.64.x.x`)
   - **Port:** `22`
   - **Username:** `surajsomc`
   - **Auth:** Your WSL2 password or SSH key
3. Connect and run Claude Code:
   ```bash
   cd ~/projects/AlgoProgram
   claude
   ```

### Why not just use the Windows IP?

WSL2 runs in a lightweight VM with its own internal IP (`172.x.x.x`) that changes on every reboot. Connecting from outside requires messy Windows port forwarding that breaks frequently. Tailscale bypasses all of this by giving WSL2 a **stable, direct IP** that works from anywhere.

### Alternatives to Tailscale

| Tool              | Pros                        | Cons                              |
| ----------------- | --------------------------- | --------------------------------- |
| Tailscale         | Free, easy, stable IP       | Requires account                  |
| Cloudflare Tunnel | No open ports needed        | More setup                        |
| ngrok             | Quick to set up             | Free tier has limits              |
| Port forwarding   | No third-party dependencies | Breaks on WSL2 reboot, less secure |

---

## Option 2: Chat Bot + Headless Claude Code

Run Claude Code via a messaging app (Telegram, WhatsApp, etc.).

### How It Works

1. A bot on your machine listens for messages
2. It runs Claude Code in headless mode against your local directory
3. It sends the output back to you

### Key Command

```bash
# Run Claude Code non-interactively
claude -p "your prompt here" --output-format text
```

### Example: Telegram Bot (Python)

```python
import subprocess
from telegram import Update
from telegram.ext import Application, MessageHandler, filters, ContextTypes

PROJECT_DIR = "/home/surajsomc/projects/AlgoProgram"

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    prompt = update.message.text
    await update.message.reply_text("Running Claude Code...")

    result = subprocess.run(
        ["claude", "-p", prompt, "--output-format", "text"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True,
        timeout=300
    )

    output = result.stdout or result.stderr or "No output"
    # Telegram has a 4096 char limit per message
    for i in range(0, len(output), 4096):
        await update.message.reply_text(output[i:i+4096])

app = Application.builder().token("YOUR_BOT_TOKEN").build()
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
app.run_polling()
```

### Setup Steps

1. **Create a Telegram bot** — message @BotFather on Telegram, use `/newbot`
2. **Install dependencies**
   ```bash
   pip install python-telegram-bot
   ```
3. **Replace** `YOUR_BOT_TOKEN` with the token from BotFather
4. **Run the bot**
   ```bash
   python bot.py
   ```
5. **Keep it running** — use `tmux`, `screen`, or a systemd service:
   ```bash
   # Using tmux
   tmux new -s claude-bot
   python bot.py
   # Detach with Ctrl+B, then D
   ```

---

## Option 3: VS Code Server (Browser-Based)

Access a full VS Code editor with Claude Code from any browser.

### Setup

1. **Install code-server**
   ```bash
   curl -fsSL https://code-server.dev/install.sh | sh
   ```

2. **Start it**
   ```bash
   code-server --bind-addr 0.0.0.0:8080
   ```

3. **Access remotely**
   - Use Tailscale or a tunnel to reach your machine
   - Open `http://<your-machine-ip>:8080` in a browser
   - Use the integrated terminal to run `claude`

---

## Quick Comparison

| Method         | Setup Time | Phone Friendly | Full Claude Code | Requires Machine On |
| -------------- | ---------- | -------------- | ---------------- | ------------------- |
| SSH + Tailscale | ~5 min     | Yes (SSH app)  | Yes              | Yes                 |
| Telegram Bot   | ~15 min    | Yes (native)   | Headless only    | Yes                 |
| VS Code Server | ~10 min    | Okay (browser) | Yes              | Yes                 |

> **Note:** All options require your home machine to be powered on and connected to the internet.
