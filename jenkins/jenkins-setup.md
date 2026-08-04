# Jenkins Setup Walkthrough

> This walks through Phase 4 of the project rubric: Jenkins installation, plugin install, GitHub integration, credentials, and a working Pipeline job.

## 1. Install Jenkins

Easiest path is Docker:

```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts-jdk17
```

Browse to <http://localhost:8080> and unlock with the initial admin password from the container logs.

## 2. Install Plugins

Manage Jenkins → Plugins → Available plugins → install:

- Git
- Docker Pipeline
- Pipeline
- Blue Ocean
- Kubernetes CLI
- Credentials
- Timestamper
- AnsiColor
- Slack Notification (optional)

## 3. Connect Jenkins to GitHub

- **Option A (recommended):** In the Pipeline job, choose "Git" and provide your repository URL + credential.
- **Option B:** Manage Jenkins → Systems → GitHub → Add GitHub Server → Credentials: add `github-token`.

## 4. Add Credentials

See `jenkins-credentials.md` for the IDs and kinds to create.

## 5. Create Pipeline

New Item → Pipeline → Definition: *Pipeline script from SCM* → SCM: Git → Repository: your repo → Script Path: `jenkins/Jenkinsfile`.

Enable *GitHub hook trigger for GITScm polling* if you want Phase 4 Task 7 (auto-build on push).

## 6. Build Triggers

The repo includes `.github/workflows/ci-notify.yml` which calls the Jenkins `generic-webhook-trigger` (or pings the `build` endpoint). This satisfies the GitHub Actions webhooks + Jenkins trigger innovation.
