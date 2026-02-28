import ContactsTable from "@/components/admin/ContactsTable";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Contacts</h1>
      <ContactsTable />
    </div>
  );
}
