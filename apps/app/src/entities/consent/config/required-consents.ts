/**
 * Configuration for consent items displayed during registration
 */
export interface ConsentItem {
  id: string;
  policyVersion: string;
  label: string;
  description?: string;
  linkUrl?: string;
  isRequired: boolean;
}

/**
 * Required consents for user registration.
 * All items with isRequired: true must be accepted during sign-up.
 */
export const REQUIRED_CONSENTS: ConsentItem[] = [
  {
    id: 'privacy-policy',
    policyVersion: 'privacy_policy_v1',
    label: 'Akceptuję Politykę Prywatności',
    linkUrl: '/privacy-policy',
    isRequired: true,
  },
  {
    id: 'terms-of-service',
    policyVersion: 'terms_of_service_v1',
    label: 'Akceptuję Regulamin',
    linkUrl: '/terms',
    isRequired: true,
  },
];
