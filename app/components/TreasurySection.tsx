"use client";

import { formatNumberPY } from "@/lib/format";

export interface TreasuryAccount {
  id: string;
  accountName: string | null;
  accountNumber: string | null;
  provider: string | null;
  currency: string;
  currentBalance: number;
  balanceAsOf: Date;
}

export function TreasurySection({ accounts }: { accounts: TreasuryAccount[] }) {
  if (accounts.length === 0) {
    return (
      <p className="px-5 py-4 text-sm text-text-secondary">
        No hay cuentas bancarias cargadas.
      </p>
    );
  }

  const totalPYG = accounts.reduce((sum, acc) => {
    if (acc.currency === "PYG") return sum + acc.currentBalance;
    return sum;
  }, 0);

  return (
    <>
      {accounts.map((account) => (
        <div key={account.id} className="px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">
                {account.accountName || "Cuenta sin nombre"}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">
                {account.provider || "Banco no especificado"}
                {account.accountNumber && ` · ${account.accountNumber}`}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                Actualizado {new Intl.DateTimeFormat("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(account.balanceAsOf)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="tabular text-sm font-medium text-text-primary">
                {formatNumberPY(account.currentBalance)}
              </p>
              <p className="text-xs text-text-secondary">{account.currency}</p>
            </div>
          </div>
        </div>
      ))}

      {totalPYG > 0 && (
        <div className="border-t border-border-soft px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">
              Total en PYG
            </p>
            <p className="tabular text-sm font-semibold text-accent">
              {formatNumberPY(totalPYG)}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
