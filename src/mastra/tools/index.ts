import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { passwordResetCall, sendMail, searchGoogle } from "../call";

export const resetPasswordTool = createTool({
  id: "resetPasswordTool",
  description: "A tool to reset user passwords securely.",
  inputSchema: z.object({
    email: z.string().email().describe("The user's email address"),
    newPassword: z.string().min(1).describe("The new password for the account"),
  }),
  outputSchema: z.object({
    success: z
      .boolean()
      .describe("Indicates if the password reset was successful"),
    message: z
      .string()
      .describe("Message providing details about the password reset"),
  }),
  execute: async ({ context }) => {
    const { email, newPassword } = context;

    if (!email?.trim() || !newPassword?.trim()) {
      console.error("Validation error: Missing email or newPassword", {
        email,
        newPassword,
      });
      return {
        success: false,
        message: "Please make sure to fill in all required information.",
      };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error("Validation error: Invalid email format", { email });
      return {
        success: false,
        message: "Please provide a valid email address.",
      };
    }

    try {
      const result = await passwordResetCall(email, newPassword);
      if (result.success) {
        return {
          success: true,
          message: `Password reset successful for ${email}.`,
        };
      } else {
        const errorMsg = (result.message || result.error || "").toLowerCase();
        if (errorMsg.includes("admin not found")) {
          console.error("API error: Admin not found", { email, result });
          return {
            success: false,
            message: "No account with this email exists.",
          };
        }
        console.error("API error: Password reset failed", { email, result });
        return {
          success: false,
          message:
            result.message ||
            result.error ||
            "Password reset failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Exception in passwordResetTool:", error, {
        email,
        newPassword,
      });

      return {
        success: false,
        message:
          "We're having some technical difficulties. Please try again in a few moments.",
      };
    }
  },
});

export const sendMailTool = createTool({
  id: "send-mail",
  description: `Sends an email using the ArcadeAI Google.SendEmail tool.`,
  inputSchema: z.object({
    recipient: z.string().describe("Recipient email address"),
    subject: z.string().describe("Email subject"),
    body: z.string().describe("Email body"),
  }),
  outputSchema: z.object({
    status: z.string().describe("Status of the email sending process"),
    details: z.any().optional().describe("Additional details or error info"),
  }),
  execute: async ({ context }) => {
    try {
      await sendMail({
        toolInput: {
          subject: context.subject,
          body: context.body,
          recipient: context.recipient,
        },
      });
      return { status: "Email sent successfully" };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        status: `Failed to send email`,
        details: error?.message || error,
      };
    }
  },
});

export const searchGoogleTool = createTool({
  id: "search-google",
  description: `Searches Google for the specified query and returns results.`,
  inputSchema: z.object({
    query: z.string().describe("The search query to perform on Google"),
    n_results: z
      .number()
      .optional()
      .default(5)
      .describe("Number of results to return"),
  }),
  outputSchema: z.object({
    results: z.array(z.record(z.string(), z.any())), // Flexible: each result can have any shape
    raw: z.any().optional(), // Optionally include the raw response
    type: z.string().optional(), // Optionally include a type for context
  }),
  execute: async ({ context }) => {
    try {
      const result = await searchGoogle({
        toolInput: {
          query: context.query,
          n_results: context.n_results || 5,
        },
      });
      let output = result.output?.[0] || result.output;
      let results: any[] = [];
      // If output.value exists and is a string, try to parse it as JSON
      if (output && typeof output.value === "string") {
        try {
          const parsed = JSON.parse(output.value);
          if (Array.isArray(parsed)) {
            results = parsed;
          } else if (parsed && Array.isArray(parsed.results)) {
            results = parsed.results;
          }
        } catch (e) {
          console.warn("Failed to parse output.value as JSON:", e);
        }
      } else if (output && Array.isArray(output.results)) {
        results = output.results;
      }
      return { results, raw: output };
    } catch (error) {
      console.error("Google search failed:", error);
      return { results: [] };
    }
  },
});
