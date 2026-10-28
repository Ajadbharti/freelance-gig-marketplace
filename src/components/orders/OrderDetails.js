"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Clock, ExternalLink, RefreshCw, SearchX, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { findUserById } from "@/lib/users";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import SafeImage from "@/components/ui/SafeImage";
import StatusBadge from "@/components/ui/StatusBadge";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewModal from "@/components/reviews/ReviewModal";
import DeliverModal from "@/components/orders/DeliverModal";
import RevisionModal from "@/components/orders/RevisionModal";
import OrderTimeline from "@/components/orders/OrderTimeline";
import { formatDate, formatPrice } from "@/lib/utils";

export function OrderDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" role="status" aria-label="Loading order">
      <LoadingSkeleton className="h-5 w-48" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <LoadingSkeleton className="h-9 w-2/3" />
          <LoadingSkeleton className="h-32 w-full" />
          <LoadingSkeleton className="h-48 w-full" />
        </div>
        <LoadingSkeleton className="h-80 w-full" />
      </div>
    </div>
  );
}

function Notice({ icon: Icon, title, text, href, linkLabel }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Icon className="h-14 w-14 text-slate-300" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
      <Link
        href={href}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

function PersonCard({ label, name, avatar, href }) {
  const body = (
    <div className="flex items-center gap-3">
      <SafeImage src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate font-semibold text-slate-900">{name}</p>
      </div>
    </div>
  );
  if (!href) return <div className="p-2">{body}</div>;
  return (
    <Link href={href} className="block rounded-xl p-2 transition hover:bg-slate-50">
      {body}
    </Link>
  );
}

export default function OrderDetails({ params }) {
  const { id } = use(params);
  const { user, hydrated: authReady } = useAuth();
  const { hydrated, gigs, getOrder, getOrderGig, getFreelancer, getOrderReview, completeOrder, cancelOrder } =
    useMarketplace();
  const { showToast } = useToast();
  const [modal, setModal] = useState(null); // deliver | revision | complete | cancel | review

  if (!authReady || !hydrated) return <OrderDetailsSkeleton />;

  const order = getOrder(id);

  if (!order) {
    return (
      <Notice
        icon={SearchX}
        title="Order not found"
        text="This order does not exist."
        href={user?.role === "freelancer" ? "/dashboard/freelancer" : user ? "/dashboard/client" : "/gigs"}
        linkLabel={user ? "Back to dashboard" : "Browse gigs"}
      />
    );
  }

  if (!user) {
    return (
      <Notice
        icon={ShieldAlert}
        title="Please log in"
        text="You need to log in to view this order."
        href={`/login?next=${encodeURIComponent(`/orders/${order.id}`)}`}
        linkLabel="Go to login"
      />
    );
  }

  const isClient = user.role === "client" && user.id === order.clientId;
  const isFreelancer = user.role === "freelancer" && user.id === order.freelancerId;

  if (!isClient && !isFreelancer) {
    return (
      <Notice
        icon={ShieldAlert}
        title="You cannot view this order"
        text="Only the client and the freelancer of this order can open it."
        href={user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client"}
        linkLabel="Go to my dashboard"
      />
    );
  }

  const gig = getOrderGig(order);
  const gigExists = gigs.some((g) => g.id === order.gigId);
  const client = findUserById(order.clientId);
  const freelancer = getFreelancer(order.freelancerId);
  const review = getOrderReview(order.id);

  const revisionLimit = gig?.revisions ?? 0;
  const revisionsLeft = Math.max(revisionLimit - order.revisionsUsed, 0);
  const latest = order.timeline[order.timeline.length - 1];
  const revisionPending = order.status === "active" && Boolean(latest?.label.startsWith("Revision requested"));

  const canDeliver = isFreelancer && order.status === "active";
  const canCancel = order.status === "active";
  const canRevise = isClient && order.status === "delivered" && revisionsLeft > 0;
  const canComplete = isClient && order.status === "delivered";
  const canReview = isClient && order.status === "completed" && !review;
  const hasButtons = canDeliver || canCancel || canRevise || canComplete || canReview;

  let hint = "";
  if (order.status === "cancelled") {
    hint = "This order was cancelled. No further actions are available.";
  } else if (isFreelancer) {
    if (order.status === "active") {
      hint = revisionPending ? `The client asked for changes. ${latest.label}` : "The client is waiting for your delivery.";
    } else if (order.status === "delivered") {
      hint = "You delivered this work. Waiting for the client to approve it or request a revision.";
    } else {
      hint = "This order is completed. Great work!";
    }
  } else if (order.status === "active") {
    hint = revisionPending
      ? "Revision requested. Waiting for the freelancer to deliver again."
      : "The freelancer is working on your order.";
  } else if (order.status === "delivered") {
    hint =
      revisionsLeft > 0
        ? `You have ${revisionsLeft} revision${revisionsLeft === 1 ? "" : "s"} left.`
        : "No revisions left. You can approve the work to complete the order.";
  } else if (order.status === "completed") {
    hint = review ? "Thanks for your review!" : "This order is completed. Share your experience with a review.";
  }

  const safeLink = /^https?:\/\//i.test(order.deliveryLink || "");

  function handleComplete() {
    const result = completeOrder(order.id);
    showToast(result.ok ? "Order completed! You can now leave a review." : result.error, result.ok ? "success" : "error");
    setModal(null);
  }

  function handleCancel() {
    const result = cancelOrder(order.id);
    showToast(result.ok ? "Order cancelled." : result.error, result.ok ? "success" : "error");
    setModal(null);
  }

  const dashboardHref = isClient ? "/dashboard/client" : "/dashboard/freelancer";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link
        href={dashboardHref}
        className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-10">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-slate-500">Order #{order.id.slice(-6).toUpperCase()}</p>
              <StatusBadge status={order.status} />
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              {gig?.title ?? "This gig is no longer available"}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <SafeImage src={gig?.image} alt="" className="h-full w-full object-cover" />
              </div>
              {gigExists ? (
                <Link href={`/gigs/${order.gigId}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                  View gig
                </Link>
              ) : (
                <p className="text-sm text-slate-500">The freelancer has removed this gig.</p>
              )}
            </div>
          </header>

          <section aria-labelledby="requirements-heading">
            <h2 id="requirements-heading" className="text-xl font-semibold text-slate-900">
              Requirements
            </h2>
            <p className="mt-3 whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-700">
              {order.requirements}
            </p>
          </section>

          <section aria-labelledby="delivery-heading">
            <h2 id="delivery-heading" className="text-xl font-semibold text-slate-900">
              Delivery
            </h2>
            {order.deliveryLink || order.deliveryNote ? (
              <div className="mt-3 space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
                {order.deliveryLink &&
                  (safeLink ? (
                    <a
                      href={order.deliveryLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 break-all text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" /> {order.deliveryLink}
                    </a>
                  ) : (
                    <p className="break-all text-sm text-slate-700">{order.deliveryLink}</p>
                  ))}
                {order.deliveryNote && (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{order.deliveryNote}</p>
                )}
                {order.status === "active" && (
                  <p className="text-xs text-slate-500">This is the previous delivery. A new one is expected.</p>
                )}
              </div>
            ) : (
              <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                Nothing has been delivered yet.
              </p>
            )}
          </section>

          <section aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="text-xl font-semibold text-slate-900">
              Order timeline
            </h2>
            <div className="mt-5 pl-1">
              <OrderTimeline timeline={order.timeline} />
            </div>
          </section>

          {order.status === "completed" && (
            <section aria-labelledby="review-heading">
              <h2 id="review-heading" className="text-xl font-semibold text-slate-900">
                Review
              </h2>
              {review ? (
                <div className="mt-3">
                  <ReviewCard review={review} />
                </div>
              ) : (
                <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                  {isClient ? "You have not reviewed this order yet." : "The client has not left a review yet."}
                </p>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Order total</p>
            <p className="text-3xl font-bold text-slate-900">{formatPrice(order.price)}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                {gig?.deliveryDays ?? "?"} day delivery
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-indigo-600" />
                Revisions used: {order.revisionsUsed} of {revisionLimit}
              </li>
              <li className="text-xs text-slate-500">Placed on {formatDate(order.createdAt)}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <PersonCard label="Client" name={client?.name ?? "Unknown client"} avatar={client?.avatar} />
            <PersonCard
              label="Freelancer"
              name={freelancer?.name ?? "Unknown freelancer"}
              avatar={freelancer?.avatar}
              href={freelancer ? `/freelancers/${freelancer.id}` : undefined}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Actions</h2>
            <p className="mt-1 text-xs text-slate-500">
              You are viewing this order as the {isClient ? "client" : "freelancer"}.
            </p>
            {hint && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{hint}</p>}

            {hasButtons ? (
              <div className="mt-4 space-y-3">
                {canDeliver && (
                  <button
                    type="button"
                    onClick={() => setModal("deliver")}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    {revisionPending ? "Deliver revision" : "Deliver work"}
                  </button>
                )}
                {canComplete && (
                  <button
                    type="button"
                    onClick={() => setModal("complete")}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Approve and complete order
                  </button>
                )}
                {canRevise && (
                  <button
                    type="button"
                    onClick={() => setModal("revision")}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Request a revision
                  </button>
                )}
                {canReview && (
                  <button
                    type="button"
                    onClick={() => setModal("review")}
                    className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Leave a review
                  </button>
                )}
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => setModal("cancel")}
                    className="w-full rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Cancel order
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No actions available right now.</p>
            )}
          </div>
        </aside>
      </div>

      <DeliverModal order={order} open={modal === "deliver"} onClose={() => setModal(null)} />
      <RevisionModal order={order} left={revisionsLeft} open={modal === "revision"} onClose={() => setModal(null)} />
      <ReviewModal order={order} open={modal === "review"} onClose={() => setModal(null)} />
      <ConfirmModal
        open={modal === "complete"}
        title="Approve this work?"
        message="Completing the order confirms you are happy with the delivery. After this you can leave a review."
        confirmLabel="Complete order"
        onConfirm={handleComplete}
        onClose={() => setModal(null)}
      />
      <ConfirmModal
        open={modal === "cancel"}
        title="Cancel this order?"
        message="The order will be marked as cancelled for both the client and the freelancer. This cannot be undone."
        confirmLabel="Cancel order"
        danger
        onConfirm={handleCancel}
        onClose={() => setModal(null)}
      />
    </div>
  );
}