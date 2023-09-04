import { JSONSchema7 } from "json-schema";
import { VC } from "./issue.interface";
import { v4 as uuidv4 } from "uuid";
import { getEthTypesFromInputDoc } from "eip-712-types-generation";
import {
  Address,
} from "viem";
import { signTypedData } from "viem/accounts";
import { upperFirst, camelCase } from "lodash";

export function addSchemaToVc(
  schema: JSONSchema7,
  vc: VC,
  includeType?: boolean
): VC {
  if (!schema.$id) {
    throw Error(
      "Schema missing $id property: can't use for VC credentialSchema field"
    );
  }
  return {
    ...vc,

    type:
      includeType && schema.title
        ? vc.type.concat(upperFirst(camelCase(schema.title)))
        : vc.type,

    credentialSchema: {
      id: schema.$id,
      type: "JsonSchemaValidator2018",
    },
  };
}

export function buildVc(data: {
  issuer: string;
  credSubject: Record<string, any>;
  schema?: JSONSchema7;
  recipient?: string;
}): VC {
  const { issuer, credSubject, schema, recipient } = data;

  const credSubjectCopy: Record<string, any> = { ...credSubject };
  if (credSubjectCopy.expiration) {
    delete credSubjectCopy.expiration;
  }
  if (credSubjectCopy.expirationDate) {
    delete credSubjectCopy.expirationDate;
  }
  const vc: VC = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    issuer: { id: `did:pkh:eip-155:1:${issuer}` },
    issuanceDate: new Date().toISOString(),
    id: issuer + "#" + uuidv4(),
    credentialSubject: {
      id: recipient || credSubject.id || issuer,
      ...credSubjectCopy,
    },
  };

  if (credSubject.expiration || credSubject.expirationDate) {
    const expirationDateObj = new Date(
      credSubject.expiration || credSubject.expirationDate
    );
    if (!isNaN(expirationDateObj.getTime())) {
      vc.expirationDate = expirationDateObj.toISOString();
    }
  }

  if (schema) {
    return addSchemaToVc(schema, vc, true);
  } else {
    return vc;
  }
}

export function getVcProof(address: Address) {
  return {
    verificationMethod: `did:pkh:eip-155:1:${address}#controller`,
    created: new Date().toISOString(),
    proofPurpose: "assertionMethod",
    type: "EthereumEip712Signature2021",
  };
}

export async function signVcHelper(
  vc: VC,
  address: Address,
  signFn: typeof signTypedData,
  privateKey: `0x${string}`
): Promise<VC> {
  const message = {
    ...vc,
    proof: getVcProof(address),
  };

  const domain = {
    chainId: 1,
    name: "Disco Verifiable Credential",
    version: "1",
  };
  const types = getEthTypesFromInputDoc(message, "VerifiableCredential");
  const data = { types, domain, primaryType: "VerifiableCredential", message };

  const signed = await signFn({ ...data, privateKey: privateKey });
  const newObj = JSON.parse(JSON.stringify(message));
  newObj.proof.proofValue = signed;
  newObj.proof.eip712Domain = {
    domain: domain,
    messageSchema: types,
    primaryType: "VerifiableCredential",
  };
  console.log(JSON.stringify(newObj));
  return newObj;
}
