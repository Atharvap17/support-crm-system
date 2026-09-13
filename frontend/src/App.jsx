import React, { useEffect, useState } from "react"
import {
  Search,
  Plus,
  X,
  RefreshCw,
  Mail,
  User,
  Clock,
  MessageSquare,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

const API_BASE_URL = "https://support-crm-system-production-8376.up.railway.app/api/tickets"

export default function App() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Form State
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Note & Status Update State
  const [noteText, setNoteText] = useState("")
  const [addingNote, setAddingNote] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState(false)

  // Fetch all tickets
  const getTickets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.append("search", search.trim())
      if (status) params.append("status", status)

      let url = API_BASE_URL
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch tickets")
      const data = await res.json()
      setTickets(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch single ticket details
  const getTicket = async (ticketId) => {
    setLoadingDetails(true)
    try {
      const res = await fetch(`${API_BASE_URL}/${ticketId}`)
      if (!res.ok) throw new Error("Ticket details not found")
      const data = await res.json()
      setSelectedTicket(data)
      setSelectedStatus(data.status || "Open")
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingDetails(false)
    }
  }

  useEffect(() => {
    getTickets()
  }, [search, status])

  // Handle Create Ticket
  const createTicket = async (e) => {
    e.preventDefault()
    if (!customerName || !customerEmail || !subject || !description) return

    setSubmitting(true)
    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          subject: subject,
          description: description
        })
      })

      if (res.ok) {
        setCustomerName("")
        setCustomerEmail("")
        setSubject("")
        setDescription("")
        setIsCreateOpen(false)
        getTickets()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle Update Status
  const handleUpdateStatus = async () => {
    if (!selectedTicket) return
    setUpdatingStatus(true)
    try {
      const res = await fetch(`${API_BASE_URL}/${selectedTicket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          notes: ""
        })
      })

      if (res.ok) {
        setSelectedTicket((prev) => ({ ...prev, status: selectedStatus }))
        getTickets()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Handle Add Note
  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!noteText.trim() || !selectedTicket) return

    setAddingNote(true)
    try {
      const res = await fetch(`${API_BASE_URL}/${selectedTicket.ticket_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedTicket.status,
          notes: noteText.trim()
        })
      })

      if (res.ok) {
        setNoteText("")
        getTicket(selectedTicket.ticket_id)
        getTickets()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAddingNote(false)
    }
  }

  // Render restrained status badge
  const renderStatusBadge = (ticketStatus) => {
    switch (ticketStatus) {
      case "Open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Open
          </span>
        )
      case "In Progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200">
            In Progress
          </span>
        )
      case "Closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Closed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {ticketStatus}
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Support CRM</h1>
            <p className="text-xs text-slate-500">Customer Support Ticketing System</p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Ticket</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Compact Controls Toolbar */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* As-you-type Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets by name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-md border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdown & Refresh */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-xs font-medium text-slate-600 whitespace-nowrap">
                Filter by Status:
              </label>
              <select
                id="status-filter"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <button
              onClick={() => getTickets()}
              className="p-2 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Main Ticket Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <span>Loading tickets...</span>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500 space-y-1">
              <p className="font-medium text-slate-700">No tickets found</p>
              <p className="text-xs text-slate-400">
                {search || status
                  ? "Try clearing filters or search terms."
                  : "No tickets have been created yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Subject / Issue</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {tickets.map((t) => (
                    <tr
                      key={t.ticket_id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs font-medium text-slate-700 whitespace-nowrap">
                        {t.ticket_id}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-medium text-slate-900">{t.customer_name}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-800 line-clamp-1 max-w-md">
                          {t.subject}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(t.status)}
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {t.created_at ? new Date(t.created_at).toLocaleDateString() : "-"}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => getTicket(t.ticket_id)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Ticket Details Side Drawer / Modal */}
      {(selectedTicket || loadingDetails) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-2xs">
          <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded">
                  {selectedTicket?.ticket_id || "..."}
                </span>
                {selectedTicket && renderStatusBadge(selectedTicket.status)}
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            {loadingDetails ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-sm text-slate-500 gap-2">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                <span>Loading ticket details...</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Subject */}
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedTicket.subject}</h2>
                </div>

                {/* Customer Information Section */}
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-xs text-slate-500 block">Name</span>
                      <span className="font-medium text-slate-900">{selectedTicket.customer_name}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Email</span>
                      <span className="font-medium text-slate-900">{selectedTicket.customer_email}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Issue Description
                  </h3>
                  <div className="p-3.5 rounded-md border border-slate-200 bg-white text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Separated Status Update Section */}
                <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Update Ticket Status
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button
                      disabled={updatingStatus}
                      onClick={handleUpdateStatus}
                      className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      {updatingStatus ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>

                {/* Activity Notes Section */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notes & Comments ({selectedTicket.notes?.length || 0})
                  </h3>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      placeholder="Add an internal note or update..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-md border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={addingNote || !noteText.trim()}
                        className="px-3.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        {addingNote ? "Adding..." : "Add Note"}
                      </button>
                    </div>
                  </form>

                  {/* Notes Activity Log */}
                  <div className="space-y-3 pt-2">
                    {!selectedTicket.notes || selectedTicket.notes.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No notes recorded yet for this ticket.</p>
                    ) : (
                      selectedTicket.notes.map((n, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-md border border-slate-200 bg-slate-50 space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">Internal Note</span>
                            <span>{n.created_at ? new Date(n.created_at).toLocaleString() : ""}</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-normal">{n.note_text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs">
          <div className="w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Create New Support Ticket</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={createTicket} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Customer Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Subject / Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of the issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed description of the customer request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-md border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                >
                  {submitting ? "Submitting..." : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-4 text-center text-xs text-slate-500 bg-white">
        <p>Support CRM — Internal Customer Support Management Portal</p>
      </footer>
    </div>
  )
}