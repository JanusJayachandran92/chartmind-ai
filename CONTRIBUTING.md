# 🤝 Contributing to ChartMind AI

Thank you for your interest in contributing! This guide will walk you through everything you need to get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Reporting Issues](#reporting-issues)

---

## 📜 Code of Conduct

By participating in this project, you agree to be respectful and constructive in all interactions.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **Python** >= 3.11
- **Git**

### Fork & Clone

```bash
# 1. Fork the repo on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/chartmind-ai.git
cd chartmind-ai

# 3. Add upstream remote
git remote add upstream https://github.com/JanusJayachandran92/chartmind-ai.git
```

### Set Up Backend

```bash
cd backend
cp .env.example .env         # Fill in your API keys
pip install -r requirements.txt
python main.py
```

### Set Up Frontend

```bash
cd frontend
cp .env.example .env.local   # Fill in your config
npm install
npm run dev
```

---

## 🔄 Development Workflow

1. **Sync with upstream** before starting any work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or for bug fixes:
   git checkout -b fix/issue-description
   ```

3. **Make your changes** — keep them focused and atomic.

4. **Test your changes** thoroughly before pushing.

5. **Push and open a PR**:
   ```bash
   git push origin feat/your-feature-name
   ```

---

## 📝 Pull Request Guidelines

- **One PR per feature/fix** — keep PRs small and focused
- **Fill out the PR template** completely
- **Link related issues** using `Closes #123` in your PR description
- **Ensure all checks pass** before requesting review
- **Respond to review comments** promptly
- **Do not force-push** after a review has started

### PR Title Format

```
feat: add bar chart support
fix: resolve streaming disconnect issue
docs: update README setup steps
refactor: extract chart config logic
```

---

## ✍️ Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructure, no behavior change |
| `test:` | Adding or updating tests |
| `chore:` | Build scripts, dependencies |

---

## 🐛 Reporting Issues

Before opening an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue templates** provided
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Python/Node version)
   - Relevant logs or screenshots

---

## 💡 Ideas & Discussions

For feature ideas or broader discussions, please use [GitHub Discussions](../../discussions) instead of issues.

---

Thank you for helping make ChartMind AI better! 🎉
