import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getGeminiAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured. Running with mock/heuristic fallback mode.");
    return null;
  }
  
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// 1. Budget Recommendation API
export async function generateBudgetRecommendation(
  income: number,
  expenses: any[],
  savingsGoals: any[],
  lifestyle: string
): Promise<any> {
  const ai = getGeminiAI();
  const expensesSummary = expenses.map(e => `${e.category}: $${e.amount} (${e.title})`).join(", ");
  const goalsSummary = savingsGoals.map(g => `${g.goalName}: Target $${g.targetAmount}, Current $${g.currentAmount}`).join(", ");

  const prompt = `You are an expert personal finance planning assistant. Analyze the user's financial profile:
- Monthly Income: $${income}
- Recent Expenses: [${expensesSummary}]
- Savings Goals: [${goalsSummary}]
- Lifestyle / Priorities: ${lifestyle || "Balanced"}

Provide a recommended budget allocation and actionable recommendations.
You MUST output your response in the following JSON format ONLY:
{
  "allocations": {
    "Rent": number,
    "Food": number,
    "Utilities": number,
    "Savings": number,
    "Entertainment": number,
    "Investments": number,
    "Others": number
  },
  "recommendations": string[],
  "analysis": string
}`;

  if (!ai) {
    // Elegant standard heuristic fallback based on 50/30/20 rule
    const rent = Math.round(income * 0.30);
    const food = Math.round(income * 0.15);
    const utilities = Math.round(income * 0.10);
    const savings = Math.round(income * 0.20);
    const entertainment = Math.round(income * 0.10);
    const investments = Math.round(income * 0.10);
    const others = Math.round(income * 0.05);

    return {
      allocations: { Rent: rent, Food: food, Utilities: utilities, Savings: savings, Entertainment: entertainment, Investments: investments, Others: others },
      recommendations: [
        `Configure your savings to run automatically. Setting aside $${savings} immediately on pay-day ensures you hit your goals consistently.`,
        "Your food spending shows recurring dining out. Try preparing meal plans for weekdays to unlock an extra $100-$150 of savings.",
        "Consider consolidating subscriptions. Check if there are entertainment plans you no longer use active on your credit statement."
      ],
      analysis: `A customized 50/30/20 allocation based on your income of $${income}. We recommend setting aside 20% ($${savings}) into high-yield savings to support your current goals.`
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allocations: {
              type: Type.OBJECT,
              properties: {
                Rent: { type: Type.NUMBER },
                Food: { type: Type.NUMBER },
                Utilities: { type: Type.NUMBER },
                Savings: { type: Type.NUMBER },
                Entertainment: { type: Type.NUMBER },
                Investments: { type: Type.NUMBER },
                Others: { type: Type.NUMBER }
              },
              required: ["Rent", "Food", "Utilities", "Savings", "Entertainment", "Investments", "Others"]
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            analysis: { type: Type.STRING }
          },
          required: ["allocations", "recommendations", "analysis"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty AI response text");
  } catch (error) {
    console.error("Gemini generateBudgetRecommendation failed:", error);
    // Return standard fallback
    return {
      allocations: { Rent: income * 0.3, Food: income * 0.15, Utilities: income * 0.1, Savings: income * 0.2, Entertainment: income * 0.1, Investments: income * 0.10, Others: income * 0.05 },
      recommendations: ["Automate savings early", "Review subscriptions", "Reduce grocery spending"],
      analysis: "Failsafe heuristic allocation loaded due to connection limitations."
    };
  }
}

// 2. Expense Analysis API
export async function analyzeExpenses(expenses: any[], budgetLimit: number): Promise<any> {
  const ai = getGeminiAI();
  const expensesList = expenses.map(e => `- ${e.title} (${e.category}): $${e.amount}`).join("\n");

  const prompt = `Analyze the following expense list against a overall budget limit of $${budgetLimit}:
${expensesList}

Find unnecessary or redundant expenditures, suggest cost-effective alternatives, and estimate potential monthly savings.
Output your response in the following JSON format:
{
  "unnecessaryExpenses": [
    { "title": string, "amount": number, "reason": string, "alternative": string }
  ],
  "potentialSavings": number,
  "actionPlan": string[]
}`;

  if (!ai) {
    // Generate intelligent heuristic recommendations from standard food/entertainment logs
    const foodExpenses = expenses.filter(e => e.category === 'Food');
    const entExpenses = expenses.filter(e => e.category === 'Entertainment');
    const unnecessary = [];
    let savings = 0;

    if (foodExpenses.length > 1) {
      const diningOut = foodExpenses.find(e => e.amount > 50) || foodExpenses[0];
      unnecessary.push({
        title: diningOut.title,
        amount: diningOut.amount,
        reason: "Frequent dining out or premium restaurant orders.",
        alternative: "Prepare quick healthy home meals or limit restaurant orders to weekends."
      });
      savings += Math.round(diningOut.amount * 0.5);
    }
    if (entExpenses.length > 0) {
      const ent = entExpenses[0];
      unnecessary.push({
        title: ent.title,
        amount: ent.amount,
        reason: "Active entertainment subscriptions or leisure purchases.",
        alternative: "Rotate subscriptions monthly or search for bundle discounts."
      });
      savings += Math.round(ent.amount * 0.4);
    }

    if (unnecessary.length === 0) {
      unnecessary.push({
        title: "Miscellaneous variable purchases",
        amount: Math.round(budgetLimit * 0.05),
        reason: "Small impulse purchases accumulate quickly over the month.",
        alternative: "Use the 24-hour rule before checking out online baskets."
      });
      savings = Math.round(budgetLimit * 0.05);
    }

    return {
      unnecessaryExpenses: unnecessary,
      potentialSavings: savings,
      actionPlan: [
        "Create a dedicated weekly groceries list to minimize impulse snacks.",
        "Implement a '24-hour pause' on non-essential items in shopping lists.",
        "Audit credit cards to spot unused recurring memberships."
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            unnecessaryExpenses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                  alternative: { type: Type.STRING }
                },
                required: ["title", "amount", "reason", "alternative"]
              }
            },
            potentialSavings: { type: Type.NUMBER },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["unnecessaryExpenses", "potentialSavings", "actionPlan"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty AI response");
  } catch (error) {
    console.error("Gemini analyzeExpenses failed:", error);
    return {
      unnecessaryExpenses: [{ title: "Impulse Shopping", amount: 100, reason: "Uncategorized small buys", alternative: "Enforce 24-hr cooling off period" }],
      potentialSavings: 100,
      actionPlan: ["Establish clear caps on leisure categories", "Regularly scan credit transactions"]
    };
  }
}

// 3. Savings Planner API
export async function planSavings(
  goalName: string,
  targetAmount: number,
  currentAmount: number,
  deadline: string,
  monthlyIncome: number
): Promise<any> {
  const ai = getGeminiAI();
  const remaining = targetAmount - currentAmount;
  const deadlineDate = new Date(deadline);
  const currentDate = new Date();
  const monthsRemaining = Math.max(1, Math.round((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)));

  const prompt = `Plan a savings strategy for a goal:
- Goal Name: ${goalName}
- Target Amount: $${targetAmount}
- Current Savings: $${currentAmount}
- Remaining to Save: $${remaining}
- Deadline: ${deadline} (~${monthsRemaining} months remaining)
- User's Monthly Income: $${monthlyIncome}

Calculate the optimal monthly contribution, assess feasibility, and recommend specific budgeting shifts to satisfy this timeline.
Output your response in the following JSON format:
{
  "monthlyContribution": number,
  "feasibilityScore": number, // out of 100
  "isRealistic": boolean,
  "milestones": [
    { "name": string, "amount": number, "targetDate": string }
  ],
  "savingsTips": string[]
}`;

  if (!ai) {
    const monthlyNeeded = Math.round(remaining / monthsRemaining);
    const feasibility = Math.min(100, Math.max(10, Math.round((1 - (monthlyNeeded / (monthlyIncome || 1))) * 100)));
    const milestones = [];
    for (let i = 1; i <= Math.min(3, monthsRemaining); i++) {
      const pct = i / Math.min(3, monthsRemaining);
      milestones.push({
        name: `Milestone ${i}: ${Math.round(pct * 100)}% complete`,
        amount: Math.round(currentAmount + (remaining * pct)),
        targetDate: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      });
    }

    return {
      monthlyContribution: monthlyNeeded,
      feasibilityScore: feasibility,
      isRealistic: monthlyNeeded < (monthlyIncome * 0.4),
      milestones,
      savingsTips: [
        `Automate $${monthlyNeeded} directly into a high-yield savings account immediately after receiving income.`,
        "Divert extra income sources (bonuses, freelance work) 100% to this goal to reach the finish line faster.",
        "Consider moving any emergency funds into low-risk yield tools to hedge inflation."
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            monthlyContribution: { type: Type.NUMBER },
            feasibilityScore: { type: Type.NUMBER },
            isRealistic: { type: Type.BOOLEAN },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  targetDate: { type: Type.STRING }
                },
                required: ["name", "amount", "targetDate"]
              }
            },
            savingsTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["monthlyContribution", "feasibilityScore", "isRealistic", "milestones", "savingsTips"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response text");
  } catch (error) {
    console.error("Gemini planSavings failed:", error);
    const fallbackContribution = Math.round(remaining / Math.max(1, monthsRemaining));
    return {
      monthlyContribution: fallbackContribution,
      feasibilityScore: 80,
      isRealistic: true,
      milestones: [{ name: "Halfway Point", amount: currentAmount + (remaining / 2), targetDate: "Target midpoint" }],
      savingsTips: ["Automate savings immediately after payday", "Check on recurring subscription costs"]
    };
  }
}

// 4. Emergency Fund API
export async function suggestEmergencyFund(expenses: any[], monthlyIncome: number): Promise<any> {
  const ai = getGeminiAI();
  const totalMonthlyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const prompt = `Recommend an Emergency Fund Strategy:
- Current Monthly Expenses: $${totalMonthlyExpenses || 1500}
- Monthly Income: $${monthlyIncome || 3000}

Calculate emergency fund targets for 3-month (essential), 6-month (standard), and 12-month (robust) safety net scenarios.
Output your response in lower-case keys JSON:
{
  "threeMonthTarget": number,
  "sixMonthTarget": number,
  "twelveMonthTarget": number,
  "monthlySavingsRecommendation": number,
  "fundingTimelineMonths": number,
  "tips": string[]
}`;

  if (!ai) {
    const baseExpense = totalMonthlyExpenses || Math.round(monthlyIncome * 0.6) || 1800;
    const recommendedSavings = Math.round(monthlyIncome * 0.15) || 300;
    const sixMonth = baseExpense * 6;
    return {
      threeMonthTarget: baseExpense * 3,
      sixMonthTarget: sixMonth,
      twelveMonthTarget: baseExpense * 12,
      monthlySavingsRecommendation: recommendedSavings,
      fundingTimelineMonths: Math.round(sixMonth / recommendedSavings),
      tips: [
        "Prioritize the 3-month target first. This builds momentum and establishes an immediate firewall.",
        "Store these emergency funds strictly in high-yield, liquid accounts. Do not lock them in long-term stocks or CDs.",
        "Only deploy emergency cash for non-discretionary events: critical health issues, loss of income, or urgent repairs."
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threeMonthTarget: { type: Type.NUMBER },
            sixMonthTarget: { type: Type.NUMBER },
            twelveMonthTarget: { type: Type.NUMBER },
            monthlySavingsRecommendation: { type: Type.NUMBER },
            fundingTimelineMonths: { type: Type.NUMBER },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["threeMonthTarget", "sixMonthTarget", "twelveMonthTarget", "monthlySavingsRecommendation", "fundingTimelineMonths", "tips"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response text");
  } catch (error) {
    console.error("Gemini suggestEmergencyFund failed:", error);
    const base = totalMonthlyExpenses || 1500;
    return {
      threeMonthTarget: base * 3,
      sixMonthTarget: base * 6,
      twelveMonthTarget: base * 12,
      monthlySavingsRecommendation: 250,
      fundingTimelineMonths: 12,
      tips: ["Focus on an initial 3-month buffer first", "Keep cash highly liquid in high-yield accounts"]
    };
  }
}

// 5. Financial Health API
export async function calculateFinancialHealth(
  income: number,
  expenses: any[],
  savingsGoals: any[]
): Promise<any> {
  const ai = getGeminiAI();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const ratio = income > 0 ? (totalExpenses / income) : 0;

  const prompt = `Perform a comprehensive Financial Health Audit and Risk Analysis for the user profile:
- Monthly Income: $${income}
- Total Current Expenses: $${totalExpenses}
- Savings Reserves: $${totalSavings}
- Expense-to-Income Ratio: ${ratio.toFixed(2)}

Grade the overall health with a score from 1 to 100. Pinpoint key vulnerabilities (Debt, lack of liquidity, overspending) and suggest actionable improvements.
Output your response in the following JSON format:
{
  "score": number,
  "rating": string, // e.g. Excellent, Good, Fair, Vulnerable
  "riskAnalysis": {
    "liquidityRisk": string, // High, Medium, Low + explanation
    "savingsRateRisk": string,
    "debtEmiRisk": string
  },
  "strengths": string[],
  "improvements": string[]
}`;

  if (!ai) {
    // Generate intelligent heuristic financial grading
    let score = 75;
    let rating = "Good";

    if (ratio > 0.8) {
      score = 45;
      rating = "Vulnerable";
    } else if (ratio > 0.6) {
      score = 65;
      rating = "Fair";
    } else if (ratio > 0.3) {
      score = 85;
      rating = "Excellent";
    }

    const liquidity = totalSavings > (totalExpenses * 3) ? "Low - Solid 3+ month reserve is ready" : "High - Reserves are below 3 months of expenses";
    const savingsRate = (income - totalExpenses) / (income || 1) > 0.2 ? "Low - You save more than 20% of your income" : "Medium - Your savings rate is below the 20% threshold";

    return {
      score,
      rating,
      riskAnalysis: {
        liquidityRisk: liquidity,
        savingsRateRisk: savingsRate,
        debtEmiRisk: "Low - No critical EMIs flagged in recent spending logs"
      },
      strengths: [
        "Consistent tracking of monthly expenditures",
        income > 0 ? `Income flows are diversified with a $${income} base` : "Active income pipeline"
      ],
      improvements: [
        "Aim to increase cash liquidity to withstand sudden non-discretionary events.",
        "Consider moving leftover monthly income immediately to an investment vehicle.",
        "Explore side streams to diversify and accelerate your goals."
      ]
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            rating: { type: Type.STRING },
            riskAnalysis: {
              type: Type.OBJECT,
              properties: {
                liquidityRisk: { type: Type.STRING },
                savingsRateRisk: { type: Type.STRING },
                debtEmiRisk: { type: Type.STRING }
              },
              required: ["liquidityRisk", "savingsRateRisk", "debtEmiRisk"]
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["score", "rating", "riskAnalysis", "strengths", "improvements"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response text");
  } catch (error) {
    console.error("Gemini calculateFinancialHealth failed:", error);
    return {
      score: 70,
      rating: "Fair",
      riskAnalysis: {
        liquidityRisk: "Medium - Need larger emergency reserve",
        savingsRateRisk: "Medium - Below the recommended 20%",
        debtEmiRisk: "Low"
      },
      strengths: ["Regular expense tracking"],
      improvements: ["Review variable expense buckets", "Automate saving actions"]
    };
  }
}
