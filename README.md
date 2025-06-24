# Mastra AI Tools Integration Example

## Overview

**Mastra AI Tools Integration Example** demonstrates how to seamlessly integrate third-party developer tools (like Google Send Mail via Arcade.dev) into AI agents using the [Mastra AI]([https://docs.mastra.ai/](https://mastra.ai/)) framework. The project's vision is to make it easy for developers to connect external APIs and services to their AI agents, enabling rapid prototyping and robust automation.

## How It Works

This project uses Mastra AI's agent and tool abstractions to connect to third-party APIs. For example, it integrates Google's Send Mail tool using [Arcade.dev]([https://arcade.dev/](https://www.arcade.dev/)), allowing agents to send emails programmatically. The architecture is modular, so you can add more tools (e.g., GitHub API, Composio integrations) as needed.

## Environment Variables

The following environment variables are required:

| Variable        | Description                                       | How to Obtain                |
|-----------------|---------------------------------------------------|------------------------------|
| `USER_ID`       | Arcade.dev user ID for tool authorization         | From your Arcade.dev account |
|`ARCADE_API_KEY` | Arcade.dev API Key for application authentication | From your Arcade.dev account |

Create a `.env` file in the project root and add:

```env
USER_ID=your_arcade_user_id
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/mastra-ai-tool-examples.git
cd mastra-ai-tool-examples
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add your Arcade.dev `USER_ID`:

```env
USER_ID=your_arcade_user_id
```

### 4. Run the App Locally

```bash
npm run dev
```

## Tool Integration Examples

### Google Send Mail (via Arcade.dev)

The project integrates Google's Send Mail tool using Arcade.dev. See `src/mastra/call/index.ts`:

```typescript
import Arcade from "@arcadeai/arcadejs";

const USER_ID = process.env.USER_ID;

export const sendMail = async ({ toolInput }) => {
  const client = new Arcade();
  const auth = await client.tools.authorize({
    tool_name: "Google.SendEmail@1.2.1",
    user_id: USER_ID,
  });
  // ...authorization and execution logic...
};
```

### Password Reset Tool

The `resetPasswordTool` demonstrates how to wrap a custom API (e.g., a password reset endpoint) as a Mastra tool:

```typescript
export const passwordResetCall = async (email, newPassword) => {
  const url = 'https://brightlife-enhancement.onrender.com/api/admin/reset-password';
  // ...fetch logic...
};
```

## Adding More Integrations

You can add more tools by following the pattern in `src/mastra/tools/index.ts` and using platforms like [Arcade.dev]([https://arcade.dev/](https://www.arcade.dev/)) or [Composio](https://composio.dev/).

## Requirements

- Node.js v20.9.0 or higher

## Available Scripts

- `npm run dev` — Start in development mode

## Documentation

- [Mastra AI Documentation]([https://docs.mastra.ai/](https://mastra.ai/en/docs))
- [Arcade.dev Documentation](https://docs.arcade.dev/)
- [Composio Documentation](https://docs.composio.dev/)
- [Google Send Mail Tool]([https://arcade.dev/tools/google-send-email](https://docs.arcade.dev/toolkits/productivity/google/gmail#googlesendemail))

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

If you'd like to add a new tool integration, improve documentation, or report a bug, open an issue or pull request.

