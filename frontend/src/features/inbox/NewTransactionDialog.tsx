import { useState } from 'react'
import { Button, Input, Modal, Select } from '../../components/ui'
import type { TransactionStatus, TransactionSummary } from '../../types/domain'

interface NewTransactionDialogProps {
  open: boolean
  contactName: string
  onClose: () => void
  onCreate: (transaction: TransactionSummary) => void
}

/**
 * A lightweight mock "create transaction" dialog for the inbox's
 * conversation actions. This is not the Transactions module itself —
 * it only produces a local TransactionSummary the customer panel can show.
 */
export function NewTransactionDialog({ open, contactName, onClose, onCreate }: NewTransactionDialogProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState<TransactionStatus>('enquiry')

  if (!open) return null

  function handleSubmit() {
    onCreate({
      id: `txn_${Date.now()}`,
      code: `#TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || 'Untitled transaction',
      amount: Number(amount) || 0,
      status,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    })
    setTitle('')
    setAmount('')
    setStatus('enquiry')
  }

  return (
    <Modal open={open} onClose={onClose} widthClassName="max-w-sm">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Create Transaction</h2>
          <p className="mt-0.5 text-sm text-slate-500">For {contactName}</p>
        </div>

        <Input
          id="txn-title"
          label="Title"
          placeholder="e.g. POS System Enquiry"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          id="txn-amount"
          label="Amount (₹)"
          type="number"
          min={0}
          placeholder="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <Select
          id="txn-status"
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as TransactionStatus)}
        >
          <option value="enquiry">Enquiry</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </Select>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </div>
    </Modal>
  )
}
