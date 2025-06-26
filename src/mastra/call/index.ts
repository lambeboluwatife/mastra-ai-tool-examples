import Arcade from "@arcadeai/arcadejs";

const USER_ID = process.env.USER_ID;

export const sendMail = async ({ toolInput }) => {
  const client = new Arcade();

  const auth = await client.tools.authorize({
    tool_name: "Google.SendEmail@1.2.1",
    user_id: USER_ID,
  });

  if (auth?.status !== "completed") {
    console.log(`Click here to authorize the tool: ${auth?.url}`);
  }

  const { status } = await client.auth.waitForCompletion(auth);

  if (status !== "completed") {
    throw new Error("Authorization failed");
  }

  console.log("🚀 Authorization successful!");

  const result = await client.tools.execute({
    tool_name: "Google.SendEmail@1.2.1",
    input: {
      starred: "true",
      subject: toolInput.subject,
      body: toolInput.body,
      recipient: toolInput.recipient,
    },
    user_id: USER_ID,
  });

  return result;
};

export const searchGoogle = async ({ toolInput }) => {
  const client = new Arcade();

  const result = await client.tools.execute({
    tool_name: "Search.SearchGoogle@1.4.0",
    input: {
      owner: "ArcadeAI",
      name: "arcade-ai",
      starred: "true",
      query: toolInput.query,
      n_results: toolInput.n_results || 5,
    },
    user_id: USER_ID,
  });

  return result;
};

export const passwordResetCall = async (email: string, newPassword: string) => {
  const url = 'https://brightlife-enhancement.onrender.com/api/admin/reset-password';
  const body = {
    email,
    newPassword,
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        message: data.message,
      };
    }
    
    return {
      success: false,
      error: data.message || data.error || `Server returned ${response.status}: ${response.statusText}`
    };
  } catch (error) {
    console.error('Error registering user:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url,
    });

    console.log("error:", error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};