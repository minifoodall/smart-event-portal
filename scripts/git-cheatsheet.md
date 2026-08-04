# Git Cheat-Sheet (used in the project demo)

```bash
# Phase 1 — Source Code Management
git init
git add .
git commit -m "feat: scaffold project"
git branch -M main
git remote add origin https://github.com/<your-user>/smart-event-portal.git
git push -u origin main

# Meaningful commit history
git checkout -b feature/dark-mode
# ... edit files ...
git add .
git commit -m "feat(frontend): add dark mode toggle (v2)"

# Release tags
git tag -a v1.0.0 -m "v1 — initial release"
git tag -a v2.0.0 -m "v2 — dark mode"
git tag -a v3.0.0 -m "v3 — event search"
git push origin --tags

# View commit history
git log --oneline --graph --decorate --all
```
