import { JSONSchema7 } from "json-schema";

export interface VC {
  "@context": string | string[];
  id?: string;
  type: string[];
  issuer: string | { id: string; [key: string]: any };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: { [key: string]: any };
  proof?: {
    type?: string;
    jwt?: string;
    proofValue?: string;
    created?: string;
    eip712Domain?: { [key: string]: any };
    proofPurpose?: string;
    verificationMethod?: string;
  };
  credentialSchema?: {
    id: string;
    type: string;
  };
}

export interface CreateVC {
  credSubject: Record<string, any>,
  schema: JSONSchema7,
  recipient: string,
}