export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum TransactionType {
  WIRE_TRANSFER = 'Wire Transfer',
  CASH_DEPOSIT = 'Cash Deposit',
  ACH = 'ACH',
  ATM_WITHDRAWAL = 'ATM Withdrawal',
  CRYPTO_EXCHANGE = 'Crypto Exchange'
}

export enum AlertStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  FALSE_POSITIVE = 'False Positive',
  ESCALATED_SAR = 'Escalated (SAR Filed)',
  CLOSED = 'Closed'
}

export interface Customer {
  id: string;
  name: string;
  type: 'Individual' | 'Entity';
  riskLevel: RiskLevel;
  occupation: string;
  country: string;
  pepStatus: boolean; // Politically Exposed Person
  kycVerified: boolean;
  lastReviewDate: string;
  beneficialOwners?: string[]; // For entities
}

export interface Transaction {
  id: string;
  customerId: string;
  date: string;
  amount: number;
  currency: string;
  type: TransactionType;
  counterpartyCountry: string;
  merchantOrCounterparty: string;
  flagged?: boolean;
}

export interface Alert {
  id: string;
  customerId: string;
  customerName: string; // Denormalized for display
  triggerDate: string;
  ruleName: string; // e.g., "Structuring", "High Velocity"
  severity: RiskLevel;
  status: AlertStatus;
  analystNotes: string[];
  relatedTransactionIds: string[];
}

export interface SanctionHit {
  id: string;
  name: string;
  list: 'OFAC' | 'UN' | 'EU';
  matchScore: number;
  entityType: string;
}