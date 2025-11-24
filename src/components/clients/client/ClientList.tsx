import { ClientCard } from "./ClientCard";
import { EmptyState } from "./EmptyState";
import { normalizeString } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { Pager } from "@/components/shared/Pager";

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
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filteredClients = clients.filter((client) => {
    const normalizedSearch = normalizeString(search);
    return (
      normalizeString(client.name).includes(normalizedSearch) ||
      normalizeString(client.email).includes(normalizedSearch) ||
      normalizeString(client.phone).includes(normalizedSearch) ||
      normalizeString(client.document).includes(normalizedSearch)
    );
  });

  useEffect(() => {
    setPage(1);
  }, [search, clients]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, page]);


  if (filteredClients.length === 0) {
    return (
      <EmptyState search={search} onNewClient={() => onEditClient(null)} />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {currentItems.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={() => onEditClient(client)}
            onDelete={() => onDeleteClient(client.id)}
          />
        ))}
      </div>

      <Pager
        total={filteredClients.length}
        page={page}
        pageSize={pageSize}
        onChange={setPage}
      />
    </div>
  );
}
