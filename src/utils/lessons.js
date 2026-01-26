// Financial education lessons
import { BookOpen, TrendingUp, PiggyBank, Shield, Target, Wallet } from 'lucide-react';

export const LESSONS = [
    {
        id: 'budgeting_basics',
        title: 'Budgeting Basics',
        icon: Wallet,
        category: 'fundamentals',
        difficulty: 'beginner',
        duration: 5,
        content: `
# Budgeting Basics

## What is Budgeting?
Budgeting is the process of creating a plan to spend your money. This spending plan helps you determine in advance whether you will have enough money to do the things you need to do or would like to do.

## The 50/30/20 Rule
A simple budgeting framework:
- **50%** for Needs (rent, food, utilities)
- **30%** for Wants (entertainment, dining out)
- **20%** for Savings & Debt Payment

## Getting Started
1. Track your income
2. List your expenses
3. Set realistic goals
4. Review and adjust monthly
        `,
        quiz: [
            {
                question: 'In the 50/30/20 rule, what percentage should go to savings?',
                options: ['10%', '20%', '30%', '50%'],
                correct: 1
            },
            {
                question: 'Which is considered a "Need"?',
                options: ['Netflix subscription', 'Rent payment', 'Concert tickets', 'Designer clothes'],
                correct: 1
            }
        ],
        badge: '💰 Budget Master'
    },
    {
        id: 'emergency_fund',
        title: 'Emergency Fund Essentials',
        icon: Shield,
        category: 'fundamentals',
        difficulty: 'beginner',
        duration: 7,
        content: `
# Emergency Fund Essentials

## Why You Need One
An emergency fund is money set aside to cover unexpected expenses like medical bills, car repairs, or job loss.

## How Much to Save
Financial experts recommend 3-6 months of living expenses. Start with ₹10,000 and build from there.

## Where to Keep It
- High-interest savings account
- Easily accessible (liquid)
- Separate from regular checking

## Building Your Fund
- Automate monthly transfers
- Save windfalls (bonuses, gifts)
- Cut one unnecessary expense
        `,
        quiz: [
            {
                question: 'How many months of expenses should an emergency fund cover?',
                options: ['1-2 months', '3-6 months', '12 months', '24 months'],
                correct: 1
            }
        ],
        badge: '🛡️ Safety Net Builder'
    },
    {
        id: 'compound_interest',
        title: 'The Magic of Compound Interest',
        icon: TrendingUp,
        category: 'investing',
        difficulty: 'intermediate',
        duration: 10,
        content: `
# The Magic of Compound Interest

## What is Compound Interest?
Interest earned on your initial investment PLUS interest earned on previous interest. Einstein called it the "8th wonder of the world."

## The Power of Time
₹10,000 invested at 10% annually:
- After 10 years: ₹25,937
- After 20 years: ₹67,275
- After 30 years: ₹1,74,494

## Key Takeaways
- Start early, even with small amounts
- Time is more valuable than timing
- Reinvest your earnings
- Be patient and consistent
        `,
        quiz: [
            {
                question: 'Compound interest is earned on:',
                options: ['Only initial investment', 'Initial + accumulated interest', 'Only new deposits', 'None'],
                correct: 1
            }
        ],
        badge: '📈 Compound Champion'
    },
    {
        id: 'smart_goals',
        title: 'Setting SMART Financial Goals',
        icon: Target,
        category: 'planning',
        difficulty: 'beginner',
        duration: 6,
        content: `
# Setting SMART Financial Goals

## What are SMART Goals?
- **S**pecific: Clear and well-defined
- **M**easurable: Track progress with numbers
- **A**chievable: Realistic given your situation
- **R**elevant: Aligns with your values
- **T**ime-bound: Has a deadline

## Example
❌ Bad: "Save more money"
✅ Good: "Save ₹50,000 for vacation in 12 months by saving ₹4,200/month"

## Tips
- Write goals down
- Break big goals into milestones
- Review progress monthly
- Celebrate wins!
        `,
        quiz: [
            {
                question: 'Which goal is SMART?',
                options: [
                    'I want to be rich',
                    'Save money for future',
                    'Save ₹1 lakh in 10 months',
                    'Buy expensive things'
                ],
                correct: 2
            }
        ],
        badge: '🎯 Goal Setter'
    },
    {
        id: 'debt_management',
        title: 'Debt Management Strategies',
        icon: PiggyBank,
        category: 'fundamentals',
        difficulty: 'intermediate',
        duration: 8,
        content: `
# Debt Management Strategies

## Two Popular Methods

### Debt Snowball
Pay off smallest debts first for quick wins and motivation.

### Debt Avalanche
Pay off highest interest debts first to save the most money.

## General Tips
- Stop taking on new debt
- Pay more than the minimum
- Consider debt consolidation
- Negotiate lower interest rates

## Priority Order
1. Pay secured debts (home, car)
2. Tackle high-interest debts
3. Maintain emergency fund
4. Balance saving and debt payoff
        `,
        quiz: [
            {
                question: 'The debt avalanche method focuses on:',
                options: ['Smallest balance', 'Highest interest rate', 'Newest debt', 'Largest balance'],
                correct: 1
            }
        ],
        badge: '💪 Debt Destroyer'
    },
    {
        id: 'investing_101',
        title: 'Investing 101',
        icon: BookOpen,
        category: 'investing',
        difficulty: 'intermediate',
        duration: 12,
        content: `
# Investing 101

## Why Invest?
Savings accounts are safe but inflation erodes value. Investing helps money grow faster than inflation.

## Investment Types
- **Stocks**: Ownership in companies
- **Bonds**: Loans to companies/government
- **Mutual Funds**: Professionally managed portfolios
- **Index Funds**: Track market indices

## Key Principles
- Diversify (don't put all eggs in one basket)
- Invest for long-term (5+ years)
- Dollar-cost average (invest regularly)
- Understand before buying

## Risk vs Return
Higher potential returns = higher risk. Balance based on your goals and timeline.
        `,
        quiz: [
            {
                question: 'Diversification means:',
                options: [
                    'Investing all money in one stock',
                    'Spreading investments across different assets',
                    'Only buying bonds',
                    'Timing the market'
                ],
                correct: 1
            }
        ],
        badge: '💼 Investor Initiate'
    },
    {
        id: 'sip_mutual_funds',
        title: 'SIP & Mutual Funds',
        icon: TrendingUp,
        category: 'investing',
        difficulty: 'intermediate',
        duration: 8,
        content: `
# SIP & Mutual Funds

## What is a Mutual Fund?
A pool of money collected from many investors to invest in securities like stocks, bonds, and other assets.

## Systemmatic Investment Plan (SIP)
A method where you invest a fixed amount regularly (monthly/quarterly) in a mutual fund.

## Benefits of SIP
- **Disciplined Saving**: Automates your investments.
- **Rupee Cost Averaging**: Buy more units when prices are low and fewer when high.
- **Compounding**: Small amounts grow significantly over time.
        `,
        quiz: [
            {
                question: 'SIP stands for:',
                options: [
                    'Savings Investment Plan',
                    'Systematic Investment Plan',
                    'Secure Interest Plan',
                    'Single Installment Payment'
                ],
                correct: 1
            }
        ],
        badge: '📊 SIP Strategist'
    },
    {
        id: 'risk_management',
        title: 'Advanced Risk Management',
        icon: Shield,
        category: 'investing',
        difficulty: 'advanced',
        duration: 15,
        content: `
# Advanced Risk Management

## Understanding Volatility
Market fluctuations are normal. Long-term investors shouldn't panic over short-term dips.

## Asset Allocation
Dividing your portfolio across different asset classes (Equity, Debt, Gold, Cash) based on your age and risk appetite.

## Portfolio Rebalancing
Periodically adjusting your portfolio back to your target allocation to maintain your risk level.
        `,
        quiz: [
            {
                question: 'Asset allocation should be based on:',
                options: [
                    'Market trends only',
                    'Friends advice',
                    'Age and risk appetite',
                    'Past performance only'
                ],
                correct: 2
            }
        ],
        badge: '🛡️ Portfolio Guardian'
    }
];

export function getLessonById(id) {
    return LESSONS.find(l => l.id === id);
}

export function getLessonsByCategory(category) {
    return LESSONS.filter(l => l.category === category);
}

export function getLessonsByDifficulty(difficulty) {
    return LESSONS.filter(l => l.difficulty === difficulty);
}
