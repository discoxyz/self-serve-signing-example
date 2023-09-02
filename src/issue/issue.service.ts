/**
 * Data Model Interfaces
*/

import { JSONSchema7 } from "json-schema";
import { VC } from "./issue.interface";
import { buildVc, signVcHelper } from "./issue.functions";
import { privateKeyToAccount, signTypedData } from 'viem/accounts' 

/**
 * In-Memory Store
 */
const key = process.env.PKEY as `0x${string}`
const account = privateKeyToAccount(key) 

/**
 * Service Methods
 */
export const create = async (data: {
  credSubject: Record<string, any>,
  schema: JSONSchema7,
  recipient: string,
}): Promise<{ issuer: string, credential: VC}> => {

  const vc = buildVc(
    {
      issuer: account.address,
      ...data
    }
  )

  const signedVc = await signVcHelper(vc, account.address, signTypedData, key);
  
  return {
    issuer: account.address,
    credential: signedVc
  }
};

