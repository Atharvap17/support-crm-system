import { useEffect, useState } from "react"

function App() {
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [note, setNote] = useState("")

  const getTickets = async () => {
    let url = "https://support-crm-system-production-8376.up.railway.app/api/tickets"

    const params = new URLSearchParams()

    if (search) {
      params.append("search", search)
    }

    if (status) {
      params.append("status", status)
    }

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url)
    const data = await response.json()

    setTickets(data)
  }

  const getTicket = async (ticketId) => {
    const response = await fetch(
      `https://support-crm-system-production-8376.up.railway.app/api/tickets/${ticketId}`
    )

    const data = await response.json()

    setSelectedTicket(data)
  }

  useEffect(() => {
    getTickets()
  }, [search, status])

  const createTicket = async (e) => {
    e.preventDefault()

    const response = await fetch(
      "https://support-crm-system-production-8376.up.railway.app/api/tickets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          subject: subject,
          description: description
        })
      }
    )

    if (response.ok) {
      setCustomerName("")
      setCustomerEmail("")
      setSubject("")
      setDescription("")

      getTickets()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          Support CRM
        </h1>

        {/* Create Ticket */}
        <div className="mb-8 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Create Ticket
          </h2>

          <form
            onSubmit={createTicket}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Customer Email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500 sm:col-span-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white hover:bg-blue-600 sm:col-span-2"
            >
              Create Ticket
            </button>
          </form>
        </div>

        {/* Tickets */}
        <div className="mb-8 rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Tickets
          </h2>

          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-gray-500"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="px-3 py-3 text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-3 py-3 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.ticket_id}
                    className="border-b border-gray-100"
                  >
                    <td className="px-3 py-3">
                      <button
                        onClick={() => getTicket(ticket.ticket_id)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {ticket.ticket_id}
                      </button>
                    </td>

                    <td className="px-3 py-3 text-sm text-gray-700">
                      {ticket.customer_name}
                    </td>

                    <td className="px-3 py-3 text-sm text-gray-700">
                      {ticket.subject}
                    </td>

                    <td className="px-3 py-3 text-sm text-gray-700">
                      {ticket.status}
                    </td>

                    <td className="px-3 py-3 text-sm text-gray-700">
                      {ticket.created_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ticket Details */}
        {selectedTicket && (
          <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-semibold text-gray-900">
              Ticket Details
            </h2>

            <div className="space-y-3">
              <p>
                <strong>Ticket ID:</strong>{" "}
                {selectedTicket.ticket_id}
              </p>

              <p>
                <strong>Customer Name:</strong>{" "}
                {selectedTicket.customer_name}
              </p>

              <p>
                <strong>Customer Email:</strong>{" "}
                {selectedTicket.customer_email}
              </p>

              <p>
                <strong>Subject:</strong>{" "}
                {selectedTicket.subject}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {selectedTicket.description}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedTicket.status}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedTicket.status}
                onChange={(e) =>
                  setSelectedTicket({
                    ...selectedTicket,
                    status: e.target.value
                  })
                }
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-gray-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>

              <button
                onClick={async () => {
                  const response = await fetch(
                    `https://support-crm-system-production-8376.up.railway.app/api/tickets/${selectedTicket.ticket_id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        status: selectedTicket.status,
                        notes: ""
                      })
                    }
                  )

                  if (response.ok) {
                    getTickets()
                    getTicket(selectedTicket.ticket_id)
                  }
                }}
                className="rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white hover:bg-blue-600"
              >
                Update Status
              </button>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Notes
              </h3>

              <textarea
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-28 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
              />

              <button
                onClick={async () => {
                  if (!note.trim()) {
                    return
                  }

                  const response = await fetch(
                    `https://support-crm-system-production-8376.up.railway.app/api/tickets/${selectedTicket.ticket_id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        status: selectedTicket.status,
                        notes: note
                      })
                    }
                  )

                  if (response.ok) {
                    setNote("")
                    getTicket(selectedTicket.ticket_id)
                    getTickets()
                  }
                }}
                className="mt-3 rounded-lg bg-blue-500 px-4 py-2.5 font-medium text-white hover:bg-blue-600"
              >
                Add Note
              </button>

              <div className="mt-5 space-y-4">
                {selectedTicket.notes.map((note, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <p className="text-gray-800">
                      {note.note_text}
                    </p>

                    <small className="mt-2 block text-gray-500">
                      {note.created_at}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App