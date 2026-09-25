import { Modal } from '../../components/ui'
import { NumberRail } from './NumberRail'

interface NumberSwitcherModalProps {
  open: boolean
  selectedAccountId: string
  onSelectAccount: (accountId: string) => void
  onClose: () => void
}

/** Compact project/number switcher for <lg screens, reusing NumberRail's content. */
export function NumberSwitcherModal({ open, selectedAccountId, onSelectAccount, onClose }: NumberSwitcherModalProps) {
  if (!open) return null

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-xs">
      <div className="flex max-h-[70vh] flex-col gap-3">
        <h2 className="text-sm font-bold text-slate-900">Switch WhatsApp Number</h2>
        <NumberRail
          selectedAccountId={selectedAccountId}
          onSelectAccount={(accountId) => {
            onSelectAccount(accountId)
            onClose()
          }}
        />
      </div>
    </Modal>
  )
}
