# Jenkins Credentials Setup

In Jenkins → Manage Jenkins → Credentials, create the following **Store scoped to "Jenkins"** (or to your folder):

| ID                     | Kind              | Notes                                                                 |
|------------------------|-------------------|-----------------------------------------------------------------------|
| `dockerhub-creds`      | Username/Password | Docker Hub account — must have permission to push to `gunjkushwaha/*`       |
| `kubeconfig-creds`     | Secret file       | A kubeconfig whose current context points at the demo cluster         |
| `slack-webhook`        | Secret text       | Incoming-webhook URL for the team channel (optional)                  |
| `github-token`         | Secret text       | Personal access token with `repo` scope for GitHub webhooks (Phase 1) |

After creating the credentials, update the credential **IDs in `Jenkinsfile`** if you use different names.
