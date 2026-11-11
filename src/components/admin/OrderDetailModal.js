"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import Modal from "@/components/ui/Modal";
import StatusBadge from "@/components/ui/StatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatPrice } from "@/lib/utils";

function Detail({ order, clientName, freelancerName }) {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("order_events")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) setEvents(data ?? []);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      });
    return () => {
      cancelled = true;
    };
  }, [order.id]);

  const safeLink = /^https?:\/\//i.test(order.delivery_link || "");

  return (
    <div className="space-y-5 text-sm">
      <div>
        <p className="font-semibold text-slate-900">{order.gig_title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-600">
          <StatusBadge status={order.status} />
          <span className="font-semibold text-slate-900">{formatPrice(order.price)}</span>
          <span>Placed {formatDate(order.created_at)}</span>
          <span>
            Revisions used: {order.revisions_used} of {order.gig_revisions}
          </span>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Client</dt>
          <dd className="font-medium text-slate-900">{clientName}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <dt className="text-xs text-slate-500">Freelancer</dt>
          <dd className="font-medium text-slate-900">{freelancerName}</dd>
        </div>
      </dl>

      <div>
        <h3 className="font-semibold text-slate-900">Requirements</h3>
        <p className="mt-1 whitespace-pre-line rounded-xl border border-slate-200 p-3 text-slate-700">
          {order.requirements}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">Delivery</h3>
        {order.delivery_link || order.delivery_note ? (
          <div className="mt-1 space-y-2 rounded-xl border border-slate-200 p-3">
            {order.delivery_link &&
              (safeLink ? (
                <a
                  href={order.delivery_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 break-all font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" /> {order.delivery_link}
                </a>
              ) : (
                <p className="break-all text-slate-700">{order.delivery_link}</p>
              ))}
            {order.delivery_note && <p className="whitespace-pre-line text-slate-700">{order.delivery_note}</p>}
          </div>
        ) : (
          <p className="mt-1 text-slate-500">Nothing has been delivered yet.</p>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">Timeline</h3>
        <div className="mt-3 pl-1">
          {events === null ? (
            <p className="text-slate-500">Loading timeline...</p>
          ) : events.length === 0 ? (
            <p className="text-slate-500">No timeline entries.</p>
          ) : (
            <OrderTimeline
              timeline={events.map((e) => ({ status: e.status, label: e.label, date: e.created_at }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailModal({ order, clientName, freelancerName, onClose }) {
  return (
    <Modal open={Boolean(order)} onClose={onClose} title="Order details">
      {order && (
        <Detail key={order.id} order={order} clientName={clientName} freelancerName={freelancerName} />
      )}
    </Modal>
  );
}