import { useState, type ReactNode } from 'react'
import { Button, FormSection, Input, Modal, Select, StepIndicator, SuccessState } from '../../components/ui'
import {
  mockBusinessCategories,
  mockPhoneNumberOptions,
  mockWabaOptions,
} from '../../data/mockData'
import type { Project, WhatsAppAccount } from '../../types/domain'

type FlowStep =
  | 'connect-intro'
  | 'meta-login'
  | 'waba-select'
  | 'phone-select'
  | 'verify-otp'
  | 'business-profile'
  | 'connected'

const STEP_ORDER: FlowStep[] = [
  'connect-intro',
  'meta-login',
  'waba-select',
  'phone-select',
  'verify-otp',
  'business-profile',
  'connected',
]

interface ConnectWhatsAppFlowProps {
  open: boolean
  currentProject: Project
  onClose: () => void
  onConnected: (account: WhatsAppAccount) => void
}

/**
 * Steps 4–10 of the WhatsApp Signup / Connection workflow.
 * All state here is local UI state only — no real Meta request is made,
 * no credentials are collected or stored.
 */
export function ConnectWhatsAppFlow({
  open,
  currentProject,
  onClose,
  onConnected,
}: ConnectWhatsAppFlowProps) {
  const [step, setStep] = useState<FlowStep>('connect-intro')

  // Mock form state — none of this is sent anywhere.
  const [metaEmail, setMetaEmail] = useState('')
  const [metaPassword, setMetaPassword] = useState('')
  const [wabaChoice, setWabaChoice] = useState<'existing' | 'new'>('existing')
  const [selectedWaba, setSelectedWaba] = useState(mockWabaOptions[0].id)
  const [phoneChoice, setPhoneChoice] = useState<'new' | 'existing'>('existing')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [selectedExistingPhone, setSelectedExistingPhone] = useState(mockPhoneNumberOptions[0].id)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [displayName, setDisplayName] = useState(currentProject.name)
  const [businessCategory, setBusinessCategory] = useState(mockBusinessCategories[0])
  const [businessDescription, setBusinessDescription] = useState('')

  function resetAndClose() {
    setStep('connect-intro')
    onClose()
  }

  function handleFinishSetup() {
    const phoneLabel =
      phoneChoice === 'existing'
        ? mockPhoneNumberOptions.find((option) => option.id === selectedExistingPhone)?.label ?? ''
        : newPhoneNumber || '+91 00000 00000'

    onConnected({
      id: `wa_${Date.now()}`,
      projectId: currentProject.id,
      name: displayName || currentProject.name,
      phoneNumber: phoneLabel,
      status: 'active',
    })
    setStep('connected')
  }

  if (!open) return null

  const currentIndex = STEP_ORDER.indexOf(step)

  return (
    <Modal open={open} onClose={resetAndClose} widthClassName="max-w-xl">
      {step !== 'connected' && (
        <div className="mb-6 flex items-center gap-2">
          {STEP_ORDER.slice(0, -1).map((s, index) => (
            <span
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                index <= currentIndex ? 'bg-nexcred-blue' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}

      {step === 'connect-intro' && (
        <ConnectIntroStep onContinue={() => setStep('meta-login')} onCancel={resetAndClose} />
      )}

      {step === 'meta-login' && (
        <MetaLoginStep
          email={metaEmail}
          password={metaPassword}
          onEmailChange={setMetaEmail}
          onPasswordChange={setMetaPassword}
          onBack={() => setStep('connect-intro')}
          onSubmit={() => setStep('waba-select')}
        />
      )}

      {step === 'waba-select' && (
        <WabaSelectStep
          choice={wabaChoice}
          onChoiceChange={setWabaChoice}
          selectedWaba={selectedWaba}
          onSelectedWabaChange={setSelectedWaba}
          onBack={() => setStep('meta-login')}
          onContinue={() => setStep('phone-select')}
        />
      )}

      {step === 'phone-select' && (
        <PhoneSelectStep
          choice={phoneChoice}
          onChoiceChange={setPhoneChoice}
          newPhoneNumber={newPhoneNumber}
          onNewPhoneNumberChange={setNewPhoneNumber}
          selectedExistingPhone={selectedExistingPhone}
          onSelectedExistingPhoneChange={setSelectedExistingPhone}
          onBack={() => setStep('waba-select')}
          onContinue={() => setStep('verify-otp')}
        />
      )}

      {step === 'verify-otp' && (
        <VerifyOtpStep
          phoneLabel={
            phoneChoice === 'existing'
              ? mockPhoneNumberOptions.find((o) => o.id === selectedExistingPhone)?.label ?? ''
              : newPhoneNumber || 'your new number'
          }
          otp={otp}
          onOtpChange={setOtp}
          onBack={() => setStep('phone-select')}
          onContinue={() => setStep('business-profile')}
        />
      )}

      {step === 'business-profile' && (
        <BusinessProfileStep
          displayName={displayName}
          onDisplayNameChange={setDisplayName}
          businessCategory={businessCategory}
          onBusinessCategoryChange={setBusinessCategory}
          businessDescription={businessDescription}
          onBusinessDescriptionChange={setBusinessDescription}
          onBack={() => setStep('verify-otp')}
          onFinish={handleFinishSetup}
        />
      )}

      {step === 'connected' && (
        <ConnectedStep
          projectName={currentProject.name}
          phoneNumber={
            phoneChoice === 'existing'
              ? mockPhoneNumberOptions.find((o) => o.id === selectedExistingPhone)?.label ?? ''
              : newPhoneNumber
          }
          onDone={resetAndClose}
        />
      )}
    </Modal>
  )
}

// ---------------------------------------------------------------------------
// Step 4 — Connect with Meta
// ---------------------------------------------------------------------------

function ConnectIntroStep({ onContinue, onCancel }: { onContinue: () => void; onCancel: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <StepHeading step={4} title="Connect with Meta" />
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-nexcred-navy text-lg font-black text-white">
          N
        </span>
        <span className="text-slate-300">⇄</span>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-nexcred-green text-white">
          <WhatsAppGlyph />
        </span>
      </div>
      <p className="text-sm font-semibold text-slate-900">
        Nexcred wants to access your WhatsApp Business Account
      </p>
      <ul className="flex w-full flex-col gap-2 text-left text-sm text-slate-600">
        <PermissionRow label="Manage your WhatsApp accounts" />
        <PermissionRow label="Send and receive messages" />
        <PermissionRow label="Manage message templates" />
        <PermissionRow label="Read message insights" />
      </ul>
      <div className="flex w-full gap-3">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={onContinue}>
          Continue with Meta
        </Button>
      </div>
      <p className="text-xs text-slate-400">You will be taken to a secure Meta login page.</p>
    </div>
  )
}

function PermissionRow({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
      <CheckIcon />
      {label}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Step 5 — Log in to Meta
// ---------------------------------------------------------------------------

interface MetaLoginStepProps {
  email: string
  password: string
  onEmailChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onBack: () => void
  onSubmit: () => void
}

function MetaLoginStep({ email, password, onEmailChange, onPasswordChange, onBack, onSubmit }: MetaLoginStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <StepHeading step={5} title="Log in to Meta" />
      <p className="-mt-3 text-center text-sm text-slate-500">
        Log in with the Facebook/Meta account that has access to a WhatsApp Business Account (WABA).
      </p>
      <form
        className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <Input
          id="meta-email"
          label="Email or phone number"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@business.com"
        />
        <Input
          id="meta-password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit">Log In</Button>
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Use a business account that can create or manage a WhatsApp Business Account.
        </p>
      </form>
      <StepNav onBack={onBack} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 6 — Create or Select WABA
// ---------------------------------------------------------------------------

interface WabaSelectStepProps {
  choice: 'existing' | 'new'
  onChoiceChange: (v: 'existing' | 'new') => void
  selectedWaba: string
  onSelectedWabaChange: (v: string) => void
  onBack: () => void
  onContinue: () => void
}

function WabaSelectStep({
  choice,
  onChoiceChange,
  selectedWaba,
  onSelectedWabaChange,
  onBack,
  onContinue,
}: WabaSelectStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <StepHeading step={6} title="Create or Select WABA" />
      <FormSection
        title="WhatsApp Business Account"
        description="Choose an existing WhatsApp Business Account or create a new one within Meta."
      >
        <RadioOption
          checked={choice === 'existing'}
          onChange={() => onChoiceChange('existing')}
          label="Use existing account"
        >
          {choice === 'existing' && (
            <Select
              id="waba-select"
              value={selectedWaba}
              onChange={(event) => onSelectedWabaChange(event.target.value)}
            >
              {mockWabaOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </RadioOption>
        <RadioOption
          checked={choice === 'new'}
          onChange={() => onChoiceChange('new')}
          label="Create new account"
        />
      </FormSection>
      <Button onClick={onContinue}>Continue</Button>
      <p className="text-xs text-slate-400">A WABA represents your business in Meta's ecosystem.</p>
      <StepNav onBack={onBack} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 7 — Add or Select Phone Number
// ---------------------------------------------------------------------------

interface PhoneSelectStepProps {
  choice: 'new' | 'existing'
  onChoiceChange: (v: 'new' | 'existing') => void
  newPhoneNumber: string
  onNewPhoneNumberChange: (v: string) => void
  selectedExistingPhone: string
  onSelectedExistingPhoneChange: (v: string) => void
  onBack: () => void
  onContinue: () => void
}

function PhoneSelectStep({
  choice,
  onChoiceChange,
  newPhoneNumber,
  onNewPhoneNumberChange,
  selectedExistingPhone,
  onSelectedExistingPhoneChange,
  onBack,
  onContinue,
}: PhoneSelectStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <StepHeading step={7} title="Add or Select Phone Number" />
      <FormSection
        title="Phone Number"
        description="Choose an existing number or add a new phone number for WhatsApp."
      >
        <RadioOption checked={choice === 'new'} onChange={() => onChoiceChange('new')} label="Add a new number">
          {choice === 'new' && (
            <div className="flex gap-2">
              <span className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
                +91
              </span>
              <Input
                id="new-phone"
                className="flex-1"
                placeholder="Enter phone number"
                value={newPhoneNumber}
                onChange={(event) => onNewPhoneNumberChange(event.target.value)}
              />
            </div>
          )}
        </RadioOption>
        <RadioOption
          checked={choice === 'existing'}
          onChange={() => onChoiceChange('existing')}
          label="Use an existing number"
        >
          {choice === 'existing' && (
            <Select
              id="existing-phone"
              value={selectedExistingPhone}
              onChange={(event) => onSelectedExistingPhoneChange(event.target.value)}
            >
              {mockPhoneNumberOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </RadioOption>
      </FormSection>
      <Button onClick={onContinue}>Continue</Button>
      <p className="text-xs text-slate-400">The number will be registered with WhatsApp through Meta.</p>
      <StepNav onBack={onBack} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 8 — Verify the Phone Number
// ---------------------------------------------------------------------------

interface VerifyOtpStepProps {
  phoneLabel: string
  otp: string[]
  onOtpChange: (otp: string[]) => void
  onBack: () => void
  onContinue: () => void
}

function VerifyOtpStep({ phoneLabel, otp, onOtpChange, onBack, onContinue }: VerifyOtpStepProps) {
  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    onOtpChange(next)

    if (digit && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <StepHeading step={8} title="Verify the Phone Number" />
      <p className="-mt-3 text-center text-sm text-slate-500">
        Meta will verify your number via OTP (SMS or Call).
      </p>
      <FormSection title="Verify Phone Number" description={`Enter the 6-digit code sent to ${phoneLabel}`}>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              className="h-12 w-11 rounded-lg border border-slate-300 text-center text-lg font-semibold focus:border-nexcred-blue focus:outline-none focus:ring-2 focus:ring-nexcred-blue/20"
            />
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">
          Didn't receive the code?{' '}
          <button type="button" className="font-medium text-nexcred-blue hover:underline">
            Resend code
          </button>
        </p>
      </FormSection>
      <Button onClick={onContinue}>Continue</Button>
      <p className="text-xs text-slate-400 text-center">This verifies that you own the number.</p>
      <StepNav onBack={onBack} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 9 — Complete Setup
// ---------------------------------------------------------------------------

interface BusinessProfileStepProps {
  displayName: string
  onDisplayNameChange: (v: string) => void
  businessCategory: string
  onBusinessCategoryChange: (v: string) => void
  businessDescription: string
  onBusinessDescriptionChange: (v: string) => void
  onBack: () => void
  onFinish: () => void
}

function BusinessProfileStep({
  displayName,
  onDisplayNameChange,
  businessCategory,
  onBusinessCategoryChange,
  businessDescription,
  onBusinessDescriptionChange,
  onBack,
  onFinish,
}: BusinessProfileStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <StepHeading step={9} title="Complete Setup" />
      <p className="-mt-3 text-center text-sm text-slate-500">
        Set a display name, business profile, and review permissions.
      </p>
      <FormSection title="Business Profile">
        <Input
          id="display-name"
          label="Display name"
          value={displayName}
          onChange={(event) => onDisplayNameChange(event.target.value)}
        />
        <Select
          id="business-category"
          label="Business category"
          value={businessCategory}
          onChange={(event) => onBusinessCategoryChange(event.target.value)}
        >
          {mockBusinessCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="business-description" className="text-sm font-medium text-slate-700">
            Business description (optional)
          </label>
          <textarea
            id="business-description"
            rows={3}
            value={businessDescription}
            onChange={(event) => onBusinessDescriptionChange(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-nexcred-blue focus:outline-none focus:ring-2 focus:ring-nexcred-blue/20"
            placeholder="What does this business do?"
          />
        </div>
      </FormSection>
      <Button onClick={onFinish}>Finish Setup</Button>
      <StepNav onBack={onBack} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 10 — Account Connected
// ---------------------------------------------------------------------------

function ConnectedStep({
  projectName,
  phoneNumber,
  onDone,
}: {
  projectName: string
  phoneNumber: string
  onDone: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <StepHeading step={10} title="Account Connected" />
      <SuccessState
        title="WhatsApp Account Connected!"
        description={
          <div className="flex flex-col gap-1">
            <span>
              Number: <span className="font-semibold">{phoneNumber || '—'}</span>
            </span>
            <span>
              Project: <span className="font-semibold">{projectName}</span>
            </span>
            <p className="mt-2">You can now send and receive WhatsApp messages from Nexcred.</p>
          </div>
        }
        action={
          <Button variant="whatsapp" onClick={onDone}>
            Go to Inbox →
          </Button>
        }
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared step pieces
// ---------------------------------------------------------------------------

function StepHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <StepIndicator step={step} status="current" />
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
    </div>
  )
}

function StepNav({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="self-center text-sm font-medium text-slate-500 hover:text-slate-700"
    >
      ← Back
    </button>
  )
}

function RadioOption({
  checked,
  onChange,
  label,
  children,
}: {
  checked: boolean
  onChange: () => void
  label: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-3">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 border-slate-300 text-nexcred-blue focus:ring-nexcred-blue/30"
        />
        {label}
      </label>
      {checked && children && <div className="pl-6">{children}</div>}
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4 shrink-0 text-nexcred-green"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.28 4.93L2 22l5.24-1.37A9.96 9.96 0 0012.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.87 14.19c-.25.7-1.44 1.34-1.99 1.4-.51.06-1.16.09-1.87-.12-.43-.13-.99-.31-1.7-.6-3-1.29-4.96-4.34-5.11-4.54-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.05-2.49c.27-.3.6-.37.8-.37h.57c.19 0 .43-.05.66.51.25.62.85 2.14.92 2.29.07.15.12.33.02.53-.1.2-.15.32-.29.5-.15.18-.31.41-.44.55-.15.15-.3.32-.13.62.17.3.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.35 1.45.3.15.47.12.65-.07.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.27.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.75-.18 1.45z" />
    </svg>
  )
}
