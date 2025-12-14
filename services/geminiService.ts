import { GoogleGenAI } from "@google/genai";
import { Alert, Customer, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const generateInvestigationReport = async (
  alert: Alert,
  customer: Customer,
  transactions: Transaction[]
): Promise<string> => {
  try {
    const prompt = `
      Act as a Senior AML Investigator at a major bank. 
      Generate a concise, professional "Suspicious Activity Report (SAR)" narrative based on the following data.
      
      Alert Context:
      - Rule Triggered: ${alert.ruleName}
      - Severity: ${alert.severity}
      - Date: ${alert.triggerDate}

      Customer Profile:
      - Name: ${customer.name}
      - Risk Rating: ${customer.riskLevel}
      - Occupation/Type: ${customer.occupation} (${customer.type})
      - Domicile: ${customer.country}

      Suspicious Transactions:
      ${transactions.map(t => `- ${t.date}: $${t.amount} ${t.currency} via ${t.type} to/from ${t.merchantOrCounterparty} (${t.counterpartyCountry})`).join('\n')}

      Instructions:
      1. Summarize the suspicious activity.
      2. Explain why this fits the typology of ${alert.ruleName} (e.g., structuring, smurfing, velocity).
      3. Recommend a conclusion (File SAR or Further Investigation).
      4. Keep it formal and regulatory-ready.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Unable to generate report.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI report. Please check API configuration.";
  }
};

export const screenNameAgainstAI = async (name: string): Promise<string> => {
  try {
    const prompt = `
      Simulate a sanctions screening check for the name: "${name}".
      
      Check against simulated OFAC (SDN), UN, and EU sanctions lists.
      
      Return a JSON object (and nothing else) with this schema:
      {
        "isMatch": boolean,
        "source": string (e.g. "OFAC", "None"),
        "confidence": number (0-100),
        "details": "Short description of the simulated match or non-match"
      }
      
      Make up a realistic response. If the name sounds like a generic known terrorist or sanctioned entity (e.g. "Osama", "Putin", "Cartel"), flag it. Otherwise, assume clean.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return response.text || "{}";
  } catch (error) {
    return JSON.stringify({ isMatch: false, details: "Service unavailable" });
  }
};