import { useState } from 'react'
import { Button, Card, Input } from '../../components/ui'

interface LoginPageProps {
  onSignIn: () => void
}

/**
 * Step 1 — Login to Nexcred.
 * UI-only: "signing in" simply reveals the authenticated app shell.
 * No authentication backend exists yet.
 */
export function LoginPage({ onSignIn }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-sm">
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            onSignIn()
          }}
        >
          <div className="text-center">
            <span className="text-2xl font-black tracking-tight text-nexcred-navy">Nexcred</span>
          </div>

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-nexcred-blue focus:ring-nexcred-blue/30"
            />
            Remember me
          </label>

          <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            Only authorized users can add WhatsApp accounts.
          </p>
        </form>
      </Card>
    </div>
  )
}
