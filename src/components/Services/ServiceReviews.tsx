/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface ReviewItem {
  id?: string;
  customerName?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  avatarUrl?: string | null;
  customerId?: string;
}

interface Props {
  serviceId: string;
  initialReviews?: ReviewItem[];
}

export default function ServiceReviews({ serviceId, initialReviews = [] }: Props) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
  const [loading, setLoading] = useState<boolean>(!initialReviews?.length);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  // new state to control whether current user can submit review
  const [canSubmit, setCanSubmit] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);
  const [checkingBooking, setCheckingBooking] = useState(true);

  // edit/delete state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  const getCustomerId = () => {
    try {
      const raw = localStorage.getItem("user") || localStorage.getItem("customer") || "{}";
      const parsed = JSON.parse(raw);
      return parsed?.userId || parsed?.id || parsed?.customerId || null;
    } catch {
      return localStorage.getItem("user.userId") || null;
    }
  };

  // Function to fetch customer details
  const fetchCustomerDetails = async (customerId: string): Promise<{ firstName: string; lastName: string }> => {
    try {
      const res = await fetch(`${BASE_URL}/customer/getdetails/${customerId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch customer details: ${res.status}`);
      }

      const json = await res.json();
      if (json.status === "true" && json.data) {
        return {
          firstName: json.data.firstName || "Customer",
          lastName: json.data.lastName || "",
        };
      }
      throw new Error("Invalid customer data");
    } catch (error) {
      console.error("Error fetching customer details:", error);
      return { firstName: "Customer", lastName: "" };
    }
  };

  // Function to fetch reviews with customer names
  const fetchReviewsWithCustomerNames = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/review/service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceId: serviceId
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch reviews: ${res.status}`);
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Fetch customer details for each review
        const reviewsWithCustomerNames = await Promise.all(
          json.data.map(async (r: any) => {
            let customerName = "user";
            try {
              if (r.customerId) {
                const customerDetails = await fetchCustomerDetails(r.customerId);
                customerName = `${customerDetails.firstName} ${customerDetails.lastName}`.trim();
              } else if (r.customer) {
                customerName = `${r.customer.firstName || ""} ${r.customer.lastName || ""}`.trim() || "user";
              }
            } catch (error) {
              console.error(`Failed to fetch customer details for ${r.customerId}:`, error);
            }

            return {
              id: r.id?.toString(),
              customerName,
              rating: Number(r.rating) || 0,
              comment: r.comment || "",
              createdAt: r.createdAt,
              avatarUrl: null,
              customerId: r.customerId || r.customer?.userId || null,
            };
          })
        );

        setReviews(reviewsWithCustomerNames);
      }
    } catch (err) {
      console.error("Failed to load reviews", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch latest reviews from backend if available
    let cancelled = false;

    async function fetchReviews() {
      if (!cancelled) {
        await fetchReviewsWithCustomerNames();
      }
    }

    if (!initialReviews?.length) fetchReviews();
    else setLoading(false);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  useEffect(() => {
    // check customer's bookings to determine whether they have a CONFIRMED or COMPLETED booking for this service
    let cancelled = false;
    async function checkConfirmedBooking() {
      const customerId = getCustomerId();
      if (!customerId) {
        setCanSubmit(false);
        setConfirmedBookingId(null);
        setCheckingBooking(false);
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/booking/customer/${customerId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          // don't allow submit if cannot verify
          setCanSubmit(false);
          setConfirmedBookingId(null);
          setCheckingBooking(false);
          return;
        }

        const json = await res.json();
        const bookings = Array.isArray(json.data) ? json.data : [];

        // find bookings for this service and with CONFIRMED or COMPLETED status 
        const eligibleBookings = bookings
          .filter((b: any) =>
            String(b.serviceId) === String(serviceId) &&
            (String(b.status).toUpperCase() === "CONFIRMED" || String(b.status).toUpperCase() === "COMPLETED")
          )
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (!cancelled && eligibleBookings.length > 0) {
          setCanSubmit(true);
          setConfirmedBookingId(eligibleBookings[0].id);
        } else {
          setCanSubmit(false);
          setConfirmedBookingId(null);
        }
      } catch (err) {
        console.error("Failed to verify customer booking", err);
        setCanSubmit(false);
        setConfirmedBookingId(null);
      } finally {
        if (!cancelled) setCheckingBooking(false);
      }
    }

    checkConfirmedBooking();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, token]);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }, [reviews]);

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // index 0 => 5 stars, index 4 => 1 star
    reviews.forEach((r) => {
      const idx = Math.max(1, Math.min(5, Math.round(r.rating)));
      dist[5 - idx] += 1;
    });
    return dist;
  }, [reviews]);

  const submitReview = async () => {
    if (!comment.trim()) {
      toast.error("Please add a comment for your review.");
      return;
    }
    if (!canSubmit) {
      toast.error("You can only submit a review after your booking has been confirmed or completed.");
      return;
    }

    setSubmitting(true);
    try {
      const customerId = getCustomerId();
      const body = {
        serviceId,
        rating,
        comment: comment.trim(),
        customerId,
        bookingId: confirmedBookingId
      };

      const res = await fetch(`${BASE_URL}/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to submit review' }));
        throw new Error(errorData.message || `Failed to submit review: ${res.status}`);
      }

      const json = await res.json();

      if (json.success) {
        // Get current user's name for the new review
        let customerName = "You";
        try {
          if (body.customerId) {
            const customerDetails = await fetchCustomerDetails(body.customerId);
            customerName = `${customerDetails.firstName} ${customerDetails.lastName}`.trim();
          }
        } catch (error) {
          console.error("Failed to fetch current user details:", error);
        }

        // Create new review object from the response
        const newReview: ReviewItem = {
          id: json.data?.id?.toString(),
          customerName,
          rating: json.data?.rating || rating,
          comment: json.data?.comment || comment,
          createdAt: json.data?.createdAt || new Date().toISOString(),
          customerId: body.customerId,
        };

        // Add the new review to the list
        setReviews((prev) => [newReview, ...prev]);
        setComment("");
        setRating(5);
        toast.success("Thank you — your review was submitted successfully!");
      } else {
        throw new Error(json.message || "Failed to submit review");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // update review
  const submitEdit = async (id: string) => {
    if (!editComment.trim()) {
      toast.error("Please add a comment for your review.");
      return;
    }
    setEditSubmitting(true);
    try {
      const customerId = getCustomerId();
      const body = { customerId, rating: editRating, comment: editComment.trim() };

      const res = await fetch(`${BASE_URL}/review/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(`Failed to update review: ${res.status} ${err}`);
      }

      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Update failed");

      // update local list
      setReviews((prev) => prev.map(r => (r.id === id ? { ...r, rating: editRating, comment: editComment, createdAt: json.data?.updatedAt || r.createdAt } : r)));
      setEditingId(null);
      toast.success("Review updated");
    } catch (err: any) {
      console.error("Failed to update review", err);
      toast.error(err.message || "Failed to update review");
    } finally {
      setEditSubmitting(false);
    }
  };

  // delete review
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const customerId = getCustomerId();
      const res = await fetch(`${BASE_URL}/review/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ customerId }),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(`Failed to delete review: ${res.status} ${err}`);
      }

      const json = await res.json().catch(() => ({ success: true }));
      if (json && json.success === false) throw new Error(json.message || "Delete failed");

      setReviews((prev) => prev.filter(r => r.id !== id));
      toast.success("Review deleted");
    } catch (err: any) {
      console.error("Failed to delete review", err);
      toast.error(err.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  // Show loading state while checking booking status
  if (checkingBooking) {
    return (
      <section className="bg-white rounded-2xl shadow border border-gray-200 p-6 mt-8">
        <div className="text-center py-8 text-gray-500">Checking booking status...</div>
      </section>
    );
  }

  const currentCustomerId = getCustomerId();

  return (
    <section className="p-2">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reviews & Ratings</h2>
          <p className="text-sm text-gray-600 mt-1">See what couples say — add your own review to help others.</p>
        </div>

        <div className="mt-4 md:mt-0 md:flex md:items-center md:gap-6">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{average.toFixed(1)}</div>
              <div className="text-sm text-gray-500">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starIndex = i + 1;
                  return (
                    <Star
                      key={i}
                      size={16}
                      className={`mr-0.5 ${starIndex <= Math.round(average) ? "text-yellow-400" : "text-gray-200"}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* distribution */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="col-span-2 space-y-2">
          {distribution.map((count, idx) => {
            const star = 5 - idx;
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 text-sm text-gray-700">{star}★</div>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div style={{ width: `${pct}%` }} className="h-3 bg-purple-600" />
                </div>
                <div className="w-10 text-right text-sm text-gray-600">{count}</div>
              </div>
            );
          })}
        </div>

        {/* submit form - show only if user has a confirmed or completed booking */}
        {canSubmit ? (
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Write a review</div>

            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const filled = hoverRating !== null ? value <= hoverRating : value <= rating;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${value} star`}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(value)}
                    className={`p-1 ${filled ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <Star size={20} />
                  </button>
                );
              })}
              <div className="text-sm text-gray-600 ml-2">{rating} / 5</div>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience — help others choose the right vendor."
              className="w-full p-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm mb-3 bg-white"
              rows={4}
            />

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-gray-500">You can edit or remove your review later.</div>
              <button
                onClick={submitReview}
                disabled={submitting}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white ${submitting ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-4 border border-gray-100 bg-purple-50 text-sm text-gray-600">
            You can submit a review only after your booking for this service is confirmed or completed.
          </div>
        )}
      </div>

      {/* list of reviews */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet — be the first to review this service.</div>
        ) : (
          reviews.map((r) => {
            const isMine = String(r.customerId) === String(currentCustomerId);
            const inEditMode = editingId === r.id;
            return (
              <div key={r.id || `${r.createdAt}-${r.customerName}`} className="p-4 border border-gray-100 rounded-lg bg-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                    {(r.customerName || "U").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{r.customerName || "Anonymous"}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={14} className={`${i < Math.round(r.rating) ? "text-yellow-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          <div>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</div>
                        </div>
                      </div>


                      {isMine && !inEditMode && (
                        <div className="flex items-center gap-1 ml-3">
                          <button
                            onClick={() => {
                              setEditingId(r.id || null);
                              setEditRating(r.rating || 5);
                              setEditComment(r.comment || "");
                            }}
                            aria-label="Edit review"
                            title="Edit"
                            className="inline-flex items-center justify-center w-8 h-8 text-purple-600 hover:bg-gray-100 rounded p-1"
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(r.id!)}
                            disabled={deletingId === r.id}
                            aria-label="Delete review"
                            title="Delete"
                            className={`inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-gray-100 rounded p-1 ${deletingId === r.id ? "opacity-60 pointer-events-none" : ""}`}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {!inEditMode && <p className="mt-3 text-gray-700">{r.comment}</p>}

                    {inEditMode && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const v = i + 1;
                            return (
                              <button
                                key={i}
                                onClick={() => setEditRating(v)}
                                type="button"
                                className={`p-1 ${v <= editRating ? "text-yellow-400" : "text-gray-300"}`}
                              >
                                <Star size={18} />
                              </button>
                            );
                          })}
                          <div className="text-sm text-gray-600 ml-2">{editRating} / 5</div>
                        </div>

                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="w-full p-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm mb-2"
                          rows={3}
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => submitEdit(r.id!)}
                            disabled={editSubmitting}
                            className={`px-3 py-1 rounded-lg text-white ${editSubmitting ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"}`}
                          >
                            {editSubmitting ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                            }}
                            className="px-3 py-1 rounded-lg border"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}