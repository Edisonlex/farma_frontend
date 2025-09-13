import { ClientCard } from "./ClientCard";
import { EmptyState } from "./EmptyState";
import { normalizeString } from "@/lib/utils";

interface ClientListProps {
  clients: any[];
  search: string;
  onEditClient: (client: any) => void;
  onDeleteClient: (clientId: string) => void;
}

export function ClientList({
  clients,
  search,
  onEditClient,
  onDeleteClient,
}: ClientListProps) {
  const filteredClients = clients.filter((client) => {
    const normalizedSearch = normalizeString(search);
    return (
      normalizeString(client.name).includes(normalizedSearch) ||
      normalizeString(client.email).includes(normalizedSearch) ||
      normalizeString(client.phone).includes(normalizedSearch) ||
      normalizeString(client.document).includes(normalizedSearch)
    );
  });

  if (filteredClients.length === 0) {
    return (
      <EmptyState search={search} onNewClient={() => onEditClient(null)} />
    );
  }

  return (
    <div className="grid gap-4">
      {filteredClients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={() => onEditClient(client)}
          onDelete={() => onDeleteClient(client.id)} // Esto activará el modal
        />
      ))}
    </div>
  );
}
