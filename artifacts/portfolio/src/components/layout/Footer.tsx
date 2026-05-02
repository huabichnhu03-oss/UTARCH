import { useGetSettings } from "@workspace/api-client-react";

export function Footer() {
  const { data: settings } = useGetSettings();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-6">
          <h3 className="mono text-xs text-muted-foreground mb-2 uppercase">Location</h3>
          <p className="text-sm">{settings?.location || "Toronto, ON"}</p>
        </div>
        <div className="p-6">
          <h3 className="mono text-xs text-muted-foreground mb-2 uppercase">Email</h3>
          <a href={`mailto:${settings?.email || ""}`} className="text-sm hover:text-accent transition-colors block truncate">
            {settings?.email || "hello@example.com"}
          </a>
        </div>
        <div className="p-6">
          <h3 className="mono text-xs text-muted-foreground mb-2 uppercase">Phone</h3>
          <a href={`tel:${settings?.phone || ""}`} className="text-sm hover:text-accent transition-colors block">
            {settings?.phone || "+1 (555) 000-0000"}
          </a>
        </div>
        <div className="p-6">
          <h3 className="mono text-xs text-muted-foreground mb-2 uppercase">LinkedIn</h3>
          <a href={settings?.linkedin || "#"} target="_blank" rel="noreferrer" className="text-sm hover:text-accent transition-colors block truncate">
            Connect
          </a>
        </div>
      </div>
      <div className="border-t border-border p-4 text-center">
        <p className="mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {settings?.ownerName || "Uyen Ton"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
