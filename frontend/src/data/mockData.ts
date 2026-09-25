/**
 * MOCK DATA — for UI development only.
 *
 * None of this is fetched from a backend. It exists purely so the
 * WhatsApp Signup / Connection screens have realistic content to render.
 * Replace with real API-backed data when the backend for this module is
 * implemented — do not treat this file as a data source beyond that point.
 */

import type { PhoneNumberOption, Project, WabaOption, WhatsAppAccount } from '../types/domain'

export const mockCurrentProject: Project = {
  id: 'proj_yazin_pos',
  name: 'Yazin POS',
}

export const mockProjects: Project[] = [
  { id: 'proj_yazin_pos', name: 'Yazin POS' },
  { id: 'proj_website_b', name: 'Website B' },
  { id: 'proj_website_c', name: 'Website C' },
]

export const mockWhatsAppAccounts: WhatsAppAccount[] = [
  {
    id: 'wa_yazin_pos_1',
    projectId: 'proj_yazin_pos',
    name: 'Yazin POS',
    phoneNumber: '+91 98368 19895',
    status: 'active',
  },
  {
    id: 'wa_website_b_1',
    projectId: 'proj_website_b',
    name: 'Website B',
    phoneNumber: '+91 98765 43210',
    status: 'active',
  },
  {
    id: 'wa_website_c_1',
    projectId: 'proj_website_c',
    name: 'Website C',
    phoneNumber: '+91 91234 56789',
    status: 'active',
  },
]

export const mockWabaOptions: WabaOption[] = [
  { id: 'waba_yazin_pos', label: 'Yazin POS Business' },
  { id: 'waba_secondary', label: 'Secondary Business Account' },
]

export const mockPhoneNumberOptions: PhoneNumberOption[] = [
  { id: 'phone_1', label: '+91 98368 19895' },
  { id: 'phone_2', label: '+91 90000 11122' },
]

export const mockBusinessCategories = [
  'E-commerce',
  'Retail',
  'Support / Services',
  'Education',
  'Healthcare',
  'Other',
]
