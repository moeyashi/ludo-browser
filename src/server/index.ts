import { routePartykitRequest, Server } from "partyserver";
import type { Connection, ConnectionContext, WSMessage } from "partyserver";
import { LudoAction } from "../shared/types";
import { safeParse } from "valibot";

type Env = {
  Ludo: DurableObjectNamespace<Ludo>;
};

export class Ludo extends Server {
  static options = { hibernate: true };

  sql2(sql: string, ...values: (string | number | null)[]) {
    if (
      ["insert", "update", "delete"].includes(
        sql.slice(0, sql.indexOf(" ")).toLowerCase()
      )
    ) {
      // set alarm to delete expired todos
      this.ctx.storage.setAlarm(Date.now() + 24 * 60 * 60 * 1000);
    }
    return this.ctx.storage.sql.exec(sql, ...values);
  }

  onStart() {
    this.sql2(`CREATE TABLE IF NOT EXISTS rudo_rooms (
      id TEXT PRIMARY KEY NOT NULL UNIQUE,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at INTEGER NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
  }

  onConnect(connection: Connection, ctx: ConnectionContext): void | Promise<void> {
    console.log("New connection established:", connection.id);
  }

  onMessage(_connection: Connection, message: WSMessage) {
    console.log("Received a message:", message);

    if (typeof message !== "string") {
      console.error("Invalid message type:", typeof message);
      return;
    }
    const parsed = safeParse(LudoAction, JSON.parse(message));
    if (!parsed.success) {
      console.error("Failed to parse action:", parsed.issues);
      return;
    }

    const action = parsed.output;
    console.log("Parsed action:", action);
    switch (action.type) {
      case "SendMessage":
        console.log(`SendMessage`);
        this.broadcast(action.content);
        console.log(`Broadcasted message: ${action.content}`);
        return;
      default:
        console.error("Unknown action type:", action.type);
        return;
    }
  }

  async onAlarm() {
    // actually delete any todos that have been
    // marked as deleted more than 24 hours ago
    this.sql2(
      "DELETE FROM rudo_rooms WHERE updated_at < ?",
      Date.now() - 24 * 60 * 60 * 1000
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env)) ||
      new Response("Not Found", { status: 404 })
    );
  }
} satisfies ExportedHandler<Env>;
